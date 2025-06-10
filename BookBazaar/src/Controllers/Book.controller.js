import { db } from "../lib/db.js";

export const Add_Book = async (req , res) => {
    try {
        
        
        const {title , author , price , description} = req.body;

        if(req.user.role !== "ADMIN"){
            return res.status(403).json({
                message:"Unauthorised"
            })
        }

        const New_Book = await db.Book.create({
            data:{
                title ,
                author,
                price,
                description
            }
        })

        console.log("New Book :" , New_Book);

        res.status(201).json({
            message:"book created Successfully",
            success: true ,
            Book : New_Book
        })

    } catch (error) {
        console.log("error occured while Adding Book" , error);
        res.status(500).json({
            message:"error occured while Adding Book",
            error
        })
    }
}

export const List_All_Books = async (req , res) => {
    try {

        const {title , author , minPrice , maxPrice} = req.query;
        const filters = {};

        if(title){
            filters.title = {
                contains : title ,
                mode:"insensitive"
            }
        }

        if(author){
            filters.author = {
                contains : title ,
                mode:"insensitive"
            }
        }

        if(minPrice || maxPrice){
            filters.price = {};
            if(minPrice) filters.price.gte = parseFloat(minPrice);
            if(maxPrice) filters.price.lte = parseFloat(maxPrice);
        }

        const all_books = await db.Book.findMany({
            where:filters,
        })
        console.log(all_books)
        res.status(200).json({
            message: "Books fetched successfully",
            data: all_books,
        });
        
    } catch (error) {
        console.log("error occured while fetching list of all Books" , error);
        res.status(500).json({
            message:"error occured while fetching list of all Books",
            error
        })
    }    
}

export const Get_Book = async (req , res) => {
    try {

        const {book_id } = req.params;
        console.log("book id :", book_id)
        if(!book_id) return res.status(400).json({message:"book id is required"});

        //pasgination
        const {limit} = req.query;

        const reviewsLimit = parseInt(limit) || 5 

        const Fetched_book = await db.Book.findUnique({
            where:{id:book_id},
            include:{
                reviews:{
                    take: reviewsLimit,
                    orderBy: {
                        createdAt: "desc",
                    },
                    include:{
                        user:{
                            select:{
                                id:true,
                                name:true,
                                email:true
                            }
                        }
                    }
                }
            }
        })

        const Average_Rating = await db.Review.aggregate({
            where:{ bookId : book_id },
            _avg:{
                rating:true
            }
        })

        console.log("Details of book fetched :", Fetched_book);
        console.log("Average rating of book fetched :", Average_Rating)

        res.status(201).json({
            message:"book fetched successflly",
            success:true ,
            book:Fetched_book ,
            averageRating:Average_Rating
        })

        
    } catch (error) {
        console.log("error occured while fetching a book details", error)
        res.status(500).json({
            message:"error occured while fetching book details",
            error
        })
    }
}

export const UpdateBook = async (req , res) => {
    try {
        const {book_id} = req.params;
        if(!book_id) res.status(500).json({message:"book id is required"});

        const {title , author , price , description}= req.body;

        const updated_book = await db.Book.update({
            where:{id:book_id},
            data:{
                ...(title && {title}),
                ...(author && {author}),
                ...(price && {price:parseFloat(price)}),
                ...(description && {description})
            }
        })

        console.log("updated book :" , updated_book);

        res.status(200).json({
            message:"book updated successfully",
            book:updated_book
        })

    } catch (error) {
        console.log("error occured while updating book" , error);
        res.status(500).json({
            message:"error occured while updating book",
            error
        })
    }
}

export const Delete_Book = async (req , res) => {

    try {
        const {book_id} = req.params;
        if(!book_id) return res.status(500).json({message:"book_id  is required"});
    
        const Book_exist = await db.Book.findUnique({
            where:{id : book_id}
        })
    
        if(!Book_exist) return res.status(401).json({message:"no such book exist"});
    
        await db.Book.delete({where: { id : book_id }});
    
        res.status(200).json({
            message:"book deleted successfully",
            success: true
        })
    } catch (error) {
        console.log("error occured while deleting book" , error)
        res.status(500).json({
            message:"error occured while deleting book",
            error
        })
    }
}

export const Add_Review_To_Book = async (req , res) => {
    try {

        const user_id = req.user.id ;
        const {book_id} = req.params ;
        const {description , rating} = req.body ;

        if(!user_id || !book_id) {
            return res.status(500).json({
                message:"user_id or book_id is missing"
            })
        }

        const New_Review = await db.Review.create({
            data:{

                userId:user_id,
                bookId:book_id,
                description,
                rating
            }
        })

        console.log("Review added to book" , New_Review);
        
        res.status(200).json({
            message:"review added successfully !",
            success:true ,
            Review:New_Review
        })
    } catch (error) {
        console.log("error occured in adding reviews" , error)
        res.status(500).json({
            message:"failed to load reviews",
            error
        })
    }
}

export const List_Reviews_For_A_Book = async (req, res) => {
  try {
    const { book_id } = req.params;

    if (!book_id) {
      return res.status(400).json({ message: "book_id is required" });
    }

    const bookWithReviews = await db.book.findUnique({
      where: { id: book_id },
      select: {
        title: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!bookWithReviews) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      message: "Reviews for the book fetched successfully",
      book: bookWithReviews,
    });

  } catch (error) {
    console.log("Error occurred while fetching reviews for a book:", error);
    res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};


export const Delete_Review_For_A_Book = async (req , res) => {

   try {
     const {book_id , review_id}= req.params;
     if(!book_id || !review_id){
         return res.status(500).json({
             message:"book_id or review_id is missing"
         })
     }
 
     const review_exists = await db.Review.findUnique({
         where:{
             id:review_id,
             bookId:book_id
         } 
     })
 
     if(!review_exists){
         return res.status(500).json({
             message:"no such review exists"
         })
     }
 
     console.log("existed review to be deleted by owner of the book :" , review_exists);
 
     await db.Review.delete({
         where:{
             id:review_id,
             bookId:book_id
         }
     })
 
     res.status(200).json({
         message:"Review deleted successfully"
     })
 
   } catch (error) {
    console.log("error occured while deleting the review",error)
    res.status(500).json({
        message:"error occured while deleting the review",
        error
    })
   }
}

export const Owner_of_book = async(req, res) =>{
    try {
        const {book_id , owner_id} = req.params ;
        const{name} = req.body

        const Owner = await db.owner.create({
            data:{
                userId : owner_id,
                bookId:book_id ,
                name
            }
        })

        console.log(Owner)
        res.status(200).json({message:"owner of the book created succesfully"})
    } catch (error) {
        console.log("error ocurred while creating owner of book",error);
        res.status(500).json({message:"error ocurred while creating owner of book",error})
    }
}









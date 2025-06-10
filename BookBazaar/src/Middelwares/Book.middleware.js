import { db } from "../lib/db.js"

export const BookOwnerMiddleware = async(req, res , next) => { 
   try {
     const {book_id} = req.params
    
           const owner_of_book = await db.owner.findUnique({
                where: {
                    userId_bookId: {
                    userId: req.user.id,
                    bookId: book_id,
                    }
                }
            });
 
            if(owner_of_book) next();
   
   } catch (error) {
        console.log("error occured in Book owner middleware " , error);
        res.status(500).json({
            message:"error occured in book owner middleware",
            error
        })
   }
}
import { Router } from "express";
import { apiKeyAuthMiddleware, authMiddelware, checkAdmin } from "../Middelwares/auth.middleware.js";
import {
     Add_Book ,
    Add_Review_To_Book,
    Delete_Book,
    Delete_Review_For_A_Book,
    Get_Book,
    List_All_Books,
    List_Reviews_For_A_Book,
    Owner_of_book,
    UpdateBook 
    
} from "../Controllers/Book.controller.js";
import { BookOwnerMiddleware } from "../Middelwares/Book.middleware.js";

const router = Router();

router.post("/add-book",authMiddelware ,  checkAdmin ,  Add_Book);
router.get("/all_books" , authMiddelware , apiKeyAuthMiddleware, List_All_Books);
router.get("/get-book/:book_id" , authMiddelware , apiKeyAuthMiddleware , Get_Book);
router.put("/UpdateBook/:book_id", authMiddelware ,  checkAdmin , UpdateBook);
router.delete("/deleteBook/:book_id" , authMiddelware ,  checkAdmin , Delete_Book)

router.post("/reviews/:book_id" , authMiddelware , Add_Review_To_Book)
router.get("/ListReviews/:book_id" , authMiddelware , List_Reviews_For_A_Book )
router.delete("/DeleteReviews/:book_id/:review_id" , authMiddelware , BookOwnerMiddleware , Delete_Review_For_A_Book )

router.post("/createOwner/:book_id/:owner_id", authMiddelware , checkAdmin , Owner_of_book)

export default router
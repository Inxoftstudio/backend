const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth")


// import controllers 
const authController = require("../controller/auth");
const blogController = require("../controller/blog");
const CommentController = require("../controller/comment");


// user routes
router.post('/register', authController.register)      // register
router.post('/login', authController.login)            // login
router.post('/logout', auth, authController.logout)    // logout
router.get('/refresh', authController.refresh)         // refresh


// blog routes
router.post('/blog', auth, blogController.create)       // create 
router.put('/blog', auth, blogController.update)        // Edit
router.get('/blog/all', auth, blogController.getAll)    // Get All
router.get('/blog/:id', auth, blogController.getById)   // Get By Id
router.delete('/blog/:id', auth, blogController.delete) // Delete  



// comment routes
router.get('/comment/:id', auth, CommentController.getById)  // get by id  
router.post('/comment', auth, CommentController.create)      // create



module.exports = router;
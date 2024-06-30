import express from 'express';
import { userAuth } from '../middleware/authMiddleware.js';
import { createPost } from '../controllers/postController.js';
import { getPosts } from '../controllers/postController.js';
import { getPost } from '../controllers/postController.js';
import { getUserPost } from '../controllers/postController.js';
import { getComments } from '../controllers/postController.js';
import { likePost } from '../controllers/postController.js';
import { likePostComment } from '../controllers/postController.js';
import { commentPost } from '../controllers/postController.js';
import { replyPostComment  } from '../controllers/postController.js';
import { deletePost } from '../controllers/postController.js';
const router = express.Router(); 

//create post
router.post("/create-post", userAuth, createPost);
//get post
router.post('/', userAuth, getPosts)
router.post('/:id', userAuth, getPost);

router.post("/get-user-post/:id", userAuth, getUserPost);

//get comments
router.get("/comments/:postId",getComments )
 
router.post("/like/:id", userAuth, likePost);
router.post("/like-comment/:id/:rid?", userAuth, likePostComment);
router.post("/comment/:id", userAuth, commentPost);
router.post("/reply-comment/:id", userAuth, replyPostComment);

//delete post
router.delete("/:id", userAuth, deletePost);

export default router
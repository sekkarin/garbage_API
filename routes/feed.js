const express = require('express');
const { body } = require("express-validator")
const feedController = require('../controllers/feed');
const isAuth = require('../middlewares/is-auth')
const router = express.Router();

// GET /feed/posts
router.get('/posts',isAuth, feedController.getPosts);
// post/posts/............
// POST /feed/post
router.post('/post',isAuth,
    [body("title").rtrim().isLength({ min: 5 }),
    body('content').rtrim().isLength({ min: 5 })], feedController.createPost);


router.get('/post/:postId',isAuth, feedController.getPost)


router.put('/post/:postId',isAuth,
    [body("title").rtrim().isLength({ min: 5 }),
    body('content').rtrim().isLength({ min: 5 })], feedController.updatePost)

router.delete('/post/:postId',isAuth,feedController.deletePost)



module.exports = router;
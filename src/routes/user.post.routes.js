const express = require('express');
const postrouter = express.Router();
const { validate_session_redis } = require("../middleware/user.sessionredis");
const { createPostController,
    createCommentController,
    getAllPostController,
    getAllPostsByMeController,
    getActivePostByMeController,
    getAllSoldPostByMeController,
    getPostsByIdController,
    getAllCommentsOnPostController,
    updatePostController,
    deletePostController,
    deleteCommentController
} = require('../controller/user.post.controller');

postrouter.route('/createpost').post(validate_session_redis, createPostController);
postrouter.route('/createcomment/:post_id').post(validate_session_redis, createCommentController);
postrouter.route('/allposts').get(validate_session_redis, getAllPostController);
postrouter.route('/allpostbyme').get(validate_session_redis, getAllPostsByMeController);
postrouter.route('/allactivepostbyme').get(validate_session_redis, getActivePostByMeController);
postrouter.route('/allsoldpostbyme').get(validate_session_redis, getAllSoldPostByMeController);
postrouter.route('/postsbyid/:id').get(validate_session_redis, getPostsByIdController);
postrouter.route('/comments/:post_id').get(validate_session_redis, getAllCommentsOnPostController);
postrouter.route('/updatepost/:post_id').patch(validate_session_redis, updatePostController);
postrouter.route('/deletepost/:post_id').delete(validate_session_redis, deletePostController);
postrouter.route('/deletecomment/:comment_id').delete(validate_session_redis, deleteCommentController);


module.exports = { postrouter };
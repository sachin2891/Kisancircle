const { userCreatePost, userCreateComment, getAllPost, getAllPostsByMe,
    getAllSoldPostByMe, getActivePostByMe, getPostsById, getAllCommentsOnPost, updatePost, deletePost, deleteComment } = require("../services/user.post.services");
const createPostController = async (req, res) => {
    try {
        const result = await userCreatePost(req);
        if (!result) {
            res.status(401).send("Error while creating post");
        }
        res.status(201).send({ Post: result });

    } catch (error) {
        res.status(500).send(error);

    }
}
const createCommentController = async (req, res) => {
    try {
        const result = await userCreateComment(req);
        if (!result) {
            res.status(401).send("Error while creating comment");
        }
        res.status(201).send({ Comment: result });

    } catch (error) {
        res.status(500).send(error);
    }

}

const getAllPostController = async (req, res) => {
    try {
        const result = await getAllPost();
        if (!result) {
            res.status(401).send("Error while fetching the posts");
        }
        res.status(201).send({ Posts: result });

    } catch (error) {
        res.status(500).send(error);

    }
}
const getAllPostsByMeController = async (req, res) => {
    try {
        const result = await getAllPostsByMe(req);
        if (!result) {
            res.status(401).send("Error while fetching the posts");
        }
        res.status(201).send({ Posts: result });
    }
    catch (err) {
        res.status(500).send(err);
    }
}
const getActivePostByMeController = async (req, res) => {
    try {
        const result = await getActivePostByMe(req);
        if (!result) {
            res.status(401).send("Error while fetching the posts");
        }
        res.status(201).send({ Posts: result });
    }
    catch (err) {
        res.status(500).send(err);
    }
}
const getAllSoldPostByMeController = async (req, res) => {
    try {
        const result = await getAllSoldPostByMe(req);
        if (!result) {
            res.status(401).send("Error while fetching the posts");
        }
        res.status(201).send({ Posts: result });
    }
    catch (err) {
        res.status(500).send(err);
    }
}
const getPostsByIdController = async (req, res) => {
    try {
        const result = await getPostsById(req);
        if (!result) {
            res.status(401).send("Error while fetching the posts");
        }
        res.status(201).send({ Posts: result });
    }
    catch (err) {
        res.status(500).send(err);
    }
}
const getAllCommentsOnPostController = async (req, res) => {
    try {
        const result = await getAllCommentsOnPost(req);
        if (!result) {
            res.status(401).send("Error while fetching the Comments");
        }
        res.status(201).send({ Posts: result });
    }
    catch (err) {
        res.status(500).send(err);
    }
}
const updatePostController = async (req, res) => {
    try {
        const result = await updatePost(req);
        res.status(201).send({ Posts: result });
    }
    catch (err) {
        res.status(500).send(err);
    }
}
const deletePostController = async (req, res) => {
    try {
        const result = await deletePost(req);
        res.status(201).send({ Posts: result });
    }
    catch (err) {
        res.status(500).send(err);
    }
}
const deleteCommentController = async (req, res) => {
    try {
        const result = await deleteComment(req);
        res.status(201).send({ Posts: result });
    }
    catch (err) {
        res.status(500).send(err);
    }
}
module.exports = {
    createPostController,
    createCommentController,
    getAllPostController,
    getAllPostsByMeController,
    getAllSoldPostByMeController,
    getActivePostByMeController,
    getPostsByIdController,
    getAllCommentsOnPostController,
    updatePostController,
    deleteCommentController,
    deletePostController
};
const Comment = require("../models/user.comment.schema");
const Post = require("../models/user.post.schema");

const userCreatePost = async (req) => {

    try {
        // console.log("user create post");

        const fromUserId = req.user.user_id;
        // console.log(fromUserId);

        const { image, crop, description, base_price, duration, quantity } = req.body;
        //duration can be 3-7 days

        if (duration < 3 || duration > 7) {
            return res.status(400).json({ error: "Sell duration must be between 3 to 7 days." });
        }
        const selltill = new Date();
        selltill.setDate(selltill.getDate() + duration);
        const newPost = new Post({
            fromUserId,
            image,
            crop,
            description,
            base_price,
            selltill,
            quantity
        });
        await newPost.save();
        return { success: true, message: "Post created successfully", newPost };
    } catch (error) {
        return { success: false, message: "Failed to create post" };
    }
};

const userCreateComment = async (req) => {
    try {
        const userId = req.user.user_id;
        const postId = req.params.post_id;
        const { bidAmount } = req.body;
        console.log(userId, postId, bidAmount);
        //////////////////////////////////////////////////////////////////////////////////////////////////////////need to implement bid amount can not be less then  base amount
        // //////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        //bidder id must be different post creator id
        // //////////////////////////////////////////////////////////////////////////////////////////////////////
        const newComment = new Comment({
            userId,
            postId,
            bidAmount
        });
        await newComment.save();
        return { success: true, message: "Comment created successfully", newComment };

    } catch (error) {
        return { success: false, message: "Failed to create comment" };

    }

}
const getAllPost = async () => {
    try {
        const productList = await Post.find({ is_sold: false });
        const filteredList = productList.filter(Post => Post.isActive);
        return filteredList;
    } catch (error) {
        return { success: false, message: "Failed to fetch Posts" };
    }
}

const getAllPostsByMe = async (req) => {
    try {
        const id = req.user.user_id;
        const productList = await Post.find({ fromUserId: id });
        return productList;
    }
    catch (err) {
        return { success: false, message: "Failed to fetch your posts" };
    }
}

const getActivePostByMe = async (req) => {
    try {
        const id = req.user.user_id;
        const productList = await Post.find({
            $and: [{ fromUserId: id }, { is_sold: false }]
        });
        const filteredList = productList.filter(Post => Post.isActive);
        return filteredList;
    }
    catch (err) {
        return { success: false, message: "Failed to fetch your posts" };
    }
}

const getAllSoldPostByMe = async (req) => {
    try {
        const productList = await Post.find({ is_sold: true });
        return productList;
    }
    catch (err) {
        return { success: false, message: "Failed to fetch your posts" };
    }
}
const getPostsById = async (req) => {
    try {
        const id = req.params.id;
        const productList = await Post.find({
            $and: [{ fromUserId: id }, { is_sold: false }]
        });
        const filteredList = productList.filter(Post => Post.isActive);
        return filteredList;

    }
    catch (err) {
        return { success: false, message: "Failed to fetch users posts" };
    }
}

const getAllCommentsOnPost = async (req) => {
    try {
        const commentList = await Comment.find({ postId: req.params.post_id });
        return commentList;
    }
    catch (err) {
        return { success: false, message: "something went wrong to load comments" };
    }
}

const updatePost = async (req) => {
    try {
        const post = await Post.findById({ _id: req.params.post_id });
        if (!post) {
            return { success: false, message: "Post not found" };
        }
        Object.keys(req.body).forEach(key => {
            if (key !== "base_price") {
                post[key] = req.body[key];
            }
        });
        await post.save();
        return {
            success: true,
            message: req.body.base_price
                ? "Base price is not allowed to update, other details updated successfully"
                : "Post updated successfully"
        };
    }
    catch (err) {
        return { success: false, message: "something went wrong to update post" };
    }
}
const deletePost = async (req) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.post_id);
        if (!post) {
            return { success: false, message: "Post not found" };
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Also delete all comments associated with post
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        // user should delete thier own comment
        /////////////////////////////////////////////////////////////////////////////////////////////////////
        return { success: true, message: "Post deleted successfully" };
    } catch (error) {
        console.error("Error deleting post:", error);
        return { success: false, message: "Something went wrong while deleting post", error };
    }
};
const deleteComment = async (req) => {
    try {
        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        // user should delete thier own comment
        /////////////////////////////////////////////////////////////////////////////////////////////////////
        const comment = await Comment.findByIdAndDelete(req.params.comment_id);
        if (!comment) {
            return { success: false, message: "Comment not found" };
        }
        return { success: true, message: "Comment deleted successfully" };
    } catch (error) {
        console.error("Error deleting comment:", error);
        return { success: false, message: "Something went wrong while deleting comment", error };
    }
};

module.exports = {
    userCreatePost,
    userCreateComment,
    getAllPost,
    getAllPostsByMe,
    getAllSoldPostByMe,
    getActivePostByMe,
    getPostsById,
    getAllCommentsOnPost,
    updatePost,
    deletePost,
    deleteComment
};
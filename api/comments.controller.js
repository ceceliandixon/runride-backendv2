import commentsDAO from "../dao/commentsDAO.js";

export default class commentsController {

    static async apiPostComment(req, res, next) {
        try {
            const activityId = req.body.activity_id;
            const comment = req.body.comment;
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id,
            }

            const date = new Date();

            const userResponse = await commentsDAO.addComment(
                activityId,
                userInfo,
                comment,
                date
            );

            var { error } = commentResponse;

            if (error) {
                res.status(500).json({ error: "Unable to post comment." });
            } else {
                res.json({
                    status: "success",
                    response: commentResponse
                });
            }
        } catch (e) {
            res.status(500).json({ error: e});
        }
    }

    
    static async apiUpdateComment(req, res, next) {
        
        try {
            const _id = req.body.comment_id;
            const comment = req.body.comment;

            const date = new Date();

            const commentResponse = await commentsDAO.updateComment(
                _id,
                req.body.user_id,
                comment,
                date
            )

            var { error } = commentResponse
            if (error) {
                res.status(500).json({ error });
            }

            if (commentResponse.modifiedCount == 0) {
                throw new Error ("Unable to update comment.")
            }
            res.json({ status: "success " });
        } catch(e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiDeleteComment(req, res, next) {
        try {
            const commentId = req.body.comment_id;
            const userId = req.body.user_id;
            const commentResponse = await commentsDAO.deletecomment(
                commentId,
                userId,
            );

            var { error } = commentResponse;
            if (error) {
                res.status(500).json({ error });
            } else {
                res.json({ status: "success" });
            }
        } catch(e) {
            res.status(500).json({ error: e.message });
        }
    }
}
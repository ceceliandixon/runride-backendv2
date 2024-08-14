import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectId;

let comments;

export default class commentsDAO {

    static async injectDB(conn) {
        if (comments) {
            return;
        }
        try {
            comments = await conn.db(process.env.RUNRIDE_COLLECTION)
                                    .collection('comments');
        } catch (e) {
            console.error(`Unable to connect to commentsDAO: ${e}`);
        }
    }

    static async addComment(activityId, user, comment, date) {
        try {
            const commentDoc = {
                name: user.name,
                user_id: user._id,
                date: date,
                comment: comment,
                activity_id: new ObjectId(activityId),
            }
            return await comments.insertOne(commentDoc);
        } catch(e) {
            console.error(`Unable to post comment: ${e}`);
            return { error: e};
        }
    }

    static async updateComment(commentId, userId, comment, date) {
        try {
            const updateComment= await comments.updateOne( // updateOne is mongoDB method to update one item
                { user_id: userId, _id: new ObjectId(commentId)}, // query criteria makes sure only review w given id is updated
                { $set: { comment: comment, date: date } } // actual update content aka review and date
            );
            return updateComment;
        } catch (e) {
            console.error(`Unable to update comment: ${e}`);
            return { error: e };
        }
    }


    static async deleteComment(commentId, userId) {
        try {
            const deleteComment = await comments.deleteOne({
                 _id: new ObjectId(commentId),
                  user_id: userId,
            });
        return deleteComment;
        } catch (e) {
            console.error(`Unable to delete comment: ${e}`);
            return { error: e };
        }
    }
}
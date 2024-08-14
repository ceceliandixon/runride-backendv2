
import mongodb from 'mongodb';

const ObjectId = mongodb.ObjectId;

let activities;

export default class activitiesDAO {

    static async injectDB(conn) {
        if (activities) {
            return;
        }
        try {
            activities = await conn.db(
                process.env.RUNRIDE_COLLECTION)
                .collection('activities');
        } catch (e) {
            console.error(`Unable to connect to activitiesDAO: ${e}`);
        }
    }

    
    static async addActivity(userName, userId, description, distance, activityType, picture = null, picturePath = null, likesList, date) {
        try {
            const activityDoc = {
                userName: userName,
                userId: userId,
                description: description,
                distance: distance,
                activityType: activityType,
                picture: picture || null,       // Default to null if picture is not provided
                picturePath: picturePath || null, // Default to null if picturePath is not provided
                likesList: likesList,
                date: date
            };
    
            return await activities.insertOne(activityDoc);
        } catch (e) {
            console.error(`Unable to post activity: ${e}`);
            return { error: e };
        }
    }

    

    static async updateActivity(activityId, userId, text, date) {
        try {
            const updateResponse= await activities.updateOne( // updateOne is mongoDB method to update one item
                { user_id: userId, _id: new ObjectId(activityId)}, // query criteria makes sure only activity w given id is updated
                { $set: { text: text, date: date } } // actual update content aka text and date
            );
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update activity: ${e}`);
            return { error: e };
        }
    }


    static async addLike(activityId, userId) {
        try {
            const updateResponse = await activities.updateOne(
                { _id: new ObjectId(activityId) },
                { $addToSet: { likesList: userId } } // Use $addToSet to add userId to the likes array
            );
    
            if (updateResponse.matchedCount === 0) {
                throw new Error('No activity found with the provided ID.');
            }
    
            return { status: 'success', matchedCount: updateResponse.matchedCount, modifiedCount: updateResponse.modifiedCount };
        } catch (e) {
            console.error(`Unable to add like: ${e.message}`); // Debugging
            return { error: e.message };
        }
    }

    static async getActivities() {
        try {
            // Fetch all activities from the database
            const cursor = await activities.find({}).toArray(); // No filters or pagination
            const totalNumActivities = cursor.length; // Count the number of activities
            return { activitiesList: cursor, totalNumActivities };
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { activitiesList: [], totalNumActivities: 0 };
        }
    }

    // static async getRatings() {}

    static async getActivityById(id) {
        try {
            return await activities.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                    }
                },
                {
                    $lookup: {
                        from: 'comments',
                        localField: '_id',
                        foreignField: 'activity_id',
                        as: 'comments',
                    }
                }
            ]).next();
        } catch (e) {
            console.error(`Unable to get activity by ID: ${e}`);
            throw e;
        }
    }

    static async getActivitiesByUserId(userId) {
        let query = { userId: userId }; // Use userId to filter activities
        try {
            const cursor = await activities.find(query);
            const activitiesList = await cursor.toArray();
            return activitiesList;
        } catch (e) {
            console.error(`Unable to fetch activities by user ID, ${e}`);
            return [];
        }
    }
}
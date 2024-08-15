// user.dao.js
import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectId;

let users;

export default class usersDAO {
  static async injectDB(conn) {
    if (users) {
      return;
    }
    try {
      users = await conn.db(process.env.RUNRIDE_COLLECTION).collection('users');
    } catch (e) {
      console.error(`Unable to connect to usersDAO: ${e}`);
    }
  }

  static async addUser(userId, profilePic, userName, friendsList) {
    try {
      const userDoc = {
        userId: userId,
        profilePic: profilePic,
        userName: userName,
        friendsList: friendsList,
      };
      return await users.insertOne(userDoc);
    } catch (e) {
      console.error(`Unable to register user: ${e}`);
      return { error: e };
    }
  }

  static async addFriend(userId, friendId) {
    try {
      // Update the user's friends list with string IDs
      const updateResponse = await users.updateOne(
        { userId: userId }, // Find user by userId (string)
        { $addToSet: { friendsList: friendId } } // Add friendId to friendsList (string)
      );

      if (updateResponse.matchedCount === 0) {
        throw new Error('No user found with the provided ID.');
      }

      return { status: 'success', matchedCount: updateResponse.matchedCount, modifiedCount: updateResponse.modifiedCount };
    } catch (e) {
      console.error(`Unable to add friend: ${e.message}`);
      return { error: e.message };
    }
  }

  static async getUser(id) {
    try {
      const user = await users.findOne({ userId: id });
      return user;
    } catch (e) {
      console.error(`Something went wrong in getUser: ${e}`);
      throw e;
    }
  }

  static async getFriends(id) {
    try {
      const user = await users.findOne({ userId: id });
      if (!user) {
        throw new Error('User not found');
      }
      return user.friendsList; // Return the friendsList array directly
    } catch (e) {
      console.error(`Something went wrong in getFriends: ${e}`);
      throw e;
    }
  }

  static async deleteUser(userId) {
    try {
      const deleteUser = await users.deleteOne({ userId: userId });
      return deleteUser;
    } catch (e) {
      console.error(`Unable to delete user: ${e}`);
      return { error: e };
    }
  }
}

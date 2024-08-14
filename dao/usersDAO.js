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

  static async updateFriends(userId, friendsList) {
    try {
      const updateResponse = await users.updateOne(
        { userId: userId },
        { $set: { friendsList: friendsList } },
        { upsert: true }
      );
      return updateResponse;
    } catch (e) {
      console.error(`Unable to update friends (DAO): ${e}`);
      return { error: e };
    }
  }

  static async getUser(id) {
    try {
        const user = await users.findOne({ userId: id });
        return user; // return null if user is not found
    } catch (e) {
        console.error(`Something went wrong in getUser: ${e}`);
        throw e; // only throw if there's an actual error with the query
    }
}

  static async getFriends(id) {
    let cursor;
    try {
      cursor = await users.find({ userId: id });
      const friends = await cursor.toArray();
      return friends[0];
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
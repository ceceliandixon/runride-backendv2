// users.controller.js
import usersDAO from '../dao/usersDAO.js';

export default class usersController {
  static async apiCreateUser(req, res, next) {
    try {
      const { userId, profilePic, userName, friendsList } = req.body;

      const userResponse = await usersDAO.addUser(userId, profilePic, userName, friendsList);

      if (userResponse.error) {
        res.status(500).json({ error: "Unable to register user." });
      } else {
        res.json({
          status: "success",
          response: userResponse
        });
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiAddFriend(req, res, next) {
    try {
      const userId = req.params.userId; // Extract userId from route parameters
      const friendId = req.body.friendId; // Extract friendId from request body

      console.log('Patching userId:', userId); // Debugging
      console.log('Friend ID:', friendId); // Debugging

      const userResponse = await usersDAO.addFriend(userId, friendId);

      const { error } = userResponse;
      if (error) {
        return res.status(500).json({ error });
      }

      if (userResponse.modifiedCount === 0) {
        throw new Error("Unable to update user. It might not exist or the friend might already be in the friends array.");
      }

      res.json({ status: "success" });
    } catch (e) {
      console.error('Error in apiAddFriend:', e.message); // Debugging
      res.status(500).json({ error: e.message });
    }
  }

  static async apiGetUser(req, res, next) {
    try {
      const id = req.params.userId;
      const user = await usersDAO.getUser(id);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(user);
    } catch (e) {
      console.log(`API, ${e.message}`);
      res.status(500).json({ error: e.message });
    }
  }

  static async apiGetFriends(req, res, next) {
    try {
      const id = req.params.userId;
      const friends = await usersDAO.getFriends(id);
      if (!friends) {
        res.status(404).json({ error: "Friends not found" });
        return;
      }
      res.json(friends);
    } catch (e) {
      console.log(`API, ${e.message}`);
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeleteUser(req, res, next) {
    try {
      const { userId } = req.body;

      const userResponse = await usersDAO.deleteUser(userId);

      if (userResponse.error) {
        res.status(500).json({ error: userResponse.error });
      } else {
        res.json({ status: "success" });
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}

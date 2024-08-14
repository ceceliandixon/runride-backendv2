import usersDAO from "../dao/usersDAO.js";

export default class usersController {

    static async apiCreateUser(req, res, next) {
        try {
            const userId = req.body.userId;
            const profilePic = req.body.profilePic;
            const userName = req.body.userName;
            const friendsList = Array.isArray(req.body.friendsList) ? req.body.friendsList : [];

            const userResponse = await usersDAO.addUser(
                userId,
                profilePic,
                userName,
                friendsList
            );

            var { error } = userResponse;

            if (error) {
                res.status(500).json({ error: "Unable to register user." });
            } else {
                res.json({
                    status: "success",
                    response: userResponse
                });
            }
        } catch (e) {
            res.status(500).json({ error: e});
        }
    }

    static async apiUpdateFriends(req, res, next) {
        try {
            console.log("Received update friends request:", req.body); // debugging
            
            const friendsResponse = await usersDAO.updateFriends(
                req.body.userId,
                req.body.friendsList
            )

            var { error } = friendsResponse
            if (error) {
                res.status(500).json({ error });
            } 

            res.json({status: "success"});
        } catch(e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiGetUser(req, res, next) {
        try {
            let id = req.params.userId;
            let user = await usersDAO.getUser(id);
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            res.json(user);
        } catch(e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetFriends(req, res, next) {
        try {
            let id = req.params.userId;
            let friends = await usersDAO.getFriends(id);
            if (!friends) {
                res.status(404).json({ error: "friends not found" });
                return;
            }
            res.json(friends);
        } catch(e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e});
        }
    }

    static async apiDeleteUser(req, res, next) {
        try {
            const userId = req.body.userId;
    
            const userResponse = await usersDAO.deleteuser(
                userId,
            );

            var { error } = userResponse;
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
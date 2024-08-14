import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import activitiesController from './activities.controller.js';
import commentsController from './comments.controller.js';
import usersController from './users.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/assets')); // Folder where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  },
});
const upload = multer({ storage });

// Routes for activities
router
  .route('/')
  .get(activitiesController.apiGetActivities)
  .post(upload.single('picture'), activitiesController.apiPostActivity) // Apply multer here
  .put(activitiesController.apiUpdateActivity)
  .delete(activitiesController.apiDeleteActivity);

router.route('/activities/user/:userId').get(activitiesController.apiGetActivitiesByUserId);

router.route('/activity/:id').get(activitiesController.apiGetActivityById);

router.route('/activities/:id/like')
    .patch(activitiesController.apiAddLike);

// Routes for comments
router
  .route('/comment')
  .post(commentsController.apiPostComment)
  .put(commentsController.apiUpdateComment)
  .delete(commentsController.apiDeleteComment);

// Routes for users
router
  .route('/users')
  .post(usersController.apiCreateUser)
  .put(usersController.apiUpdateFriends);

router.route('/users/:userId').get(usersController.apiGetUser);

export default router;
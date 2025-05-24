import express from 'express';
import authenticateAdmin from '../middlewares/authenticateAdmin.js';
import {
  createVideo,
  getAllVideos,
  updateVideo,
  deleteVideo
} from '../controllers/videoAdminController.js';

const router = express.Router();

router.post('/', authenticateAdmin, createVideo);
router.get('/', authenticateAdmin, getAllVideos);
router.put('/:id', authenticateAdmin, updateVideo);
router.delete('/:id', authenticateAdmin, deleteVideo);

export default router;
  
import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/bookmarks', authenticate, userController.getBookmarks);
router.post('/bookmarks/:listingId', authenticate, userController.toggleBookmark);

router.get('/wishlist', authenticate, userController.getWishlist);
router.post('/wishlist/:listingId', authenticate, userController.toggleWishlist);

export default router;

import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { addItemToCollection, getOrCreateCollection, removeItemFromCollection } from '../controllers/collection.controller.js';

const collectionRouter = Router()

collectionRouter.get('/', protect, getOrCreateCollection)


collectionRouter.post('/', protect, addItemToCollection)


collectionRouter.delete('/:sourceId', protect, removeItemFromCollection)

export default collectionRouter
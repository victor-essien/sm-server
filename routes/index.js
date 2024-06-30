import express from 'express';
import authRoute from './authRoute.js'
import userRoute from './userRoutes.js'
import postRoute from './postRoutes.js'
import chatRoute from './chatRoutes.js'
const router = express.Router();

router.use('/auth', authRoute) //auth/register
router.use('/users', userRoute)
router.use('/posts', postRoute)
router.use('/messages', chatRoute)
export default router
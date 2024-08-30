import express from 'express'

import { search } from '../controllers/bridge'

const router = express.Router()

router.post('/search', search)

export default router

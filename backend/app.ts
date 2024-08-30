import cors from 'cors'
import express from 'express'

import bridgeRouter from './routes/bridge'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/bridges', bridgeRouter)

export default app

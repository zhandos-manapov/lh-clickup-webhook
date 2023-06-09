import 'express-async-errors'
import express, { Express } from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import errorHandler from './middleware/error-handler'

// Routes
import authRouter from './routes/auth.route'
import teamRouter from './routes/team.route'
import spaceRouter from './routes/space.route'
import folderRouter from './routes/folder.route'
import webhookRouter from './routes/webhook.route'
import listRouter from './routes/list.route'
import taskRouter from './routes/task.route'

// Handlers
import { createProfileFieldMapping } from './controllers/profile.controller'
import authorize from './middleware/authorize'

dotenv.config()

const app: Express = express()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/v1/webhook', webhookRouter)
app.use('/api/v1/auth', authRouter)

app.use(authorize)
app.use('/api/v1/team', teamRouter)
app.use('/api/v1/space', spaceRouter)
app.use('/api/v1/folder', folderRouter)
app.use('/api/v1/list', listRouter)
app.use('/api/v1/task', taskRouter)
app.post('/api/v1/mapping', createProfileFieldMapping)

app.use(errorHandler)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
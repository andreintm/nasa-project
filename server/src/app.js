import express from 'express'
import cors from 'cors'
import path from 'path'
import morgan from 'morgan'
import { api } from './routes/api.js'

export const app = express()

const __dirname = path.dirname(
    new URL(import.meta.url).pathname
);

app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(morgan('combined'))

app.use(express.json())
app.use('/v1', api)
app.use(express.static('public'))

app.get('/*', (req, res) => {
    return res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

import * as dotenv from 'dotenv'

dotenv.config()

import http from 'http'
import { app } from './src/app.js'
import { loadPlanetsData } from './src/models/planets.model.js'
import { mongoConnect } from './src/services/mongo.js'
import { loadLaunchData } from './src/models/launches.model.js'

const PORT = process.env.PORT || 8000

const server = http.createServer(app)

async function startServer() {
    await mongoConnect()

    await loadPlanetsData()

    await loadLaunchData()

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
}

startServer()
import mongoose from 'mongoose';
import launches from './launches.mongo.js'
import planets from './planets.mongo.js'
import axios from 'axios'

const DEFAULT_FLIGHT_NUMBER = 100
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

async function populateLaunches() {
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    })

    if (response.status !== 200) {
        console.log('Problem downloadin launch data')

        throw new Error('Launch data failed')
    }

    const launchDocs = response.data.docs

    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads']
        const customers = payloads.flatMap((payload) => {
            return payload['customers']
        })

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
        }

        console.log(`${launch.flightNumber} ${launch.mission}`)

        await saveLaunch(launch)
    }
}

export async function loadLaunchData() {
    const firstLaunch = await findLunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    })

    if (firstLaunch) {
        console.log('Launch data already loaded')

        return
    }

    await populateLaunches()
}

async function saveLaunch(launch) {
    return await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    })
}

async function findLunch(filter) {
    return await launches.findOne(filter)
}

export async function existsLaunchWithId(launchId) {
    return await findLunch({
        flightNumber: launchId
    })
}

async function getLatestFlightNumber() {
    const latestLaunch = await launches
        .findOne()
        .sort('-flightNumber')

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER
    }

    return latestLaunch.flightNumber
}

export async function getAllLaunches(skip, limit) {
    return await launches
        .find({}, {
            '_id': 0,
            '__v': 0
        })
        .sort({
            flightNumber: 1
        })
        .skip(skip)
        .limit(limit)
}

export async function schdeduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target
    })

    if (!planet) {
        throw new Error('No matching planet')
    }

    const flightNumber = await getLatestFlightNumber()

    const newLaunch = Object.assign(launch, {
        success:true,
        upcoming: true,
        customers: ['ZTM', 'NASA'],
        flightNumber: flightNumber + 1
    })

    return await saveLaunch(newLaunch)
}

export async function abortLaunchById(launchId) {
    const aborted = await launches.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    })

    return aborted.modifiedCount === 1
}
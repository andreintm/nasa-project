import * as launchesModel from "../../models/launches.model.js"
import { getPagination } from "../../services/query.js"

export async function getAllLaunches(req, res) {
    const {skip, limit} = getPagination(req.query)

    return res.status(200).json(
        await launchesModel.getAllLaunches(skip, limit)
    )
}

export async function addNewLunch(req, res) {
    const launch = req.body

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: 'Missing requered launch property'
        })
    }

    launch.launchDate = new Date(launch.launchDate)

    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid date'
        })
    }

    await launchesModel.schdeduleNewLaunch(launch)

    return res.status(201).json(launch)
}

export async function abortLaunch(req, res) {
    const launchId = Number(req.params.id);

    const existsLaunch = await launchesModel.existsLaunchWithId(launchId)

    if (!existsLaunch) {
        return res.status(404).json({
            error: 'Launch not found'
        })
    }

    const aborted = await launchesModel.abortLaunchById(launchId)

    if (!aborted) {
        return res.status(400).json({
            error: 'Launch not aborted'
        })
    }

    return res.status(200).json(aborted)
}
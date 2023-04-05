import express from 'express'
import { getAllLaunches, addNewLunch, abortLaunch } from './launches.controller.js'

export const launchesRouter = express.Router()

launchesRouter.get('/', getAllLaunches)
launchesRouter.post('/', addNewLunch)
launchesRouter.delete('/:id', abortLaunch)
import express from 'express'
import { getAllPlanets } from './planets.controller.js'

export const planetsRouter = express.Router()

planetsRouter.get('/', getAllPlanets)
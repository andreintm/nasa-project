import { allPlanets } from "../../models/planets.model.js"

export async function getAllPlanets(req, res) {
    return res.status(200).json(await allPlanets())
}
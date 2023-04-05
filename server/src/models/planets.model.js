import { parse } from 'csv-parse'
import fs from 'fs'
import planets from './planets.mongo.js'

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6
}

export async function allPlanets() {
    return await planets.find({}, {
        '_id':0,
        '__v':0
    })
}

async function savePlanet(planet) {
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name
        }, {
            upsert: true
        })
    } catch(err) {
        console.log(`Could not save planet ${err}`)
    }

}

export function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream('./data/kepler_data.csv')
        .pipe(parse({
            comment: "#",
            columns: true,
        }))
        .on('data', async (data) => {
            if (isHabitablePlanet(data)) {
                savePlanet(data)
            }
        })
        .on('error', (err) => {
            console.log(err)
            reject()
        })
        .on('end', async () => {
            const countPlanetsFound  = (await allPlanets()).length
            console.log(`${countPlanetsFound} habitable planets found!`)
            resolve()
        })
    })
}

import request from 'supertest'
import { app } from '../../app.js'
import { loadPlanetsData } from '../../models/planets.model.js'
import { mongoConnect, mongoDisconnect } from '../../services/mongo.js'

describe('Launches API', () => {
    beforeAll(async () => {
        await mongoConnect()
        await loadPlanetsData()
    })

    afterAll(async () => {
        await mongoDisconnect()
    })

    describe('Test GET /launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200)
        })
    })
    
    describe('Test POST /launches', () => {
        const completeLaunchData= {
            mission: 'USS Enterprise',
            rocket: 'NCC 1801-D',
            target: 'Kepler-62 f',
            launchDate: 'January 4, 2028'
        }
    
        const launchDataWithoutDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1801-D',
            target: 'Kepler-62 f',
        }
    
        const launchDataWithInvalidDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1801-D',
            target: 'Kepler-62 f',
            launchDate: 'zoot'
        }
    
        test('It should respond with 201 success', async() => {
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201)
    
            const requestDate = Date(completeLaunchData.launchDate).valueOf()
    
            const responseDate = Date(response.body.launchDate).valueOf()
    
            expect(responseDate).toBe(requestDate)
    
            expect(response.body).toMatchObject(launchDataWithoutDate)    
        })
    
        test('It should catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400)
    
            expect(response.body).toStrictEqual({
                error: 'Missing requered launch property'
            })    
        })
    
        test('It should catch invalid dates', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400)
    
            expect(response.body).toStrictEqual({
                error: 'Invalid date'
            })    
        })
    })
})
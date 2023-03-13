const authEndPoint = require('./endpoints/authEndPoint');
const locationEndPoint = require('./endpoints/locationEndPoint');
const crypto = require('crypto');
const moment = require('moment');

let idToken = null;
let localId = null;
let parentLocationRef;

let wrongToken = '7c58e9e7cd20ae44f354d59f7a73ebb7e346d5e5a61517e33e0e97c4c79d25a826debfc57ca2e99c66108f80801059a9d2d94d14886fc98539e4ab324a5da2e125aa7e7d26af000e103fcbc75b0ed9caa75895ba26efa248fc0c2154a581786679c6a2a9120fadc9e68fef80bc30d6a8644cd19362e035a85e130d675e2e30a9';

// location service tests
describe('Location Service Tests', () => {

    it('should, fail (403) for an unauthorised request', async () => {
        await locationEndPoint.post('/location')
            .set({
                idToken: wrongToken
            })
            .send({
                perentRef: null,
                name: 'Delta Area',
                description: 'The metrolink delta, the logical centre of the tramway',
                operational: true,
                operationalStarDate: moment().format(),
                operationalEndDate: null,
                location: {
                    type: 'Polygon',
                    coordinates: [[
                        [-2.2382104, 53.4817944],
                        [-2.2383079, 53.4816753]
                    ]]
                }
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(403)
    });

    it('should, login and return the user details and token', async () => {
        await authEndPoint.post('/user/login')
            .send({
                email: 'mcole.uk@gmail.com',
                password: crypto.createHash('sha256').update('1234abcd!').digest('hex')
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.user.displayName).toBe('sysadmin');
                expect(res.body.user.email).toBe('mcole.uk@gmail.com');
                expect(res.body.user.idToken).toHaveLength(256);
                idToken = res.body.user.idToken;
                localId = res.body.user.localId;
            });
    });

    it('should, insert a location with a location type polygon', async () => {
        await locationEndPoint.post('/location')
            .set({
                idToken: idToken
            })
            .send({
                perentRef: null,
                name: 'Delta Area',
                description: 'The metrolink delta, the logical centre of the tramway',
                operational: false,
                operationalStarDate: moment().format(),
                operationalEndDate: null,
                location: {
                    type: 'Polygon',
                    coordinates: [[
                        [-2.2382104, 53.4817944],
                        [-2.2383079, 53.4816753],
                        [-2.2382717, 53.4816561],
                        [-2.2382449, 53.4815611],
                        [-2.2391314, 53.4809362],
                        [-2.2392293, 53.4808357],
                        [-2.2394894, 53.4806665],
                        [-2.2393218, 53.4805811],
                        [-2.2389664, 53.4808293],
                        [-2.238784, 53.4809458],
                        [-2.2386365, 53.480969],
                        [-2.2385131, 53.4809642],
                        [-2.2384152, 53.4809402],
                        [-2.2382395, 53.4808548],
                        [-2.2380343, 53.4807471],
                        [-2.237864, 53.480633],
                        [-2.2376199, 53.4804789],
                        [-2.237404, 53.4806314],
                        [-2.2377125, 53.4807998],
                        [-2.2378466, 53.4808876],
                        [-2.2379163, 53.480933],
                        [-2.2379565, 53.4809945],
                        [-2.23797, 53.481056],
                        [-2.2379552, 53.481103],
                        [-2.2376843, 53.4813864],
                        [-2.2376424, 53.4814481],
                        [-2.237619, 53.4814992],
                        [-2.2376136, 53.4815606],
                        [-2.2376384, 53.4816193],
                        [-2.2376887, 53.4816783],
                        [-2.2377706, 53.4817397],
                        [-2.2381642, 53.4818478],
                        [-2.2382104, 53.4817944]
                    ]]
                }
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .then(res => {
                const { insertedId } = res.body.res;
                expect(insertedId).toBeDefined();
                parentLocationRef = insertedId;
            });
    });

    it('should, insert a location with a location type point as a child of the previos entry', async () => {
        await locationEndPoint.post('/location')
            .set({
                idToken: idToken
            })
            .send({
                assetRef: parentLocationRef,
                name: 'MKT08M',
                description: 'Market Street motorised point machine',
                operational: true,
                operationalStarDate: moment().format(),
                operationalEndDate: null,
                location: {
                    type: 'Point',
                    coordinates : [ 53.48178, -2.23821 ]
                }
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .then(res => {
                const { insertedId } = res.body.res;
                expect(insertedId).toBeDefined();
            });
    });

    it('should, fail to insert a location with the same name', async () => {
        await locationEndPoint.post('/location')
            .set({
                idToken: idToken
            })
            .send({
                assetRef: parentLocationRef,
                name: 'MKT08M',
                description: 'Market Street motorised point machine',
                operational: true,
                operationalStarDate: moment().format(),
                operationalEndDate: null,
                location: {
                    type: 'Point',
                    coordinates : [ 53.48178, -2.23821 ]
                }
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body.status).toBe(400);
                expect(res.body.res).toBe('Duplicate entry');
            });
    });

    it('should, return a list of locations', async () => {
        await locationEndPoint.get('/locations')
            .set({
                idToken: idToken,
                query: ''
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body.res).toHaveLength(2)
            })
    });

    it('should, return the location with the given id', async () => {
        await locationEndPoint.get('/location')
            .set({
                idToken: idToken,
                param: parentLocationRef
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body.res.name).toBe('Delta Area');
                expect(res.body.res.operational).toBe(false);
            });
    });

    it('should, update a location record with a ', async () => {
        await locationEndPoint.patch('/location')
        .set({
            idToken: idToken,
            param: parentLocationRef
        })
        .send({
            operational: true
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
    });
});

// auth bug fixes
describe('Bug replication and fixes', () => {

    it('should return 200 server is up', async () => {
        await locationEndPoint.get('/')
        .set('Accept', 'application/json')
        .expect(200)
        .then(res => {
            expect(res.body.msg).toBe('Server is up!');
        })
    });

    // monitoring the logs on the live server and clocked this request... someone trying to hack the system? 
    it('should return 404 Not Found', async () => {
        await locationEndPoint.get('/.env')
        .expect(404)
        .then(res => {
            expect(res.res.statusMessage).toBe('Not Found');
        })
    });

    it('should return 404 Not Found', async () => {
        await locationEndPoint.get('/index.html')
        .expect(404)
        .then(res => {
            expect(res.res.statusMessage).toBe('Not Found');
        })
    });
});
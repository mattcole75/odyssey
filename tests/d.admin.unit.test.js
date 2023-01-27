const authEndPoint = require('./endpoints/authEndPoint');
const adminEndPoint = require('./endpoints/adminEndPoint');
const crypto = require('crypto');
const moment = require('moment');

let idToken = null;
let localId = null;
let parentAssetRef;

let wrongToken = '7c58e9e7cd20ae44f354d59f7a73ebb7e346d5e5a61517e33e0e97c4c79d25a826debfc57ca2e99c66108f80801059a9d2d94d14886fc98539e4ab324a5da2e125aa7e7d26af000e103fcbc75b0ed9caa75895ba26efa248fc0c2154a581786679c6a2a9120fadc9e68fef80bc30d6a8644cd19362e035a85e130d675e2e30a9';

// asset service tests
describe('Organisation Service Tests', () => {

    it('should, fail (403) for an unauthorised request', async () => {
        await adminEndPoint.post('/organisation')
            .set({
                idToken: wrongToken
            })
            .send({
                name: 'Transport for Greater Manchester (TfGM)',
                assetRole: 'Owner',
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
    });

    it('should, login and return the user details and token', async () => {
        await authEndPoint.post('/user/login')
            .send({
                email: 'chade.fallstar@system.com',
                password: crypto.createHash('sha256').update('1234abcd!').digest('hex')
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.user.displayName).toBe('Chade Fallstar');
                expect(res.body.user.email).toBe('chade.fallstar@system.com');
                expect(res.body.user.idToken).toHaveLength(256);
                idToken = res.body.user.idToken;
                localId = res.body.user.localId;
            });
    });

    it('should, fail (403) for a user who does not have the correct role', async () => {
        await adminEndPoint.post('/organisation')
            .set({
                idToken: idToken
            })
            .send({
                name: 'Transport for Greater Manchester (TfGM)',
                assetRole: 'Owner',
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

    

    it('should, insert an organisation TfGM', async () => {
        await adminEndPoint.post('/organisation')
            .set({
                idToken: idToken
            })
            .send({
                name: 'Transport for Greater Manchester (TfGM)',
                assetRole: 'Owner'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .then(res => {
                const { acknowledged, insertedId } = res.body.res;
                expect(acknowledged).toBe(true);
                expect(insertedId).toBeDefined();
            });
    });

    it('should, insert an organisation KAM', async () => {
        await adminEndPoint.post('/organisation')
            .set({
                idToken: idToken
            })
            .send({
                name: 'KeolisAmey Metrolink (KAM)',
                assetRole: 'Maintainer'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .then(res => {
                const { acknowledged, insertedId } = res.body.res;
                expect(acknowledged).toBe(true);
                expect(insertedId).toBeDefined();
            });
    });

    it('should, insert an organisation Podtrak', async () => {
        await adminEndPoint.post('/organisation')
            .set({
                idToken: idToken
            })
            .send({
                name: 'Podtrak',
                assetRole: 'Supplier'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .then(res => {
                const { acknowledged, insertedId } = res.body.res;
                expect(acknowledged).toBe(true);
                expect(insertedId).toBeDefined();
                uid = insertedId;
            });
    });

    it('should, fail to insert an organisation with the same name', async () => {

        await adminEndPoint.post('/organisation')
            .set({
                idToken: idToken
            })
            .send({
                name: 'Podtrak',
                assetRole: 'Supplier'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body.status).toBe(400);
                expect(res.body.res).toBe('Duplicate entry');
            });
    });

    it('should, return a list of organisations', async () => {
        await adminEndPoint.get('/organisations')
            .set({
                idToken: idToken,
                query: ''
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body.res).toHaveLength(3);
            })
    });

    it('should, return a list of organisations', async () => {
        await adminEndPoint.get('/organisations')
            .set({
                idToken: idToken,
                query: 'Podtrak'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body.res).toHaveLength(1);
            })
    });

    it('should, update an organisation', async () => {
        await adminEndPoint.patch('/organisation')
            .set({
                idToken: idToken,
            })
            .send({
                uid: uid,
                name: 'Podtrak Ltd',
                assetRole: 'Supplier'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                // console.log(res.body);
                // const { acknowledged, insertedId } = res.body.res;
                // expect(acknowledged).toBe(true);
                // expect(insertedId).toBeDefined();
            })
    });

});

// auth bug fixes
describe('Bug replication and fixes', () => {

    it('should return 200 server is up', async () => {
        await adminEndPoint.get('/')
        .set('Accept', 'application/json')
        .expect(200)
        .then(res => {
            expect(res.body.msg).toBe('Server is up!');
        })
    });

    // monitoring the logs on the live server and clocked this request... someone trying to hack the system? 
    it('should return 404 Not Found', async () => {
        await adminEndPoint.get('/.env')
        .expect(404)
        .then(res => {
            expect(res.res.statusMessage).toBe('Not Found');
        })
    });

    it('should return 404 Not Found', async () => {
        await adminEndPoint.get('/index.html')
        .expect(404)
        .then(res => {
            expect(res.res.statusMessage).toBe('Not Found');
        })
    });
});
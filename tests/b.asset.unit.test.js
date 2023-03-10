const authEndPoint = require('./endpoints/authEndPoint');
const assetEndPoint = require('./endpoints/assetEndPoint');
const crypto = require('crypto');
const moment = require('moment');

let idToken = null;
let localId = null;
let parentAssetRef;

let wrongToken = '7c58e9e7cd20ae44f354d59f7a73ebb7e346d5e5a61517e33e0e97c4c79d25a826debfc57ca2e99c66108f80801059a9d2d94d14886fc98539e4ab324a5da2e125aa7e7d26af000e103fcbc75b0ed9caa75895ba26efa248fc0c2154a581786679c6a2a9120fadc9e68fef80bc30d6a8644cd19362e035a85e130d675e2e30a9';

// asset service tests
describe('Asset Service Tests', () => {

    it('should, fail (403) for an unauthorised request', async () => {
        await assetEndPoint.post('/asset')
            .set({
                idToken: wrongToken
            })
            .send({
                assetRef: null,
                ownedByRef: 'TfGM',
                name: 'Delta Area',
                description: 'The delta area',
                operational: true,
                operationalStarDate: moment().format(),
                operationalEndDate: null,
                locationType: 'Area',
                area: 'POLYGON ((-2.237313 53.4803628, -2.2371628 53.480465, -2.2376617 53.4807427, -2.2379138 53.4810205, -2.2376402 53.4813812, -2.2375759 53.4815504, -2.2376402 53.4816462, -2.2377207 53.4817004, -2.2378226 53.4817451, -2.2382142 53.4818249, -2.2383162 53.4816781, -2.2382196 53.4815855, -2.2382625 53.4814833, -2.2390565 53.4809151, -2.2389492 53.4808481, -2.2388043 53.4809279, -2.2386917 53.4809566, -2.2386166 53.480963, -2.2385468 53.4809662, -2.2384717 53.4809343, -2.237313 53.4803628))',
                pin: null
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
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

    it('should, insert an asset into the asset table with a location type Area', async () => {
        await assetEndPoint.post('/asset')
            .set({
                idToken: idToken
            })
            .send({
                assetRef: null,
                ownedByRef: 'TfGM',
                maintainedByRef: 'KAM',
                name: 'Delta Area',
                description: 'The delta area'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .then(res => {
                const { insertId } = res.body.res;
                expect(insertId).toBeDefined();
                expect(insertId).toBe(1);
                parentAssetRef = insertId;
            });
    });

    it('should, insert an asset into the asset table with a location type pin and a child of the previos entry', async () => {
        await assetEndPoint.post('/asset')
            .set({
                idToken: idToken
            })
            .send({
                assetRef: parentAssetRef,
                ownedByRef: 'TfGM',
                maintainedByRef: 'KAM',
                name: 'MKT08M',
                description: 'Market Street motorised point machine'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .then(res => {
                const { affectedRows, insertId, serverStatus, warningCount, changedRows } = res.body.res;
                expect(insertId).toBeDefined();
                expect(insertId).toBe(2);
            });
    });

    it('should, fail to insert a asset with the same name', async () => {
        await assetEndPoint.post('/asset')
            .set({
                idToken: idToken
            })
            .send({
                assetRef: null,
                ownedByRef: 'TfGM',
                maintainedByRef: 'KAM',
                name: 'Delta Area',
                description: 'The delta area'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(500)
            .then(res => {
                const { code, errno, sqlMessage, sqlState } = res.body.res;
                expect(code).toBe('ER_DUP_ENTRY');
                expect(errno).toBe(1062);
                expect(sqlMessage).toBe("Duplicate entry 'Delta Area' for key 'asset.name'");
                expect(sqlState).toBe('23000');
            });
    });

    it('should, return a list of assets', async () => {
        await assetEndPoint.get('/assets')
            .set({
                idToken: idToken,
                query: ''
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body.res).toHaveLength(2)
                // console.log(res.body);
            })
    });

    it('should, return the asset with the given id', async () => {
        await assetEndPoint.get('/asset')
            .set({
                idToken: idToken,
                query: parentAssetRef
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
    });

    it('should, update an asset record with an installation date', async () => {
        await assetEndPoint.patch('/asset')
        .set({
            idToken: idToken
        })
        .send({
            id: parentAssetRef,
            ownedByRef: 'TfGM',
            maintainedByRef: 'KAM',
            name: 'Delta Area',
            description: 'The delta area',
            status: 'commissioned',
            installedDate: moment().format('YYYY-MM-DD'),
            commissionedDate: null,
            decommissionedDate: null,
            disposedDate: null,
            inuse: true

        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
    });

    it('should, update an asset record with a commissioned date', async () => {
        await assetEndPoint.patch('/asset')
        .set({
            idToken: idToken
        })
        .send({
            id: parentAssetRef,
            ownedByRef: 'TfGM',
            maintainedByRef: 'KAM',
            name: 'Delta Area',
            description: 'The delta area',
            status: 'commissioned',
            installedDate: moment().format('YYYY-MM-DD'),
            commissionedDate: moment().format('YYYY-MM-DD'),
            decommissionedDate: null,
            disposedDate: null,
            inuse: true
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
    });

    it('should, update an asset record with a decommissioned date', async () => {
        await assetEndPoint.patch('/asset')
        .set({
            idToken: idToken
        })
        .send({
            id: parentAssetRef,
            ownedByRef: 'TfGM',
            maintainedByRef: 'KAM',
            name: 'Delta Area',
            description: 'The delta area',
            status: 'commissioned',
            installedDate: moment().format('YYYY-MM-DD'),
            commissionedDate: moment().format('YYYY-MM-DD'),
            decommissionedDate: moment().format('YYYY-MM-DD'),
            disposedDate: null,
            inuse: true
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
    });

    it('should, update an asset record with a disposal date', async () => {
        await assetEndPoint.patch('/asset')
        .set({
            idToken: idToken
        })
        .send({
            id: parentAssetRef,
            ownedByRef: 'TfGM',
            maintainedByRef: 'KAM',
            name: 'Delta Area',
            description: 'The delta area',
            status: 'commissioned',
            installedDate: moment().format('YYYY-MM-DD'),
            commissionedDate: moment().format('YYYY-MM-DD'),
            decommissionedDate: moment().format('YYYY-MM-DD'),
            disposedDate: moment().format('YYYY-MM-DD'),
            inuse: true
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
    });

});

// auth bug fixes
describe('Bug replication and fixes', () => {

    it('should return 200 server is up', async () => {
        await assetEndPoint.get('/')
        .set('Accept', 'application/json')
        .expect(200)
        .then(res => {
            expect(res.body.msg).toBe('Server is up!');
        })
    });

    // monitoring the logs on the live server and clocked this request... someone trying to hack the system? 
    it('should return 404 Not Found', async () => {
        await assetEndPoint.get('/.env')
        .expect(404)
        .then(res => {
            expect(res.res.statusMessage).toBe('Not Found');
        })
    });

    it('should return 404 Not Found', async () => {
        await assetEndPoint.get('/index.html')
        .expect(404)
        .then(res => {
            expect(res.res.statusMessage).toBe('Not Found');
        })
    });
});
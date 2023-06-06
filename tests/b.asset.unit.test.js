const authEndPoint = require('./endpoints/authEndPoint');
const assetEndPoint = require('./endpoints/assetEndPoint');
const crypto = require('crypto');
const moment = require('moment');

let idToken = null;
let parentAssetRef;
let parentAssetRef2;

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

    it('should, insert an asset into the asset table', async () => {
        await assetEndPoint.post('/asset')
            .set({
                idToken: idToken
            })
            .send({
                assetRef: null,
                ownedByRef: null,
                maintainedByRef: null,
                name: 'City Centre Line',
                description: 'Manchester City Centre Tram Lines'
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

    it('should, insert an asset into the asset table with as a child of the previos entry', async () => {
        await assetEndPoint.post('/asset')
            .set({
                idToken: idToken
            })
            .send({
                assetRef: parentAssetRef,
                ownedByRef: null,
                maintainedByRef: null,
                name: 'Delta',
                description: 'The centre of the tramway'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .then(res => {
                const { affectedRows, insertId, serverStatus, warningCount, changedRows } = res.body.res;
                expect(insertId).toBeDefined();
                expect(insertId).toBe(2);
                parentAssetRef2 = insertId;
            });
    });

    it('should, fail to insert an asset with the same name', async () => {
        await assetEndPoint.post('/asset')
            .set({
                idToken: idToken
            })
            .send({
                assetRef: null,
                ownedByRef: null,
                maintainedByRef: null,
                name: 'City Centre Line',
                description: 'Manchester City Centre Tram Lines'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(500)
            .then(res => {
                const { code, errno, sqlState } = res.body.res;
                expect(code).toBe('ER_DUP_ENTRY');
                expect(errno).toBe(1062);
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
                console.log(res.body.res);
                expect(res.body.res).toHaveLength(1)
            })
    });

    it('should, return a list of assets given a search parameter', async () => {
        await assetEndPoint.get('/assets')
            .set({
                idToken: idToken,
                query: 'Delta'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                // console.log(res.body.res);
                expect(res.body.res).toHaveLength(1)
            })
    });

    it('should, return a list of assets associated with a parent id', async () => {
        await assetEndPoint.get('/containedassets')
            .set({
                idToken: idToken,
                param: parentAssetRef
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                // console.log(res.body.res);
                expect(res.body.res).toHaveLength(1)
            })
    });

    it('should, return the asset with the given id', async () => {
        await assetEndPoint.get('/asset')
            .set({
                idToken: idToken,
                param: parentAssetRef
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
            ownedByRef: null,
            maintainedByRef: null,
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
            ownedByRef: null,
            maintainedByRef: null,
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
            ownedByRef: null,
            maintainedByRef: null,
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
            ownedByRef: null,
            maintainedByRef: null,
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

    it('should, update an asset record with location meta data', async () => {
        await assetEndPoint.patch('/asset')
        .set({
            idToken: idToken
        })
        .send({
            id: parentAssetRef,
            ownedByRef: null,
            maintainedByRef: null,
            name: 'City Centre Line',
            description: 'Manchester City Centre Tram Lines',
            status: 'commissioned',
            installedDate: moment().format('YYYY-MM-DD'),
            commissionedDate: moment().format('YYYY-MM-DD'),
            decommissionedDate: moment().format('YYYY-MM-DD'),
            disposedDate: moment().format('YYYY-MM-DD'),
            locationCategory: 'abc1234def456',
            locationType: 'area',
            locationDescription: 'Pedestrianised location',
            inuse: true
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
    });

    it('should, update an asset record with a location', async () => {
        await assetEndPoint.patch('/assetlocationmap')
        .set({
            idToken: idToken,
            param: parentAssetRef
        })
        .send({
            location: {
                "type": "FeatureCollection",
                "features": [
                    {
                        "id": "c28b2a5c62c974cc090ecf7de17da54e",
                        "type": "Feature",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [
                                [
                                    [
                                        -2.237231584382471,
                                        53.48049099953431
                                    ],
                                    [
                                        -2.236642991638604,
                                        53.480172608394184
                                    ],
                                    [
                                        -2.2364823634843556,
                                        53.480084534498474
                                    ],
                                    [
                                        -2.236385981990707,
                                        53.480045531600325
                                    ],
                                    [
                                        -2.2362889012001963,
                                        53.4800167194536
                                    ],
                                    [
                                        -2.236192390374881,
                                        53.47999676482732
                                    ],
                                    [
                                        -2.236101246444263,
                                        53.479982285382675
                                    ],
                                    [
                                        -2.236042503082291,
                                        53.47997020571292
                                    ],
                                    [
                                        -2.2360182335041543,
                                        53.47996444820487
                                    ],
                                    [
                                        -2.2359211275231248,
                                        53.47993405234793
                                    ],
                                    [
                                        -2.2358948226368573,
                                        53.47992618746155
                                    ],
                                    [
                                        -2.2358163822215724,
                                        53.47988889337567
                                    ],
                                    [
                                        -2.2357802288091033,
                                        53.47986728060729
                                    ],
                                    [
                                        -2.235727174989701,
                                        53.47982808870083
                                    ],
                                    [
                                        -2.2356561521051663,
                                        53.47977238388791
                                    ],
                                    [
                                        -2.2355885069571855,
                                        53.47972114513095
                                    ],
                                    [
                                        -2.235527773876551,
                                        53.479678645846434
                                    ],
                                    [
                                        -2.2354761848079807,
                                        53.4796367265654
                                    ],
                                    [
                                        -2.235382385768304,
                                        53.479566466229
                                    ],
                                    [
                                        -2.2352126189168646,
                                        53.47944379519911
                                    ],
                                    [
                                        -2.234822754206606,
                                        53.479153698149545
                                    ],
                                    [
                                        -2.234590518837544,
                                        53.47897536244821
                                    ],
                                    [
                                        -2.2343551733720792,
                                        53.47879727311137
                                    ],
                                    [
                                        -2.2340131354211477,
                                        53.47852757660051
                                    ],
                                    [
                                        -2.2339034419996686,
                                        53.478449030859046
                                    ],
                                    [
                                        -2.2337759340093024,
                                        53.47837886609564
                                    ],
                                    [
                                        -2.2336176464675983,
                                        53.47833748631538
                                    ],
                                    [
                                        -2.233303262622665,
                                        53.4782699383476
                                    ],
                                    [
                                        -2.2327486828691043,
                                        53.478151649194984
                                    ],
                                    [
                                        -2.232616496597047,
                                        53.478119981334125
                                    ],
                                    [
                                        -2.232532815144949,
                                        53.47808190431745
                                    ],
                                    [
                                        -2.232464591944753,
                                        53.47803277218068
                                    ],
                                    [
                                        -2.232395303713682,
                                        53.477963719793685
                                    ],
                                    [
                                        -2.232283428671604,
                                        53.47777514210132
                                    ],
                                    [
                                        -2.232203575160125,
                                        53.47764526177908
                                    ],
                                    [
                                        -2.232153774278525,
                                        53.47757675845524
                                    ],
                                    [
                                        -2.2321069505333577,
                                        53.47753306039415
                                    ],
                                    [
                                        -2.232053023017862,
                                        53.47749083554839
                                    ],
                                    [
                                        -2.231938318519447,
                                        53.47744528607387
                                    ],
                                    [
                                        -2.231814570713892,
                                        53.47739529703997
                                    ],
                                    [
                                        -2.2316827341173715,
                                        53.47736764481451
                                    ],
                                    [
                                        -2.230433990358124,
                                        53.4771129503895
                                    ],
                                    [
                                        -2.2296881791656653,
                                        53.47697355765994
                                    ],
                                    [
                                        -2.229349927227239,
                                        53.476923652295
                                    ],
                                    [
                                        -2.229120081600258,
                                        53.47697097381971
                                    ],
                                    [
                                        -2.227918121913964,
                                        53.47738293571183
                                    ],
                                    [
                                        -2.227819323767591,
                                        53.477280501995146
                                    ],
                                    [
                                        -2.229214074142599,
                                        53.47677738129785
                                    ],
                                    [
                                        -2.2294281252245467,
                                        53.47674984512821
                                    ],
                                    [
                                        -2.23164653101775,
                                        53.47722820131977
                                    ],
                                    [
                                        -2.231708573401471,
                                        53.47723404687106
                                    ],
                                    [
                                        -2.231871360936625,
                                        53.477286489722594
                                    ],
                                    [
                                        -2.2319111309626187,
                                        53.4773027845
                                    ],
                                    [
                                        -2.232056617286588,
                                        53.477371128786416
                                    ],
                                    [
                                        -2.232088579114126,
                                        53.47739442116784
                                    ],
                                    [
                                        -2.232171769383931,
                                        53.47745746974215
                                    ],
                                    [
                                        -2.2322127711460853,
                                        53.477509449290395
                                    ],
                                    [
                                        -2.232293418393067,
                                        53.47763232030189
                                    ],
                                    [
                                        -2.232374859375552,
                                        53.4777570402256
                                    ],
                                    [
                                        -2.232490107167094,
                                        53.47793206401836
                                    ],
                                    [
                                        -2.232549733990698,
                                        53.47799461457281
                                    ],
                                    [
                                        -2.232600433527699,
                                        53.4780262169313
                                    ],
                                    [
                                        -2.23264233890668,
                                        53.47804996876256
                                    ],
                                    [
                                        -2.2327129584269847,
                                        53.47808046297631
                                    ],
                                    [
                                        -2.2333406450923547,
                                        53.478215474495315
                                    ],
                                    [
                                        -2.2337627938620734,
                                        53.478303787175065
                                    ],
                                    [
                                        -2.233916750011058,
                                        53.47836265528082
                                    ],
                                    [
                                        -2.2340004112868384,
                                        53.478422821342235
                                    ],
                                    [
                                        -2.2340800258103233,
                                        53.47849339241578
                                    ],
                                    [
                                        -2.234420469299768,
                                        53.478762591025315
                                    ],
                                    [
                                        -2.234658924864079,
                                        53.47894179916968
                                    ],
                                    [
                                        -2.234915075485347,
                                        53.47913553583862
                                    ],
                                    [
                                        -2.235259230450038,
                                        53.47940450869035
                                    ],
                                    [
                                        -2.2353799822232707,
                                        53.4794928196425
                                    ],
                                    [
                                        -2.2355205051443767,
                                        53.479600520883615
                                    ],
                                    [
                                        -2.2355702189316924,
                                        53.47963492838224
                                    ],
                                    [
                                        -2.235604573809659,
                                        53.47966342888293
                                    ],
                                    [
                                        -2.235677271903382,
                                        53.47971644675346
                                    ],
                                    [
                                        -2.2357334491376912,
                                        53.479760009721005
                                    ],
                                    [
                                        -2.235772964689748,
                                        53.47978754525185
                                    ],
                                    [
                                        -2.2358115449083256,
                                        53.47981372917371
                                    ],
                                    [
                                        -2.2359092081397725,
                                        53.47986187676831
                                    ],
                                    [
                                        -2.2359594467165484,
                                        53.47988154191296
                                    ],
                                    [
                                        -2.2359826721030336,
                                        53.47988877475118
                                    ],
                                    [
                                        -2.236005897490428,
                                        53.47989555132308
                                    ],
                                    [
                                        -2.2360485147720217,
                                        53.47990499807115
                                    ],
                                    [
                                        -2.23613975546189,
                                        53.47992018189289
                                    ],
                                    [
                                        -2.236254625758672,
                                        53.47994100597665
                                    ],
                                    [
                                        -2.236409929294773,
                                        53.479958245988925
                                    ],
                                    [
                                        -2.236438312757185,
                                        53.479961185667875
                                    ],
                                    [
                                        -2.2364654307812124,
                                        53.47996525494829
                                    ],
                                    [
                                        -2.236494763324311,
                                        53.47997088246082
                                    ],
                                    [
                                        -2.236522830426324,
                                        53.47997801610876
                                    ],
                                    [
                                        -2.236561661368807,
                                        53.47998961477038
                                    ],
                                    [
                                        -2.236602783624569,
                                        53.4800038363761
                                    ],
                                    [
                                        -2.2366505970830417,
                                        53.480022031301246
                                    ],
                                    [
                                        -2.2373822737746707,
                                        53.48039446549842
                                    ],
                                    [
                                        -2.237682074462498,
                                        53.48055897377904
                                    ],
                                    [
                                        -2.238002203651668,
                                        53.480720839759655
                                    ],
                                    [
                                        -2.238317332459967,
                                        53.4809080314807
                                    ],
                                    [
                                        -2.238421452229294,
                                        53.480937823856934
                                    ],
                                    [
                                        -2.2385146300317835,
                                        53.48095895789323
                                    ],
                                    [
                                        -2.2386514921333567,
                                        53.480966364883386
                                    ],
                                    [
                                        -2.23876771487813,
                                        53.4809447880697
                                    ],
                                    [
                                        -2.238862997569184,
                                        53.48089923917894
                                    ],
                                    [
                                        -2.239049083651717,
                                        53.480782439540874
                                    ],
                                    [
                                        -2.239162724841309,
                                        53.48071314382064
                                    ],
                                    [
                                        -2.2393202474905296,
                                        53.480609034814705
                                    ],
                                    [
                                        -2.239482072696072,
                                        53.48050333134974
                                    ],
                                    [
                                        -2.239657561298986,
                                        53.4803842901522
                                    ],
                                    [
                                        -2.239830550456052,
                                        53.4803122062908
                                    ],
                                    [
                                        -2.240091341480829,
                                        53.48014452325782
                                    ],
                                    [
                                        -2.2405902446767416,
                                        53.47980909020377
                                    ],
                                    [
                                        -2.2411738911322328,
                                        53.479397373298355
                                    ],
                                    [
                                        -2.2422960431213452,
                                        53.47860369169184
                                    ],
                                    [
                                        -2.2424074900561735,
                                        53.478659090443855
                                    ],
                                    [
                                        -2.240681762287946,
                                        53.47985774282299
                                    ],
                                    [
                                        -2.240095800001925,
                                        53.48026013539932
                                    ],
                                    [
                                        -2.2398575392742233,
                                        53.48041781142204
                                    ],
                                    [
                                        -2.239834177067072,
                                        53.48043080121272
                                    ],
                                    [
                                        -2.2396812224745233,
                                        53.48047731227324
                                    ],
                                    [
                                        -2.239640800524111,
                                        53.480502234989736
                                    ],
                                    [
                                        -2.2394424937927075,
                                        53.48063733720119
                                    ],
                                    [
                                        -2.2392763660309005,
                                        53.480758254342526
                                    ],
                                    [
                                        -2.238852076494072,
                                        53.48107489306254
                                    ],
                                    [
                                        -2.2385286540276197,
                                        53.48128780297372
                                    ],
                                    [
                                        -2.2382776136824845,
                                        53.481462791788914
                                    ],
                                    [
                                        -2.23821384511428,
                                        53.48153068729552
                                    ],
                                    [
                                        -2.238210709614303,
                                        53.48158989822153
                                    ],
                                    [
                                        -2.238262659920207,
                                        53.481666050131686
                                    ],
                                    [
                                        -2.238338036355996,
                                        53.48171882494508
                                    ],
                                    [
                                        -2.239356828455289,
                                        53.48200955718508
                                    ],
                                    [
                                        -2.2394826205968115,
                                        53.48209254253213
                                    ],
                                    [
                                        -2.2395321653523688,
                                        53.48215945923598
                                    ],
                                    [
                                        -2.2395432164099,
                                        53.48223339238912
                                    ],
                                    [
                                        -2.239536633253538,
                                        53.48228842259829
                                    ],
                                    [
                                        -2.2395226606236656,
                                        53.48234295059472
                                    ],
                                    [
                                        -2.2394604216783582,
                                        53.48246622302025
                                    ],
                                    [
                                        -2.239314019052655,
                                        53.482770346212575
                                    ],
                                    [
                                        -2.2392306887930022,
                                        53.482921852898144
                                    ],
                                    [
                                        -2.239124937349903,
                                        53.48308182138888
                                    ],
                                    [
                                        -2.2390997022360253,
                                        53.483139555297704
                                    ],
                                    [
                                        -2.239070696221593,
                                        53.483219930721646
                                    ],
                                    [
                                        -2.239040747482832,
                                        53.483301993979026
                                    ],
                                    [
                                        -2.239006557667323,
                                        53.4834011630907
                                    ],
                                    [
                                        -2.2389654303926165,
                                        53.48349206034207
                                    ],
                                    [
                                        -2.238917764891074,
                                        53.48358152043815
                                    ],
                                    [
                                        -2.2387844513551327,
                                        53.48388524794095
                                    ],
                                    [
                                        -2.238684366394348,
                                        53.4841113333903
                                    ],
                                    [
                                        -2.238654499064907,
                                        53.484242476846994
                                    ],
                                    [
                                        -2.2386342248732185,
                                        53.48435253820338
                                    ],
                                    [
                                        -2.2386358319832675,
                                        53.48447141618403
                                    ],
                                    [
                                        -2.2386562607336,
                                        53.48459567586286
                                    ],
                                    [
                                        -2.238688854786422,
                                        53.48470654273992
                                    ],
                                    [
                                        -2.238722370798321,
                                        53.48479543220712
                                    ],
                                    [
                                        -2.238800239991339,
                                        53.484890290192354
                                    ],
                                    [
                                        -2.238880077573277,
                                        53.48495133387961
                                    ],
                                    [
                                        -2.23895724968318,
                                        53.48501938603796
                                    ],
                                    [
                                        -2.2390465013282785,
                                        53.485096422815225
                                    ],
                                    [
                                        -2.239206885316464,
                                        53.485250496318486
                                    ],
                                    [
                                        -2.239395710587022,
                                        53.48542849955024
                                    ],
                                    [
                                        -2.2395784960899965,
                                        53.48563705016284
                                    ],
                                    [
                                        -2.2396819683770635,
                                        53.48572964531371
                                    ],
                                    [
                                        -2.239724644868823,
                                        53.485761567665115
                                    ],
                                    [
                                        -2.2398003410222187,
                                        53.48580448229798
                                    ],
                                    [
                                        -2.239830552300357,
                                        53.4858213149955
                                    ],
                                    [
                                        -2.2408271201489214,
                                        53.486102858648806
                                    ],
                                    [
                                        -2.240978870083721,
                                        53.48613558065696
                                    ],
                                    [
                                        -2.2411664807485803,
                                        53.48609803520088
                                    ],
                                    [
                                        -2.24126934573284,
                                        53.48607207486883
                                    ],
                                    [
                                        -2.241338134597026,
                                        53.48601355178285
                                    ],
                                    [
                                        -2.2415500323227247,
                                        53.485770885326936
                                    ],
                                    [
                                        -2.2416140972898857,
                                        53.485685288530064
                                    ],
                                    [
                                        -2.241708979559965,
                                        53.4855612359773
                                    ],
                                    [
                                        -2.2418781093684848,
                                        53.485346179292456
                                    ],
                                    [
                                        -2.2419783090612677,
                                        53.48521469102418
                                    ],
                                    [
                                        -2.242067841923218,
                                        53.4851225498897
                                    ],
                                    [
                                        -2.2421998982104534,
                                        53.48495139842615
                                    ],
                                    [
                                        -2.2422834358322072,
                                        53.484829419309214
                                    ],
                                    [
                                        -2.2423499146605743,
                                        53.4847505298075
                                    ],
                                    [
                                        -2.242450329523611,
                                        53.48462741857773
                                    ],
                                    [
                                        -2.242559228395343,
                                        53.48449178503464
                                    ],
                                    [
                                        -2.2426579254521215,
                                        53.48436255293507
                                    ],
                                    [
                                        -2.2427676271548034,
                                        53.48420632369775
                                    ],
                                    [
                                        -2.2428517375385844,
                                        53.48409467319579
                                    ],
                                    [
                                        -2.2430847175880695,
                                        53.483777853273736
                                    ],
                                    [
                                        -2.243284511109787,
                                        53.48350397003011
                                    ],
                                    [
                                        -2.24335359076409,
                                        53.48340081422394
                                    ],
                                    [
                                        -2.243458360903298,
                                        53.48327398928041
                                    ],
                                    [
                                        -2.243552261946738,
                                        53.4831561232327
                                    ],
                                    [
                                        -2.243650737401188,
                                        53.48301570241637
                                    ],
                                    [
                                        -2.243722231385858,
                                        53.48291861133344
                                    ],
                                    [
                                        -2.243815105076269,
                                        53.48278214393922
                                    ],
                                    [
                                        -2.24391540703038,
                                        53.48264451013901
                                    ],
                                    [
                                        -2.2440154827130945,
                                        53.4824861288524
                                    ],
                                    [
                                        -2.2441436268999233,
                                        53.482289707220744
                                    ],
                                    [
                                        -2.2444433719709873,
                                        53.48188169639124
                                    ],
                                    [
                                        -2.244517266569858,
                                        53.48174931909771
                                    ],
                                    [
                                        -2.244733657396793,
                                        53.481176929291934
                                    ],
                                    [
                                        -2.244865133602497,
                                        53.48081465265352
                                    ],
                                    [
                                        -2.2449128296915686,
                                        53.48068851777147
                                    ],
                                    [
                                        -2.2449689302427105,
                                        53.4805589210013
                                    ],
                                    [
                                        -2.2450614914317724,
                                        53.48029242123657
                                    ],
                                    [
                                        -2.245077619397712,
                                        53.48023433071547
                                    ],
                                    [
                                        -2.2450716590850157,
                                        53.48017190202606
                                    ],
                                    [
                                        -2.2450532522040234,
                                        53.480130672651384
                                    ],
                                    [
                                        -2.245025817180983,
                                        53.48009586996979
                                    ],
                                    [
                                        -2.2449686243550495,
                                        53.480054265545675
                                    ],
                                    [
                                        -2.244879723473279,
                                        53.48000842562371
                                    ],
                                    [
                                        -2.24480053961941,
                                        53.4799760369724
                                    ],
                                    [
                                        -2.244639098276855,
                                        53.47992370645228
                                    ],
                                    [
                                        -2.2444634034950317,
                                        53.4798734844382
                                    ],
                                    [
                                        -2.2443976157258163,
                                        53.47985155803841
                                    ],
                                    [
                                        -2.2443380756803326,
                                        53.479826406749
                                    ],
                                    [
                                        -2.244278312924817,
                                        53.47979424648922
                                    ],
                                    [
                                        -2.2442231878159005,
                                        53.47976063986552
                                    ],
                                    [
                                        -2.243962578947374,
                                        53.47959700307455
                                    ],
                                    [
                                        -2.243759988639453,
                                        53.479470129974544
                                    ],
                                    [
                                        -2.243599250347475,
                                        53.47937748568593
                                    ],
                                    [
                                        -2.2434370544083926,
                                        53.479282548631225
                                    ],
                                    [
                                        -2.243277298916187,
                                        53.47918954203975
                                    ],
                                    [
                                        -2.243117452321197,
                                        53.479092010266186
                                    ],
                                    [
                                        -2.242996496573034,
                                        53.47901972688578
                                    ],
                                    [
                                        -2.242831035902054,
                                        53.47894604185947
                                    ],
                                    [
                                        -2.242733229717997,
                                        53.478897729361584
                                    ],
                                    [
                                        -2.24270826036385,
                                        53.47888195334099
                                    ],
                                    [
                                        -2.242693704457686,
                                        53.478866053246314
                                    ],
                                    [
                                        -2.2426719278938085,
                                        53.47884269533293
                                    ],
                                    [
                                        -2.242636184853263,
                                        53.47879835167144
                                    ],
                                    [
                                        -2.2426101614462457,
                                        53.47875182758523
                                    ],
                                    [
                                        -2.2425256923099126,
                                        53.47870945970984
                                    ],
                                    [
                                        -2.242407783834482,
                                        53.47865909988968
                                    ],
                                    [
                                        -2.242295937255422,
                                        53.478603626380746
                                    ],
                                    [
                                        -2.2423492369100213,
                                        53.478566067293706
                                    ],
                                    [
                                        -2.2424345560610934,
                                        53.47850659755318
                                    ],
                                    [
                                        -2.2426144553693597,
                                        53.478383890910926
                                    ],
                                    [
                                        -2.242766421393126,
                                        53.478277562819315
                                    ],
                                    [
                                        -2.242977204055463,
                                        53.47812813078659
                                    ],
                                    [
                                        -2.2431322584149385,
                                        53.4780221694405
                                    ],
                                    [
                                        -2.2433333081695532,
                                        53.47786904473448
                                    ],
                                    [
                                        -2.243533691658503,
                                        53.47771798716181
                                    ],
                                    [
                                        -2.243668337414661,
                                        53.477589731347905
                                    ],
                                    [
                                        -2.243803296173606,
                                        53.47748728572802
                                    ],
                                    [
                                        -2.243908658489209,
                                        53.477416441580424
                                    ],
                                    [
                                        -2.244036153411297,
                                        53.47734798497598
                                    ],
                                    [
                                        -2.244161897575669,
                                        53.47727228167568
                                    ],
                                    [
                                        -2.244323654367035,
                                        53.477160715405205
                                    ],
                                    [
                                        -2.244512514420244,
                                        53.47702007500481
                                    ],
                                    [
                                        -2.2447274570666726,
                                        53.4768800653012
                                    ],
                                    [
                                        -2.245096134541652,
                                        53.47662171780805
                                    ],
                                    [
                                        -2.245302937904442,
                                        53.476491778670656
                                    ],
                                    [
                                        -2.245448759288448,
                                        53.47640255948954
                                    ],
                                    [
                                        -2.245541928294223,
                                        53.476341474186086
                                    ],
                                    [
                                        -2.245728121484883,
                                        53.47620698849104
                                    ],
                                    [
                                        -2.245978085650368,
                                        53.47603058490502
                                    ],
                                    [
                                        -2.2461407306020353,
                                        53.4759340578682
                                    ],
                                    [
                                        -2.246787141995751,
                                        53.47562481369357
                                    ],
                                    [
                                        -2.247298279809262,
                                        53.47538675028012
                                    ],
                                    [
                                        -2.2475418471672404,
                                        53.47526516210306
                                    ],
                                    [
                                        -2.2478051381280415,
                                        53.47513271414242
                                    ],
                                    [
                                        -2.248296971248352,
                                        53.47489392136784
                                    ],
                                    [
                                        -2.248469424509969,
                                        53.47481107709581
                                    ],
                                    [
                                        -2.24856345596281,
                                        53.474769948184885
                                    ],
                                    [
                                        -2.248663502026714,
                                        53.474736758729584
                                    ],
                                    [
                                        -2.248754801464302,
                                        53.47470847179858
                                    ],
                                    [
                                        -2.248848178486877,
                                        53.47456807823438
                                    ],
                                    [
                                        -2.249184843655891,
                                        53.474587162179134
                                    ],
                                    [
                                        -2.249423801930729,
                                        53.474595334022645
                                    ],
                                    [
                                        -2.249931647852259,
                                        53.47461421016982
                                    ],
                                    [
                                        -2.250253053904914,
                                        53.47462787158872
                                    ],
                                    [
                                        -2.250583454011978,
                                        53.47465258776114
                                    ],
                                    [
                                        -2.2509029406976935,
                                        53.47467903723545
                                    ],
                                    [
                                        -2.2509392439734377,
                                        53.4747160312984
                                    ],
                                    [
                                        -2.2512206140576887,
                                        53.474725279791514
                                    ],
                                    [
                                        -2.2515632508445496,
                                        53.47474271780542
                                    ],
                                    [
                                        -2.2515500897912677,
                                        53.47482498111154
                                    ],
                                    [
                                        -2.2512187981056835,
                                        53.474820962050686
                                    ],
                                    [
                                        -2.250786756557643,
                                        53.474856745896155
                                    ],
                                    [
                                        -2.250481776473655,
                                        53.47484914160195
                                    ],
                                    [
                                        -2.2502421365069627,
                                        53.47495926184836
                                    ],
                                    [
                                        -2.24962282657389,
                                        53.47483929463401
                                    ],
                                    [
                                        -2.2492968508748143,
                                        53.47477604756938
                                    ],
                                    [
                                        -2.2491472417616984,
                                        53.474749256144136
                                    ],
                                    [
                                        -2.248971760988617,
                                        53.47472618361506
                                    ],
                                    [
                                        -2.2488001412762384,
                                        53.47475172642807
                                    ],
                                    [
                                        -2.2485973863662805,
                                        53.4748129856865
                                    ],
                                    [
                                        -2.24841777226294,
                                        53.47489064397825
                                    ],
                                    [
                                        -2.248341372524844,
                                        53.47493233605233
                                    ],
                                    [
                                        -2.247880217915527,
                                        53.47516433263564
                                    ],
                                    [
                                        -2.2476194388979103,
                                        53.47529694988135
                                    ],
                                    [
                                        -2.247382383958006,
                                        53.47541711129166
                                    ],
                                    [
                                        -2.2468690129677045,
                                        53.47566840558729
                                    ],
                                    [
                                        -2.246371680606412,
                                        53.475904466507345
                                    ],
                                    [
                                        -2.2460668675240294,
                                        53.47607021573004
                                    ],
                                    [
                                        -2.245803300700869,
                                        53.47625060619606
                                    ],
                                    [
                                        -2.2456350972999988,
                                        53.47637231297205
                                    ],
                                    [
                                        -2.2455511404205115,
                                        53.47644260836496
                                    ],
                                    [
                                        -2.245374593821712,
                                        53.476571540499975
                                    ],
                                    [
                                        -2.24516555695943,
                                        53.47671382809827
                                    ],
                                    [
                                        -2.244797598877062,
                                        53.4769957159822
                                    ],
                                    [
                                        -2.2446096672772056,
                                        53.47713796673962
                                    ],
                                    [
                                        -2.244388877269508,
                                        53.47729044501048
                                    ],
                                    [
                                        -2.244302121823151,
                                        53.4773545693823
                                    ],
                                    [
                                        -2.2442205682334997,
                                        53.477444458022454
                                    ],
                                    [
                                        -2.2441250347768156,
                                        53.477546676178875
                                    ],
                                    [
                                        -2.2440268509630874,
                                        53.477683625392054
                                    ],
                                    [
                                        -2.243922696354614,
                                        53.47781852906435
                                    ],
                                    [
                                        -2.243812827173069,
                                        53.47792429820047
                                    ],
                                    [
                                        -2.2436426419590907,
                                        53.478043994986194
                                    ],
                                    [
                                        -2.243454101269384,
                                        53.47816541444389
                                    ],
                                    [
                                        -2.2432736380605185,
                                        53.47829345926151
                                    ],
                                    [
                                        -2.2430404165744737,
                                        53.47845834805291
                                    ],
                                    [
                                        -2.2429016381951543,
                                        53.478559827552544
                                    ],
                                    [
                                        -2.242842598762861,
                                        53.478604030384886
                                    ],
                                    [
                                        -2.2428149076803714,
                                        53.47863468381474
                                    ],
                                    [
                                        -2.2427880746223137,
                                        53.478661734620104
                                    ],
                                    [
                                        -2.242780161429171,
                                        53.47871077130078
                                    ],
                                    [
                                        -2.2427933322621465,
                                        53.47878295928861
                                    ],
                                    [
                                        -2.2428448469456073,
                                        53.478847687893776
                                    ],
                                    [
                                        -2.242933680644838,
                                        53.4789011872203
                                    ],
                                    [
                                        -2.24309431982603,
                                        53.47898082789192
                                    ],
                                    [
                                        -2.2431917962684125,
                                        53.47903155979937
                                    ],
                                    [
                                        -2.2432633353561933,
                                        53.4790779392828
                                    ],
                                    [
                                        -2.243414858477142,
                                        53.47917498841747
                                    ],
                                    [
                                        -2.243569368662979,
                                        53.47927274120005
                                    ],
                                    [
                                        -2.2437246076724544,
                                        53.47936997082825
                                    ],
                                    [
                                        -2.24387715225727,
                                        53.47946343932507
                                    ],
                                    [
                                        -2.244030138581296,
                                        53.479560225140375
                                    ],
                                    [
                                        -2.24436159797778,
                                        53.479750401904575
                                    ],
                                    [
                                        -2.2444384125969217,
                                        53.47978957114414
                                    ],
                                    [
                                        -2.2445789083798102,
                                        53.47984753882346
                                    ],
                                    [
                                        -2.2446747792531516,
                                        53.47987834554248
                                    ],
                                    [
                                        -2.2448507031800835,
                                        53.47993146653286
                                    ],
                                    [
                                        -2.2449148910363377,
                                        53.47995366341196
                                    ],
                                    [
                                        -2.24497810718925,
                                        53.479977352752606
                                    ],
                                    [
                                        -2.245048442315423,
                                        53.480011377945445
                                    ],
                                    [
                                        -2.2451077716577545,
                                        53.48004771386996
                                    ],
                                    [
                                        -2.245159661601071,
                                        53.48010512737597
                                    ],
                                    [
                                        -2.2451764908604113,
                                        53.48017822468576
                                    ],
                                    [
                                        -2.24517368621247,
                                        53.48025598291706
                                    ],
                                    [
                                        -2.245151247762992,
                                        53.48031134894403
                                    ],
                                    [
                                        -2.245053079383707,
                                        53.48057287177966
                                    ],
                                    [
                                        -2.245005403523975,
                                        53.48070259169655
                                    ],
                                    [
                                        -2.2449549430341484,
                                        53.4808342267652
                                    ],
                                    [
                                        -2.244834561123092,
                                        53.481188276281685
                                    ],
                                    [
                                        -2.2446333807392596,
                                        53.48177487185219
                                    ],
                                    [
                                        -2.244582827812452,
                                        53.48185745308416
                                    ],
                                    [
                                        -2.2443431160094773,
                                        53.482167940931085
                                    ],
                                    [
                                        -2.244142604086514,
                                        53.48247760253474
                                    ],
                                    [
                                        -2.244015558137651,
                                        53.48265999432194
                                    ],
                                    [
                                        -2.2439240420824964,
                                        53.482792012492794
                                    ],
                                    [
                                        -2.2438454786043796,
                                        53.48289857915965
                                    ],
                                    [
                                        -2.2437520585965323,
                                        53.48304218948543
                                    ],
                                    [
                                        -2.243661712629508,
                                        53.483165374109014
                                    ],
                                    [
                                        -2.243575329474158,
                                        53.48327628108824
                                    ],
                                    [
                                        -2.243483964172482,
                                        53.48340254340664
                                    ],
                                    [
                                        -2.24338933699823,
                                        53.48353568092996
                                    ],
                                    [
                                        -2.243257564799233,
                                        53.48371697956378
                                    ],
                                    [
                                        -2.2432086013028956,
                                        53.483802759869214
                                    ],
                                    [
                                        -2.243081099550058,
                                        53.48406524536435
                                    ],
                                    [
                                        -2.2430196430781963,
                                        53.48416487201801
                                    ],
                                    [
                                        -2.2429315492503688,
                                        53.48429353716626
                                    ],
                                    [
                                        -2.2428256302846785,
                                        53.48443276719304
                                    ],
                                    [
                                        -2.2427174185349603,
                                        53.48456732933839
                                    ],
                                    [
                                        -2.242619752162425,
                                        53.484692020411394
                                    ],
                                    [
                                        -2.2425199051527223,
                                        53.48479482669276
                                    ],
                                    [
                                        -2.24239654821418,
                                        53.48489808536006
                                    ],
                                    [
                                        -2.242159435058358,
                                        53.485135138935675
                                    ],
                                    [
                                        -2.242044004866162,
                                        53.48525624835236
                                    ],
                                    [
                                        -2.2418697906125615,
                                        53.48548601124358
                                    ],
                                    [
                                        -2.2417644288172713,
                                        53.48562195939858
                                    ],
                                    [
                                        -2.2416732331294904,
                                        53.48574340599194
                                    ],
                                    [
                                        -2.241628843624423,
                                        53.485800981952366
                                    ],
                                    [
                                        -2.241411852588824,
                                        53.486051815128384
                                    ],
                                    [
                                        -2.2413916982578588,
                                        53.48610781130495
                                    ],
                                    [
                                        -2.2413942890083676,
                                        53.486244944602085
                                    ],
                                    [
                                        -2.2414138936914414,
                                        53.48633747873096
                                    ],
                                    [
                                        -2.241459131407008,
                                        53.48643654935164
                                    ],
                                    [
                                        -2.2415001717053182,
                                        53.48654208928794
                                    ],
                                    [
                                        -2.2416049146759445,
                                        53.486719053394495
                                    ],
                                    [
                                        -2.241654626164645,
                                        53.48679455531238
                                    ],
                                    [
                                        -2.2417490572839887,
                                        53.48690420777986
                                    ],
                                    [
                                        -2.2418735120036275,
                                        53.48681791556163
                                    ],
                                    [
                                        -2.242345867882511,
                                        53.487256289615445
                                    ],
                                    [
                                        -2.2425197941717183,
                                        53.48740575382972
                                    ],
                                    [
                                        -2.242456620983303,
                                        53.487460876440196
                                    ],
                                    [
                                        -2.2423994013564883,
                                        53.48742525238718
                                    ],
                                    [
                                        -2.2421181230798055,
                                        53.48763621434976
                                    ],
                                    [
                                        -2.241967664856255,
                                        53.48775978056498
                                    ],
                                    [
                                        -2.241782579891482,
                                        53.48787821192403
                                    ],
                                    [
                                        -2.2416387713439105,
                                        53.48798536050836
                                    ],
                                    [
                                        -2.241389182517535,
                                        53.48813547191465
                                    ],
                                    [
                                        -2.241279035551819,
                                        53.488208348654254
                                    ],
                                    [
                                        -2.2411178408554995,
                                        53.4882788580529
                                    ],
                                    [
                                        -2.240975010052201,
                                        53.48836075872107
                                    ],
                                    [
                                        -2.2407790913490304,
                                        53.488486680323554
                                    ],
                                    [
                                        -2.2406518371034965,
                                        53.488357910728155
                                    ],
                                    [
                                        -2.240736970841273,
                                        53.48829014629871
                                    ],
                                    [
                                        -2.240978617329393,
                                        53.48810098835142
                                    ],
                                    [
                                        -2.2410443852856337,
                                        53.4880502760504
                                    ],
                                    [
                                        -2.241321522330585,
                                        53.4878580960372
                                    ],
                                    [
                                        -2.2413411646009833,
                                        53.48774390426004
                                    ],
                                    [
                                        -2.2416993832738,
                                        53.48748119931914
                                    ],
                                    [
                                        -2.241756685499458,
                                        53.487417693920065
                                    ],
                                    [
                                        -2.241783405268047,
                                        53.487356047317135
                                    ],
                                    [
                                        -2.2417709312925407,
                                        53.487263257571534
                                    ],
                                    [
                                        -2.241558446148592,
                                        53.48703402574438
                                    ],
                                    [
                                        -2.2415728992747885,
                                        53.487011325766886
                                    ],
                                    [
                                        -2.241462654777194,
                                        53.48689184559824
                                    ],
                                    [
                                        -2.241313071153713,
                                        53.48674217006257
                                    ],
                                    [
                                        -2.2412848816800057,
                                        53.48667377541579
                                    ],
                                    [
                                        -2.241196184404052,
                                        53.48645271109821
                                    ],
                                    [
                                        -2.2411335454338497,
                                        53.48636995483401
                                    ],
                                    [
                                        -2.2410400235072077,
                                        53.48628689685697
                                    ],
                                    [
                                        -2.240377160585903,
                                        53.48606843376283
                                    ],
                                    [
                                        -2.239824524974641,
                                        53.48589564835106
                                    ],
                                    [
                                        -2.239703754508234,
                                        53.485850250414835
                                    ],
                                    [
                                        -2.239625287296148,
                                        53.48580257993447
                                    ],
                                    [
                                        -2.239558949383346,
                                        53.48575036443911
                                    ],
                                    [
                                        -2.239503164072898,
                                        53.48575586468674
                                    ],
                                    [
                                        -2.2390203128286945,
                                        53.485350200260065
                                    ],
                                    [
                                        -2.2387088861306936,
                                        53.48508055915633
                                    ],
                                    [
                                        -2.238653770874727,
                                        53.485001288546314
                                    ],
                                    [
                                        -2.238557464215911,
                                        53.48492281306896
                                    ],
                                    [
                                        -2.2386456695977883,
                                        53.48486688818644
                                    ],
                                    [
                                        -2.238595671027663,
                                        53.484773098417975
                                    ],
                                    [
                                        -2.2385612330567435,
                                        53.484680763589026
                                    ],
                                    [
                                        -2.238530291693217,
                                        53.48458789353449
                                    ],
                                    [
                                        -2.2385218142269214,
                                        53.484484776516794
                                    ],
                                    [
                                        -2.238525288044663,
                                        53.4843551344272
                                    ],
                                    [
                                        -2.238555204895225,
                                        53.4842115499503
                                    ],
                                    [
                                        -2.238591599705571,
                                        53.48408613892758
                                    ],
                                    [
                                        -2.238664389326319,
                                        53.48391476283334
                                    ],
                                    [
                                        -2.2387846509712848,
                                        53.483623312075814
                                    ],
                                    [
                                        -2.2388922599605916,
                                        53.48338592736377
                                    ],
                                    [
                                        -2.238930690851315,
                                        53.48327600797146
                                    ],
                                    [
                                        -2.2389509012634807,
                                        53.48317954496237
                                    ],
                                    [
                                        -2.2389783376514427,
                                        53.483095595399945
                                    ],
                                    [
                                        -2.239018656367482,
                                        53.483001319615944
                                    ],
                                    [
                                        -2.239099293798025,
                                        53.482866792843296
                                    ],
                                    [
                                        -2.2392530648437488,
                                        53.48255963882236
                                    ],
                                    [
                                        -2.239344777472236,
                                        53.48235432461355
                                    ],
                                    [
                                        -2.239375174840166,
                                        53.482270358927835
                                    ],
                                    [
                                        -2.239362008527498,
                                        53.48221834156489
                                    ],
                                    [
                                        -2.239314683802262,
                                        53.482172349871234
                                    ],
                                    [
                                        -2.2391624892790483,
                                        53.482097521430696
                                    ],
                                    [
                                        -2.238186352991071,
                                        53.481818706434694
                                    ],
                                    [
                                        -2.238026436077589,
                                        53.4817813989835
                                    ],
                                    [
                                        -2.237822559946231,
                                        53.48172343493952
                                    ],
                                    [
                                        -2.237735916021372,
                                        53.48166140237146
                                    ],
                                    [
                                        -2.237686131380494,
                                        53.4816010320182
                                    ],
                                    [
                                        -2.237660664021246,
                                        53.48152928746876
                                    ],
                                    [
                                        -2.2376591305867515,
                                        53.48145929273225
                                    ],
                                    [
                                        -2.2376967065000812,
                                        53.48139542256634
                                    ],
                                    [
                                        -2.237820734659776,
                                        53.481275206293446
                                    ],
                                    [
                                        -2.2379537915498564,
                                        53.481144646069694
                                    ],
                                    [
                                        -2.238003755211414,
                                        53.481028930574
                                    ],
                                    [
                                        -2.2379815107274776,
                                        53.48094290525343
                                    ],
                                    [
                                        -2.2378336456179255,
                                        53.48083237245663
                                    ],
                                    [
                                        -2.2374918306353493,
                                        53.48064158647736
                                    ],
                                    [
                                        -2.237352309677533,
                                        53.48056349669777
                                    ],
                                    [
                                        -2.237231584382471,
                                        53.48049099953431
                                    ]
                                ]
                            ]
                        },
                        "properties": {}
                    }
                ]
            }
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
    });

    it('should, update an asset record with a location', async () => {
        await assetEndPoint.patch('/assetlocationmap')
        .set({
            idToken: idToken,
            param: parentAssetRef2
        })
        .send({
            location: {
                "type": "FeatureCollection",
                "features": [
                    {
                        "id": "0e90cdb47d864ea41a8cdcb91722cebe",
                        "type": "Feature",
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [
                                [
                                    [
                                        -2.237334315268498,
                                        53.48056242046164
                                    ],
                                    [
                                        -2.2372851069225703,
                                        53.48049820038082
                                    ],
                                    [
                                        -2.2373977701112153,
                                        53.48041920807043
                                    ],
                                    [
                                        -2.237508168623549,
                                        53.48047276791979
                                    ],
                                    [
                                        -2.2375961202105827,
                                        53.480517979031504
                                    ],
                                    [
                                        -2.237743687852502,
                                        53.48060026394374
                                    ],
                                    [
                                        -2.23803435464362,
                                        53.48076436671909
                                    ],
                                    [
                                        -2.238161137985095,
                                        53.48083876977795
                                    ],
                                    [
                                        -2.2383255408203073,
                                        53.48092272407838
                                    ],
                                    [
                                        -2.238383476723071,
                                        53.48094120789547
                                    ],
                                    [
                                        -2.238448920928904,
                                        53.480962138012146
                                    ],
                                    [
                                        -2.2385209251508673,
                                        53.48097260309521
                                    ],
                                    [
                                        -2.2385985411050653,
                                        53.4809763893946
                                    ],
                                    [
                                        -2.238666643040226,
                                        53.48097138881995
                                    ],
                                    [
                                        -2.2387411887710273,
                                        53.4809559458512
                                    ],
                                    [
                                        -2.2387952968310003,
                                        53.480934866418195
                                    ],
                                    [
                                        -2.238871955824145,
                                        53.48091206420172
                                    ],
                                    [
                                        -2.239002878887935,
                                        53.48082552452675
                                    ],
                                    [
                                        -2.2391637398532067,
                                        53.48071713438124
                                    ],
                                    [
                                        -2.239429827283019,
                                        53.48054894241588
                                    ],
                                    [
                                        -2.2395664957824177,
                                        53.480447617768434
                                    ],
                                    [
                                        -2.2396470469682823,
                                        53.48049657161335
                                    ],
                                    [
                                        -2.2393928812174178,
                                        53.48067128792995
                                    ],
                                    [
                                        -2.2391618606084913,
                                        53.48082915117675
                                    ],
                                    [
                                        -2.238860628352372,
                                        53.48104068737143
                                    ],
                                    [
                                        -2.2387010745862996,
                                        53.48115005965209
                                    ],
                                    [
                                        -2.238517409767403,
                                        53.481273637425176
                                    ],
                                    [
                                        -2.2382903734136153,
                                        53.48141393000781
                                    ],
                                    [
                                        -2.238226316036293,
                                        53.48147244157701
                                    ],
                                    [
                                        -2.238193600714287,
                                        53.48152100620258
                                    ],
                                    [
                                        -2.238192704982203,
                                        53.481571385672055
                                    ],
                                    [
                                        -2.238200226849508,
                                        53.48161508583996
                                    ],
                                    [
                                        -2.238230195640493,
                                        53.48165210714817
                                    ],
                                    [
                                        -2.2381059604884,
                                        53.48179518263916
                                    ],
                                    [
                                        -2.237849072590538,
                                        53.481708987276576
                                    ],
                                    [
                                        -2.2378010704986786,
                                        53.48169020986906
                                    ],
                                    [
                                        -2.2377611836285514,
                                        53.48165599424829
                                    ],
                                    [
                                        -2.2377150802757915,
                                        53.481607599237975
                                    ],
                                    [
                                        -2.237684602614591,
                                        53.48156090041429
                                    ],
                                    [
                                        -2.2376741528749955,
                                        53.48153095182971
                                    ],
                                    [
                                        -2.237670088591172,
                                        53.481487751626666
                                    ],
                                    [
                                        -2.23768440694803,
                                        53.481441424320195
                                    ],
                                    [
                                        -2.2377354905877276,
                                        53.48137882444051
                                    ],
                                    [
                                        -2.237944280761927,
                                        53.481170137400305
                                    ],
                                    [
                                        -2.2379914868399804,
                                        53.48112010376784
                                    ],
                                    [
                                        -2.2380241699517107,
                                        53.481035064030145
                                    ],
                                    [
                                        -2.238002242412435,
                                        53.4809525113624
                                    ],
                                    [
                                        -2.23794539677425,
                                        53.48088444943202
                                    ],
                                    [
                                        -2.2377811999164976,
                                        53.48078171991715
                                    ],
                                    [
                                        -2.237654828532385,
                                        53.480714849692454
                                    ],
                                    [
                                        -2.237452591343839,
                                        53.48062285272787
                                    ],
                                    [
                                        -2.237334315268498,
                                        53.48056242046164
                                    ]
                                ]
                            ]
                        },
                        "properties": {}
                    }
                ]
            }
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
    });

    it('should, update an asset records allocation (assetRef) to null (top level asset)', async () => {
        await assetEndPoint.patch('/assetallocation')
        .set({
            idToken: idToken,
            param: parentAssetRef2
        })
        .send({
            assetRef: null
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
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
                console.log(res.body.res);
                expect(res.body.res).toHaveLength(2)
            })
    });

    it('should, update an asset records allocation (assetRef) to 1', async () => {
        await assetEndPoint.patch('/assetallocation')
        .set({
            idToken: idToken,
            param: parentAssetRef2
        })
        .send({
            assetRef: parentAssetRef
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
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
                console.log(res.body.res);
                expect(res.body.res).toHaveLength(1)
            })
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
'use strict'

const authEndPoint = require('./endpoints/authEndPoint');
const crypto = require('crypto');
const goodUsers = require('./data/good.user.data');
const badUsers = require('./data/bad.user.data');

let wrongToken = '7c58e9e7cd20ae44f354d59f7a73ebb7e346d5e5a61517e33e0e97c4c79d25a826debfc57ca2e99c66108f80801059a9d2d94d14886fc98539e4ab324a5da2e125aa7e7d26af000e103fcbc75b0ed9caa75895ba26efa248fc0c2154a581786679c6a2a9120fadc9e68fef80bc30d6a8644cd19362e035a85e130d675e2e30a9';

// Prospective user tests
describe('Test 1 - prospective user registration - Validate user input', () => {

    it('should return 400 bad request if the display name is not between 3 and 64 chars', async () => {
        await authEndPoint.post('/user')
            .send({
                displayName: 'ab',
                email: 'test@test.com',
                password: '4266f573bc905042c47467963c33ad598715c5f10e6dac2717d30efc1e7fa984'
            })
            .set({ 'Content-Type': 'application/json' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');
            })
    });

    it('should return 400 bad request if the display name is not between 3 and 64 chars', async () => {
        await authEndPoint.post('/user')
            .send({
                displayName: 'abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij12345',
                email: 'test@test.com',
                password: '4266f573bc905042c47467963c33ad598715c5f10e6dac2717d30efc1e7fa984'
            })
            .set({ 'Content-Type': 'application/json' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');
            })
    });

    it('should return 400 bad request if the email address is not well formed', async () => {
        await authEndPoint.post('/user')
            .send({
                displayName: 'test user',
                email: '',
                password: '4266f573bc905042c47467963c33ad598715c5f10e6dac2717d30efc1e7fa984'
            })
            .set({ 'Content-Type': 'application/json' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');
            })
    });

    it('should return 400 bad request if the email address is not well formed', async () => {
        await authEndPoint.post('/user')
            .send({
                displayName: 'test user',
                email: 'test@test.',
                password: '4266f573bc905042c47467963c33ad598715c5f10e6dac2717d30efc1e7fa984'
            })
            .set({ 'Content-Type': 'application/json' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');
            })
    });

    it('should return 400 bad request if the email address is not well formed', async () => {
        await authEndPoint.post('/user')
            .send({
                displayName: 'test user',
                email: 'test.test.com',
                password: '4266f573bc905042c47467963c33ad598715c5f10e6dac2717d30efc1e7fa984'
            })
            .set({ 'Content-Type': 'application/json' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');
            })
    });

    it('should return 400 bad request if the password is not well formed', async () => {
        await authEndPoint.post('/user')
            .send({
                displayName: 'test user',
                email: 'test@test.com',
                password: '123456789012345678901234567890123456789012345678901234567890123' // 63 chars
            })
            .set({ 'Content-Type': 'application/json' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');
            })
    });

    it('should return 400 bad request if the password is not well formed', async () => {
        await authEndPoint.post('/user')
            .send({
                displayName: 'test user',
                email: 'test@test.com',
                password: '12345678901234567890123456789012345678901234567890123456789012345' // 65 chars
            })
            .set({ 'Content-Type': 'application/json' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');
            })
    });
});

describe('Test 2 - Prospective user registration - Register users', () => {

    goodUsers.forEach(user => {

        it('should, create a user account for: ' + user.displayName, async () => {
            await authEndPoint.post('/user')
                .send({
                    displayName: user.displayName,
                    email: user.email,
                    password: crypto.createHash('sha256').update(user.password).digest('hex')
                })
                .set({ 'Content-Type': 'application/json' })
                .expect('Content-Type', /json/)
                .expect(201)
                .then(res => {
                    expect(res.body).toBeDefined();
                    expect(res.body.status).toBe(201);
                    expect(res.body.data.verifyToken).toHaveLength(256);
                    user.idToken = res.body.data.verifyToken;
                })
        });
    });
});

describe('Test 3 - Prospective user registration - attempt to register duplicate system users', () => {
    
    goodUsers.forEach(user => {

        it('should, fail to create a user account for: ' + user.displayName, async () => {
            await authEndPoint.post('/user')
                .send({
                    displayName: user.displayName,
                    email: user.email,
                    password: crypto.createHash('sha256').update(user.password).digest('hex')
                })
                .set({ 'Content-Type': 'application/json' })
                .expect('Content-Type', /json/)
                .expect(409)
                .then(res => {
                    expect(res.body).toBeDefined();
                    expect(res.body.status).toBe(409);
                    expect(res.body.msg).toBe('duplicate entry');
                })
        });
    });
});
// prospective user email verification tests
describe('Test 4 - Prospective user email verification - Verify user email address', () => {
    
    goodUsers.forEach(user => {

        it('should, verify the email address for: ' + user.displayName, async () => {
            await authEndPoint.patch('/verifyemail')
                .send({ verified: true })
                .set({ 
                    'Content-Type': 'application/json',
                    idToken: user.idToken
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .then(res => {
                    expect(res.body).toBeDefined();
                    expect(res.body.status).toBe(200);
                    expect(res.body.msg).toBe('ok');
                })
        });
    });
});
// User Login tests
describe('Test 5 - User login - Validate user input', () => {

    it('should return 400 bad request if the email address is not well formed', async () => {
        await authEndPoint.post('/user/login')
            .send({
                email: '',
                password: '4266f573bc905042c47467963c33ad598715c5f10e6dac2717d30efc1e7fa984'
            })
            .set({ 'Content-Type': 'application/json' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');
            });
    });

    it('should return 400 bad request if the email address is not well formed', async () => {
        await authEndPoint.post('/user/login')
            .send({
                email: 'test@test.',
                password: '4266f573bc905042c47467963c33ad598715c5f10e6dac2717d30efc1e7fa984'
            })
            .set({ 'Content-Type': 'application/json' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');
            })
    });

    it('should return 400 bad request if the email address is not well formed', async () => {
        await authEndPoint.post('/user/login')
            .send({
                email: 'test.test.com',
                password: '4266f573bc905042c47467963c33ad598715c5f10e6dac2717d30efc1e7fa984'
            })
            .set({ 'Content-Type': 'application/json' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');
            })
    });

    it('should return 400 bad request if the password is not well formed', async () => {
        await authEndPoint.post('/user/login')
            .send({
                email: 'test@test.com',
                password: '123456789012345678901234567890123456789012345678901234567890123' // 63 chars
            })
            .set({ 'Content-Type': 'application/json' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');
            })
    });

    it('should return 400 bad request if the password is not well formed', async () => {
        await authEndPoint.post('/user/login')
            .send({
                email: 'test@test.com',
                password: '12345678901234567890123456789012345678901234567890123456789012345' // 65 chars
            })
            .set({ 'Content-Type': 'application/json' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');
            })
    });
});
// login fail tests
describe('Test 6 - User login - fail to login a disabled account unless its the primary account', () => {
    
    goodUsers.forEach(user => {
        it(user.email !== 'admin@system.com'
            ? 'should, fail to login a disabled account: ' + user.displayName
            : 'should, login the primary account: ' + user.displayName, async () => {
            await authEndPoint.post('/user/login')
                .send({
                    email: user.email,
                    password: crypto.createHash('sha256').update(user.password).digest('hex')
                })
                .set({ 'Content-Type': 'application/json' })
                .expect('Content-Type', /json/)
                .then(res => {
                    if(user.email === 'admin@system.com') {
                        expect(res.body).toBeDefined();
                        expect(res.body.status).toBe(200);
                        expect(res.body.user.displayName).toBe(user.displayName);
                        expect(res.body.user.email).toBe(user.email);
                        expect(res.body.user.idToken).toHaveLength(256);
                        user.localId = res.body.user.localId;
                        user.idToken = res.body.user.idToken;
                    } else {
                        expect(res.body).toBeDefined();
                        expect(res.body.status).toBe(401);
                        expect(res.body.msg).toBe('unauthorised');
                    }
                });
        });
    });
});
// admin tests
describe('Test 7 - Administrator get a list of system users and enable their accounts', () => {

    it('should get a list of all users using the priviledged account', async () => {
        await authEndPoint.get('/admin/users')
            .set({
                'Content-Type': 'application/json',
                idToken: goodUsers.find(usr => usr.displayName === 'sysadmin').idToken,
                localId: goodUsers.find(usr => usr.displayName === 'sysadmin').localId,
                query: ''
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body.users).toHaveLength(10);
                res.body.users.forEach(user => {
                    // update user with localId
                    goodUsers.find(usr => usr.displayName === user.displayName).localId = user.localId;
                });
            });
    });

    goodUsers.forEach(user => {

        it('should, using the priviledged user, enable each account: ' + user.displayName, async () => {
            await authEndPoint.patch('/admin/user')
                .set({
                    'Content-Type': 'application/json',
                    idToken: goodUsers.find(usr => usr.displayName === 'sysadmin').idToken,
                    localId: goodUsers.find(usr => usr.displayName === 'sysadmin').localId
                })
                .send({
                    uid: user.localId,
                    roles: user.roles,
                    inuse: true
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .then(res => {
                    expect(res.body.status).toBe(200);
                })
        });
    });

});
//functional tests
describe('Test 8 - Login each user, get their own data, attemp to get another users data, attempt to get a list of all users and then logout', () => {

    //login all users
    goodUsers.forEach(user => {
        it('should, login and return the user details and token for: ' + user.displayName, async () => {
            await authEndPoint.post('/user/login')
                .send({
                    email: user.email,
                    password: crypto.createHash('sha256').update(user.password).digest('hex')
                })
                .set({ 'Content-Type': 'application/json' })
                .expect('Content-Type', /json/)
                .expect(200)
                .then(res => {
                    expect(res.body).toBeDefined();
                    expect(res.body.status).toBe(200);
                    expect(res.body.user.displayName).toBe(user.displayName);
                    expect(res.body.user.email).toBe(user.email);
                    expect(res.body.user.idToken).toHaveLength(256);
                    user.localId = res.body.user.localId;
                    user.idToken = res.body.user.idToken;      
                })
        });
    });
    //get their own user details
    goodUsers.forEach(user => {

        it('should, successfully return the users details for: ' + user.displayName, async () => {
            await authEndPoint.get('/user')
                .set({
                    'Content-Type': 'application/json',
                    idToken: user.idToken,
                    localId: user.localId
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .then(res => {
                    expect(res.body).toBeDefined();
                    expect(res.body.status).toBe(200);
                    expect(res.body.user.displayName).toBe(user.displayName);
                    expect(res.body.user.email).toBe(user.email);
                })
        });
    });
    // attemp to get other users details
    it('should, fail to retieve a different users details with valid token', async () => {
        await authEndPoint.get('/user')
            .set({
                idToken: goodUsers.find(usr => usr.displayName === 'Rand Althor').idToken,
                localId: goodUsers.find(usr => usr.displayName === 'Chade Fallstar').localId
            })
            .set({ 'Content-Type': 'application/json' })
            .expect('Content-Type', /json/)
            .expect(404)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(404);
            })
    });
    // attempt to get list of users
    goodUsers.forEach(user => {

        it('should, return all registered users but only for an administrator role', async () => {
            await authEndPoint.get('/admin/users')
                .set({
                    idToken: user.idToken,
                    localId: user.localId,
                    query: ''
                })
                .set({ 'Content-Type': 'application/json' })
                .expect('Content-Type', /json/)
                .then(res => {
                    if(user.roles.includes('administrator')){
                        // console.log(res.body);
                        expect(res.body.status).toBe(200);
                    } else {
                        expect(res.body.status).toBe(403);
                    }
                })
        });
    });
    // logout
    goodUsers.forEach(user => {

        it('should, logout: ' + user.displayName, async() => {
            await authEndPoint.post('/user/logout')
                .set({
                    idToken: user.idToken,
                    localId: user.localId
                })
                .set({ 'Content-Type': 'application/json' })
                .expect('Content-Type', /json/)
                .expect(200)
        });
    });
});
// update user details
describe('Test 9 - update user details', () => {

    it('should, login and update the users details the user details and token for: ' + goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').displayName, async () => {
        await authEndPoint.post('/user/login')
            .send({
                email: goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').email,
                password: crypto.createHash('sha256').update(goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').password).digest('hex')
            })
            .set({ 'Content-Type': 'application/json' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.user.displayName).toBe(goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').displayName);
                expect(res.body.user.email).toBe(goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').email);
                expect(res.body.user.idToken).toHaveLength(256);
                goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').localId = res.body.user.localId;
                goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').idToken = res.body.user.idToken;      
            })
    });

    it('should return 400 bad request if the display name is not between 3 and 64 chars', async () => {
        await authEndPoint.patch('/user/displayname')
            .send({
                displayName: 'ab'
            })
            .set({
                'Content-Type': 'application/json',
                idToken: goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').idToken,
                localId: goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').localId
            })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');
            })
    });

    it('should return 400 bad request if the display name is not between 3 and 64 chars', async () => {
        await authEndPoint.patch('/user/displayname')
            .send({
                displayName: 'abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij12345'
            })
            .set({
                'Content-Type': 'application/json',
                idToken: goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').idToken,
                localId: goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').localId
            })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');
            })
    });

    it('should return 400 bad request if the email address is not well formed', async () => {
        await authEndPoint.patch('/user/email')
            .send({
                email: ''
            })
            .set({
                'Content-Type': 'application/json',
                idToken: goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').idToken,
                localId: goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').localId
            })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');
            })
    });

    it('should return 400 bad request if the email address is not well formed', async () => {
        await authEndPoint.patch('/user/email')
            .send({
                email: 'test@test.'
            })
            .set({
                'Content-Type': 'application/json',
                idToken: goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').idToken,
                localId: goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').localId

            })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');
            })
    });

    it('should return 400 bad request if the email address is not well formed', async () => {
        await authEndPoint.patch('/user/email')
            .send({
                email: 'test.test.com'
            })
            .set({
                'Content-Type': 'application/json',
                idToken: goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').idToken,
                localId: goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').localId

            })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');
            })
    });

    it('should return 400 bad request if the password is not well formed', async () => {
        await authEndPoint.patch('/user/password')
            .send({
                password: '123456789012345678901234567890123456789012345678901234567890123' // 63 chars
            })
            .set({
                'Content-Type': 'application/json',
                idToken: goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').idToken,
                localId: goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').localId

            })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');
            })
    });

    it('should return 400 bad request if the password is not well formed', async () => {
        await authEndPoint.patch('/user/password')
            .send({
                password: '12345678901234567890123456789012345678901234567890123456789012345' // 65 chars
            })
            .set({
                'Content-Type': 'application/json',
                idToken: goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').idToken,
                localId: goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').localId

            })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');
            })
    });

    it('should return 200 for a successful update of the display name', async () => {
        await authEndPoint.patch('/user/displayname')
            .send({
                displayName: 'Ezekiel Tony'
            })
            .set({
                'Content-Type': 'application/json',
                idToken: goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').idToken,
                localId: goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').localId
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.msg).toBe('ok');
            })
    });

    it('should return 200 for a succeessful update of the email address', async () => {
        await authEndPoint.patch('/user/email')
            .send({
                email: 'Ezekiel.Tony@system.com'
            })
            .set({
                'Content-Type': 'application/json',
                idToken: goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').idToken,
                localId: goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').localId
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.msg).toBe('ok');
            })
    });

    it('should return 400 bad request if the password is not well formed', async () => {
        await authEndPoint.patch('/user/password')
            .send({
                password: crypto.createHash('sha256').update(goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').password).digest('hex')
            })
            .set({
                'Content-Type': 'application/json',
                idToken: goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').idToken,
                localId: goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').localId

            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.msg).toBe('ok');
            })
    });

    it('should, logout: ' + goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').displayName, async() => {
        await authEndPoint.post('/user/logout')
            .set({
                'Content-Type': 'application/json',
                idToken: goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').idToken,
                localId: goodUsers.find(usr => usr.displayName === 'Tony Ezekiel').localId
            })
            .expect('Content-Type', /json/)
            .expect(200)
    });
});
// forgotten password
describe('Test 10 - forgotten password request', () => {

    it('should return 400 bad request if the email address is not well formed', async () => {
        await authEndPoint.post('/user/forgottenpassword')
            .send({
                email: ''
            })
            .set({ 'Content-Type': 'application/json' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');
            })
    });

    it('should return 400 bad request if the email address is not well formed', async () => {
        await authEndPoint.post('/user/forgottenpassword')
            .send({
                email: 'test@test.'
            })
            .set({ 'Content-Type': 'application/json' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');
            })
    });

    it('should return 400 bad request if the email address is not well formed', async () => {
        await authEndPoint.post('/user/forgottenpassword')
            .send({
                email: 'test.test.com'
            })
            .set({ 'Content-Type': 'application/json' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');
            })
    });

    it('should, return 200 for an invalid email', async () => {
        await authEndPoint.post('/user/forgottenpassword')
            .send({
                email: 'not.exist@system.com'
            })
            .set({ 'Content-Type': 'application/json' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.msg).toBe('ok');
            })
    });

    it('should, return 200 for a valid email', async () => {
        await authEndPoint.post('/user/forgottenpassword')
            .send({
                email: goodUsers.find(usr => usr.displayName === 'Kyle Haven').email
            })
            .set({ 'Content-Type': 'application/json' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.msg).toBe('ok');
            })
    });
});
// security tests
describe('Test 11 - Deny access tests:', () => {

    it('should, deny access for incorrect email address', async () => {
        await authEndPoint.post('/user/login')
            .send({
                email: badUsers[0].email,
                password: crypto.createHash('sha256').update(badUsers[0].password).digest('hex')
            })
            .set({ 'Content-Type': 'application/json' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');       
            })
    });

    it('should, deny access for incorrect password', async () => {
        await authEndPoint.post('/user/login')
            .send({
                email: badUsers[1].email,
                password: crypto.createHash('sha256').update(badUsers[1].password).digest('hex')
            })
            .set({ 'Content-Type': 'application/json' })
            .expect('Content-Type', /json/)
            .expect(401)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(401);
                expect(res.body.msg).toBe('unauthorised');       
            })
    });

    it('should, deny access for incorrect email and password', async () => {
        await authEndPoint.post('/user/login')
            .send({
                'Content-Type': 'application/json',
                email: badUsers[2].email,
                password: crypto.createHash('sha256').update(badUsers[2].password).digest('hex')
            })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');       
            })
    });

    it('should, login a valid user for further testing', async () => {
        await authEndPoint.post('/user/login')
            .send({
                email: badUsers[3].email,
                password: crypto.createHash('sha256').update(badUsers[3].password).digest('hex')
            })
            .set({ 'Content-Type': 'application/json' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.user.displayName).toBe(badUsers[3].displayName);
                expect(res.body.user.email).toBe(badUsers[3].email);
                expect(res.body.user.idToken).toHaveLength(256);
                badUsers[3].localId = res.body.user.localId;
                badUsers[3].idToken = res.body.user.idToken;      
            })
    });

    it('should, fail to return user data, given a logged in user but with invalid token', async () => {
        await authEndPoint.get('/user')
            .set({
                'Content-Type': 'application/json',
                idToken: wrongToken,
                localId: badUsers[3].localId
            })
            .expect('Content-Type', /json/)
            .expect(404)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(404);
                expect(res.body.msg).toBe('not found');
            })
    });

    it('should, fail to return user data, given a logged in user but with invadid localId', async () => {
        await authEndPoint.get('/user')
            .set({
                'Content-Type': 'application/json',
                idToken: badUsers[3].idToken,
                localId: '1234567890'
            })
            .expect('Content-Type', /json/)
            .expect(400)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(400);
                expect(res.body.msg).toBe('bad request');
            })
    });

    it('should, fail to return the users details given no headers', async() => {
        await authEndPoint.get('/user')
            .set({ 'Content-Type': 'application/json' })
            .expect('Content-Type', /json/)
            .expect(401)
    });

    it('should, fail to return the users details given null token', async () => {
        await authEndPoint.get('/user')
            .set({
                'Content-Type': 'application/json',
                idToken: null,
                localId: badUsers[3].localId
            })
            .expect('Content-Type', /json/)
            .expect(401)
    });

    it('should, fail to return the users details given an empty token', async () => {
        await authEndPoint.get('/user')
            .set({
                'Content-Type': 'application/json',
                idToken: '',
                localId: badUsers[3].localId
            })
            .expect('Content-Type', /json/)
            .expect(401)
    });

    it('should, fail to create a user with an already registered email address', async () => {
        await authEndPoint.post('/user')
            .send({
                displayName: goodUsers[0].displayName,
                email: goodUsers[0].email,
                password: crypto.createHash('sha256').update(goodUsers[0].password).digest('hex')
            })
            .expect(409)
            .then(res => {
                expect(res.body.status).toBe(409);
                expect(res.body.msg).toBe('duplicate entry');
            })
    });

    it('should, logout the user given the user id', async () => {
        await authEndPoint.post('/user/logout')
            .set({
                'Content-Type': 'application/json',
                idToken: badUsers[3].idToken,
                localId: badUsers[3].localId
            })
            .expect('Content-Type', /json/)
            .expect(200)
    });

});
// // auth token tests
describe('Test 12 - approve transaction tests', () => {

    it('should, return 403 for a non recognised token', async () => {
        await authEndPoint.post('/approvetransaction')
            .set({
                idToken: wrongToken
            })
            .send({
                rules: {
                    roles: ['user'],
                    allowSameUser: true
                }
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(403)
    });

    it('should, return 400 for an empty string token', async () => {
        await authEndPoint.post('/approvetransaction')
            .set({
                idToken: ''
            })
            .send({
                rules: {
                    roles: ['user'],
                    allowSameUser: true
                }
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
    });

    it('should, return 400 for no token', async () => {
        await authEndPoint.post('/approvetransaction')
            .set({
            
            })
            .send({
                rules: {
                    roles: ['user'],
                    allowSameUser: true
                }
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
    });

    it('should, login a valid user for further testing', async () => {
        await authEndPoint.post('/user/login')
            .send({
                email: goodUsers[1].email,
                password: crypto.createHash('sha256').update(goodUsers[1].password).digest('hex')
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.user.displayName).toBe(goodUsers[1].displayName);
                expect(res.body.user.email).toBe(goodUsers[1].email);
                expect(res.body.user.idToken).toHaveLength(256);
                goodUsers[1].localId = res.body.user.localId;
                goodUsers[1].idToken = res.body.user.idToken;
            })
    });

    it('should, return 200 for a valid token', async () => {
        await authEndPoint.post('/approvetransaction')
            .set({
                idToken: goodUsers[1].idToken
            })
            .send({
                rules: {
                    roles: ['user'],
                    allowSameUser: true
                }
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
    });

    it('should, return 403 for a valid token but no role permission', async () => {
        await authEndPoint.post('/approvetransaction')
            .set({
                idToken: goodUsers[1].idToken
            })
            .send({
                rules: {
                    roles: ['user', 'administrator']
                }
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(403)
    });

    it('should, logout the user given the user id', async () => {
        await authEndPoint.post('/user/logout')
            .set({
                idToken: goodUsers[1].idToken,
                localId: goodUsers[1].localId
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
    });

    it('should, return 403 for a logged out user', async () => {
        await authEndPoint.post('/approvetransaction')
            .set({
                idToken: goodUsers[1].idToken
            })
            .send({
                rules: {
                    roles: ['user'],
                    allowSameUser: true
                }
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(403)
    });
});
// auth bug fixes
describe('Bug replication and fixes', () => {

    it('should return 200 server is up', async () => {
        await authEndPoint.get('/')
        .set({ 'Content-Type': 'application/json' })
        .expect(200)
        .then(res => {
            expect(res.body.msg).toBe('service is up!');
        })
    });

    // monitoring the logs on the live server and clocked this request... someone trying to hack the system? 
    it('should return 404 Not Found', async () => {
        await authEndPoint.get('/.env')
        .expect(404)
        .then(res => {
            expect(res.res.statusMessage).toBe('Not Found');
        })
    });

    it('should return 404 Not Found', async () => {
        await authEndPoint.get('/index.html')
        .expect(404)
        .then(res => {
            expect(res.res.statusMessage).toBe('Not Found');
        })
    });
});
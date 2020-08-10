//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../src/app');

// Assertion Style
chai.should();

chai.use(chaiHttp);

let server = chai.request(app).keepOpen();

// Import test data
const {
	alice,
	bob,
	charlie,
	emptyName,
	emptyUsername,
	emptyEmail,
	emptyPassword,
	invalidEmail,
	invalidPassword,
	invalidName,
	invalidUsername,
} = require('./data');

let refresh_token = '';
let access_token = '';

before(() => {});

// REGISTER
describe('Register', () => {
	describe('POST /users/register', () => {
		describe('Successfully registers', () => {
			// Valid user
			it('Valid user', (done) => {
				server
					.post('/users/register')
					.send(alice)
					.end((err, res) => {
						res.should.have.status(201);
						res.body.should.be.equal('Account created');
						res.body.should.be.a('string');
						done();
					});
			});
		});

		describe('Fails to register', () => {
			// Taken username
			it('User with taken username', (done) => {
				server
					.post('/users/register')
					.send(alice)
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.equal('Username taken');
						res.body.should.be.a('string');
						done();
					});
			});

			// All fields empty
			it('User with all empty fields', (done) => {
				server
					.post('/users/register')
					.send({})
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.equal(
							'Empty field(s): username, name, email and password required'
						);
						res.body.should.be.a('string');
						done();
					});
			});

			// Empty username
			it('User with empty username', (done) => {
				server
					.post('/users/register')
					.send(emptyUsername)
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.equal(
							'Empty field(s): username, name, email and password required'
						);
						res.body.should.be.a('string');
						done();
					});
			});

			// Empty email
			it('User with empty email', (done) => {
				server
					.post('/users/register')
					.send(emptyEmail)
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.equal(
							'Empty field(s): username, name, email and password required'
						);
						res.body.should.be.a('string');
						done();
					});
			});

			// Empty name
			it('User with empty name', (done) => {
				server
					.post('/users/register')
					.send(emptyName)
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.equal(
							'Empty field(s): username, name, email and password required'
						);
						res.body.should.be.a('string');
						done();
					});
			});

			// Empty password
			it('User with empty password', (done) => {
				server
					.post('/users/register')
					.send(emptyPassword)
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.equal(
							'Empty field(s): username, name, email and password required'
						);
						res.body.should.be.a('string');
						done();
					});
			});

			// Invalid username
			it('User with invalid username', (done) => {
				server
					.post('/users/register')
					.send(invalidUsername)
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.equal('Invalid username');
						res.body.should.be.a('string');
						done();
					});
			});

			// Invalid email
			it('User with invalid email', (done) => {
				server
					.post('/users/register')
					.send(invalidEmail)
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.equal('Invalid email');
						res.body.should.be.a('string');
						done();
					});
			});

			// Invalid password
			it('User with invalid password', (done) => {
				server
					.post('/users/register')
					.send(invalidPassword)
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.equal('Invalid password');
						res.body.should.be.a('string');
						done();
					});
			});

			// Invalid name
			it('User with invalid name', (done) => {
				server
					.post('/users/register')
					.send(invalidName)
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.equal('Invalid name');
						res.body.should.be.a('string');
						done();
					});
			});
		});
	});
});

// LOGIN
describe('Login', () => {
	describe('POST /users/login', () => {
		describe('Successfull login', () => {
			// Valid user
			it('Valid user', (done) => {
				server
					.post('/users/login')
					.send({
						username: alice.username,
						password: alice.password,
					})
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						refresh_token = res.body.refresh_token;
						done();
					});
			});
		});

		describe('Failed login', () => {
			// All fields empty
			it('All fields empty', (done) => {
				server
					.post('/users/login')
					.send({
						username: '',
						password: '',
					})
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.a('string');
						res.body.should.be.equal(
							'Empty field(s): username and password required'
						);
						done();
					});
			});

			// Empty username
			it('Username empty', (done) => {
				server
					.post('/users/login')
					.send({
						username: '',
						password: 'password123',
					})
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.a('string');
						res.body.should.be.equal(
							'Empty field(s): username and password required'
						);
						done();
					});
			});

			// Empty password
			it('Password empty', (done) => {
				server
					.post('/users/login')
					.send({
						username: 'Bobby123',
						password: '',
					})
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.a('string');
						res.body.should.be.equal(
							'Empty field(s): username and password required'
						);
						done();
					});
			});

			// Wrong combination
			it('Wrong username and password combination', (done) => {
				server
					.post('/users/login')
					.send({
						username: 'Bobby123',
						password: 'AndHisWrongPassword123',
					})
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.a('string');
						res.body.should.be.equal('Login data invalid');
						done();
					});
			});
		});
	});
});

// TOKEN
describe('Token', () => {
	describe('POST /users/token', () => {
		describe('Successfull', () => {
			// Valid refresh token
			it('Valid refresh token', (done) => {
				server
					.post('/users/token')
					.send({ refresh_token: refresh_token })
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						access_token = res.body.access_token;
						done();
					});
			});
		});
		describe('Fails', () => {
			// Empty refresh token
			it('Empty refresh token', (done) => {
				server
					.post('/users/token')
					.send({ refresh_token: '' })
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.a('string');
						res.body.should.be.equal('Refresh token required');
						done();
					});
			});

			// Invalid refresh token
			//   it("Invalid refresh token", (done) => {
			//     server
			//       .post("/users/token")
			//       .send({ refresh_token: "" })
			//       .end((err, res) => {
			//         res.should.have.status(400);
			//         res.body.should.be.a("string");
			//         res.body.should.be.equal("Token is no longer valid");
			//         done();
			//       });
			//   });
		});
	});

	describe('DELETE /users/token', () => {
		describe('Successfull', () => {
			// Valid refresh token
			it('Valid refresh token', (done) => {
				server
					.delete('/users/token')
					.set('Authorization', `Bearer ${access_token}`)
					.send({ refresh_token: refresh_token })
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('string');
						res.body.should.be.equal('Token deleted');
						done();
					});
			});
		});
		describe('Fails', () => {
			// Missing access token
			it('Missing access token', (done) => {
				server
					.delete('/users/token')
					.send({ refresh_token: '' })
					.end((err, res) => {
						res.should.have.status(401);
						res.body.should.be.a('string');
						res.body.should.be.equal('Login required');
						done();
					});
			});
			// Empty refresh token
			it('Empty refresh token', (done) => {
				server
					.delete('/users/token')
					.send({ refresh_token: '' })
					.set('Authorization', `Bearer ${access_token}`)
					.end((err, res) => {
						res.should.have.status(400);
						res.body.should.be.a('string');
						res.body.should.be.equal('Refresh token missing');
						done();
					});
			});
		});
	});
});

// PROFILE
describe('Profile', () => {
	describe('GET /users/profile', () => {
		it('Successfull', (done) => {
			server
				.get('/users/profile')
				.set('Authorization', `Bearer ${access_token}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('username');
					res.body.should.have.property('email');
					res.body.should.have.property('name');
					res.body.should.have.property('total_lent');
					res.body.should.have.property('total_borrowed');
					res.body.should.have.property('current_lent');
					res.body.should.have.property('current_borrowed');

					done();
				});
		});
	});
	describe('GET /users/profile/:username', () => {
		describe('Successfull', () => {
			// Guest
			it('Guest', (done) => {
				server
					.get(`/users/profile/${alice.username}`)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('username');
						res.body.should.have.property('name');
						res.body.should.have.property('total_lent');
						res.body.should.have.property('total_borrowed');
						res.body.should.have.property('current_lent');
						res.body.should.have.property('current_borrowed');
						done();
					});
			});
			// Logged in
			it('Logged in', (done) => {
				server
					.get(`/users/profile/${alice.username}`)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('username');
						res.body.should.have.property('name');
						res.body.should.have.property('total_lent');
						res.body.should.have.property('total_borrowed');
						res.body.should.have.property('current_lent');
						res.body.should.have.property('current_borrowed');
						done();
					});
			});
		});

		describe('Fails', () => {
			// User doesn't exist
			it("User doesn't exist", (done) => {
				server.get(`/users/profile/xD`).end((err, res) => {
					res.should.have.status(404);
					res.body.should.be.a('string');
					res.body.should.be.equal('User not found');
					done();
				});
			});
		});
	});
});

after(() => {
	server.close();
});

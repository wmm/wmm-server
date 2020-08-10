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

let alice_tokens = {
	refresh_token: '',
	access_token: '',
};

let bob_tokens = {
	refresh_token: '',
	access_token: '',
};

/* CREATE 2 ACCOUNTS */
describe('Creating 2 accounts', () => {
	// alice
	it('register alice', (done) => {
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

	// bob
	it('register bob', (done) => {
		server
			.post('/users/register')
			.send(bob)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.equal('Account created');
				res.body.should.be.a('string');
				done();
			});
	});
});

/* LOGIN */
describe('Log both accounts in', () => {
	// alice
	it('login alice', (done) => {
		server
			.post('/users/login')
			.send({
				username: alice.username,
				password: alice.password,
			})
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				alice_tokens.refresh_token = res.body.refresh_token;
				done();
			});
	});

	// bob
	it('login bob', (done) => {
		server
			.post('/users/login')
			.send({
				username: bob.username,
				password: bob.password,
			})
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				bob_tokens.refresh_token = res.body.refresh_token;
				done();
			});
	});
});

/* GET ACCESS TOKENS */
describe('Get access tokens', () => {
	// alice
	it('alice ', (done) => {
		server
			.post('/users/token')
			.send({ refresh_token: alice_tokens.refresh_token })
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				alice_tokens.access_token = res.body.access_token;
				done();
			});
	});

	// bob
	it('bob', (done) => {
		server
			.post('/users/token')
			.send({ refresh_token: bob_tokens.refresh_token })
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				bob_tokens.access_token = res.body.access_token;
				done();
			});
	});
});

describe('GET /friends...', () => {
	// Alice sends a request to Bob
	it('alice adds bob', (done) => {
		server
			.get(`/friends/add/${bob.username}`)
			.set('Authorization', `Bearer ${alice_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.equal('Friend request sent');
				res.body.should.be.a('string');
				done();
			});
	});

	// Alice sends another request to Bob
	it('alice sends another request to bob - FAILS', (done) => {
		server
			.get(`/friends/add/${bob.username}`)
			.set('Authorization', `Bearer ${alice_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.equal('Friend request already sent');
				res.body.should.be.a('string');
				done();
			});
	});

	// Bob rejects the request
	it('bob rejects the request', (done) => {
		server
			.get(`/friends/remove/${alice.username}`)
			.set('Authorization', `Bearer ${bob_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.equal('Friend request rejected');
				res.body.should.be.a('string');
				done();
			});
	});

	// Bob sends a request to Alice
	it('bob sends a request to alice', (done) => {
		server
			.get(`/friends/add/${alice.username}`)
			.set('Authorization', `Bearer ${bob_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.equal('Friend request sent');
				res.body.should.be.a('string');
				done();
			});
	});

	// Bob cancels the request
	it('bob cancels the request', (done) => {
		server
			.get(`/friends/remove/${alice.username}`)
			.set('Authorization', `Bearer ${bob_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.equal('Friend request canceled');
				res.body.should.be.a('string');
				done();
			});
	});

	// Alice sends a request to Bob
	it('alice sends a request to bob', (done) => {
		server
			.get(`/friends/add/${bob.username}`)
			.set('Authorization', `Bearer ${alice_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.equal('Friend request sent');
				res.body.should.be.a('string');
				done();
			});
	});

	// Bob checks incoming requests
	it('bob checks incoming requests', (done) => {
		server
			.get(`/friends/requests`)
			.set('Authorization', `Bearer ${bob_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(200);
				res.body[0].should.be.equal(alice.username);
				res.body.should.be.a('array');
				done();
			});
	});

	// Bob accepts the request
	it('bob accepts the request', (done) => {
		server
			.get(`/friends/add/${alice.username}`)
			.set('Authorization', `Bearer ${bob_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.equal('Friend added');
				res.body.should.be.a('string');
				done();
			});
	});

	// Alice sends another request to Bob
	it('alice sends another request to bob - FAILS', (done) => {
		server
			.get(`/friends/add/${bob.username}`)
			.set('Authorization', `Bearer ${alice_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.equal('You are already friends');
				res.body.should.be.a('string');
				done();
			});
	});

	// Bob checks friends list
	it('bob checks friends list', (done) => {
		server
			.get(`/friends`)
			.set('Authorization', `Bearer ${bob_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(200);
				res.body[0].should.be.equal(alice.username);
				res.body.should.be.a('array');
				done();
			});
	});

	// Bob removes Alice
	it('bob removes alice', (done) => {
		server
			.get(`/friends/remove/${alice.username}`)
			.set('Authorization', `Bearer ${bob_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.equal('Friend removed');
				res.body.should.be.a('string');
				done();
			});
	});

	// Bob tries to remove alice again
	it('bob tries to remove alice again - FAILS', (done) => {
		server
			.get(`/friends/remove/${alice.username}`)
			.set('Authorization', `Bearer ${bob_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.equal('You are not friends');
				res.body.should.be.a('string');
				done();
			});
	});

	// Bob checks friends list
	it('bob checks friends list', (done) => {
		server
			.get(`/friends`)
			.set('Authorization', `Bearer ${bob_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.length.should.be.equal(0);
				res.body.should.be.a('array');
				done();
			});
	});
});

after(() => {
	server.close();
});

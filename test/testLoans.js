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

let charlie_tokens = {
	refresh_token: '',
	access_token: '',
};

const loan1 = {
	title: 'Coffe',
	user: bob.username,
	amount: 12.3,
};

const loan2 = {
	title: 'Pizza',
	user: alice.username,
	amount: 33.33,
};

const loan3 = {
	title: 'Donut',
	user: 'bobby',
	amount: 0.99,
};

const loan4 = {
	title: 'Ice cream',
	user: charlie.username,
	amount: 2.6,
};

const invalidLoan = {
	title: 'Scam',
	user: bob.username,
	amount: 'ab21',
};

/* CREATE 3 ACCOUNTS */
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

	// charlie
	it('register charlie', (done) => {
		server
			.post('/users/register')
			.send(charlie)
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

	// charlie
	it('login charlie', (done) => {
		server
			.post('/users/login')
			.send({
				username: charlie.username,
				password: charlie.password,
			})
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				charlie_tokens.refresh_token = res.body.refresh_token;
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

	// charlie
	it('charlie', (done) => {
		server
			.post('/users/token')
			.send({ refresh_token: charlie_tokens.refresh_token })
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				charlie_tokens.access_token = res.body.access_token;
				done();
			});
	});
});

describe('/loans...', () => {
	// Alice sends a loan request to Bob
	it('alice sends a loan request to bob', (done) => {
		server
			.post('/loans')
			.set('Authorization', `Bearer ${alice_tokens.access_token}`)
			.send(loan1)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.equal('Loan created');
				res.body.should.be.a('string');
				done();
			});
	});

	// Alice sends a loan request with missing username
	it('alice sends a loan request with missing username - FAILS', (done) => {
		server
			.post('/loans')
			.set('Authorization', `Bearer ${alice_tokens.access_token}`)
			.send({ amount: 1.0 })
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.equal(
					'Missing field(s): user and amount required'
				);
				res.body.should.be.a('string');
				done();
			});
	});

	// Alice sends a loan request with missing amount
	it('alice sends a loan request with missing amount - FAILS', (done) => {
		server
			.post('/loans')
			.set('Authorization', `Bearer ${alice_tokens.access_token}`)
			.send({ username: bob.username })
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.equal(
					'Missing field(s): user and amount required'
				);
				res.body.should.be.a('string');
				done();
			});
	});

	// Alice sends a loan request with invalid amount
	it('alice sends a loan request with invalid amount - FAILS', (done) => {
		server
			.post('/loans')
			.set('Authorization', `Bearer ${alice_tokens.access_token}`)
			.send(invalidLoan)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.equal('Invalid field: amount');
				res.body.should.be.a('string');
				done();
			});
	});

	// Alice sends a loan request to herself
	it('alice sends a loan request to herself - FAILS', (done) => {
		server
			.post('/loans')
			.set('Authorization', `Bearer ${alice_tokens.access_token}`)
			.send(loan2)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.equal('Cannot create a loan with yourself');
				res.body.should.be.a('string');
				done();
			});
	});

	// Alice sends a loan request to a user that does't exist
	it("alice sends a loan request to a user that does't exist - FAILS", (done) => {
		server
			.post('/loans')
			.set('Authorization', `Bearer ${alice_tokens.access_token}`)
			.send(loan3)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.equal('User does not exist');
				res.body.should.be.a('string');
				done();
			});
	});

	// Bob checks his loan list
	it('bob checks his loan list', (done) => {
		server
			.get('/loans')
			.set('Authorization', `Bearer ${bob_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('array');
				done();
			});
	});

	// Bob accepts the loan request from Alice
	it('bob accepts the loan request from alice', (done) => {
		server
			.patch('/loans/id/1/confirm')
			.set('Authorization', `Bearer ${bob_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('string');
				res.body.should.be.equal('Loan confirmed');
				done();
			});
	});

	// Bob trys to accept the loan again
	it('bob trys to accept the loan again - FAILS', (done) => {
		server
			.patch('/loans/id/1/confirm')
			.set('Authorization', `Bearer ${bob_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a('string');
				res.body.should.be.equal('Loan already confirmed');
				done();
			});
	});

	// Bob sends a loan request to Alice
	it('bob sends a loan request to alice', (done) => {
		server
			.post('/loans')
			.set('Authorization', `Bearer ${bob_tokens.access_token}`)
			.send(loan2)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.equal('Loan created');
				res.body.should.be.a('string');
				done();
			});
	});

	// Bob sends a loan request to Charlie
	it('bob sends a loan request to Charlie', (done) => {
		server
			.post('/loans')
			.set('Authorization', `Bearer ${bob_tokens.access_token}`)
			.send(loan4)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.equal('Loan created');
				res.body.should.be.a('string');
				done();
			});
	});

	// Bob trys to accept his own loan request
	it('bob trys to accept his own loan request - FAILS', (done) => {
		server
			.patch('/loans/id/2/confirm')
			.set('Authorization', `Bearer ${bob_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a('string');
				res.body.should.be.equal(
					'You cannot confirm a loan you created'
				);
				done();
			});
	});

	// Bob trys to accept a loan with an invalid id
	it('bob trys to accept a loan with an invalid id - FAILS', (done) => {
		server
			.patch('/loans/id/999999/confirm')
			.set('Authorization', `Bearer ${bob_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a('string');
				res.body.should.be.equal('Loan does not exist');
				done();
			});
	});

	// Alice rejects the loan request from Bob
	it('alice rejects the loan request from bob', (done) => {
		server
			.patch('/loans/id/2/reject')
			.set('Authorization', `Bearer ${alice_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('string');
				res.body.should.be.equal('Loan rejected');
				done();
			});
	});

	// Alice trys to reject the loan again
	it('alice trys to reject the loan again - FAILS', (done) => {
		server
			.patch('/loans/id/2/reject')
			.set('Authorization', `Bearer ${alice_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a('string');
				res.body.should.be.equal('Loan already rejected');
				done();
			});
	});

	// Alice trys to reject a loan that Bob send to Charlie
	it('Alice trys to reject a loan that bob send to charlie - FAILS', (done) => {
		server
			.patch('/loans/id/3/reject')
			.set('Authorization', `Bearer ${alice_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(403);
				res.body.should.be.a('string');
				res.body.should.be.equal(
					'You can not access other peoples loans'
				);
				done();
			});
	});

	// Alice trys to accept a loan that Bob send to Charlie
	it('alice trys to accept a loan that bob send to charlie - FAILS', (done) => {
		server
			.patch('/loans/id/3/confirm')
			.set('Authorization', `Bearer ${alice_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(403);
				res.body.should.be.a('string');
				res.body.should.be.equal(
					'You can not access other peoples loans'
				);
				done();
			});
	});

	// Alice trys to reject a loan with an invalid id
	it('alice trys to reject a loan with an invalid id - FAILS', (done) => {
		server
			.patch('/loans/id/99999/reject')
			.set('Authorization', `Bearer ${alice_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(400);
				res.body.should.be.a('string');
				res.body.should.be.equal('Loan does not exist');
				done();
			});
	});

	// Alice sends a loan request to Bob
	it('alice sends a loan request to bob', (done) => {
		server
			.post('/loans')
			.set('Authorization', `Bearer ${alice_tokens.access_token}`)
			.send(loan1)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.be.equal('Loan created');
				res.body.should.be.a('string');
				done();
			});
	});

	// Alice cancels the loan request
	it('alice cancels the loan request', (done) => {
		server
			.patch('/loans/id/4/reject')
			.set('Authorization', `Bearer ${alice_tokens.access_token}`)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('string');
				res.body.should.be.equal('Loan rejected');
				done();
			});
	});
});

after(() => {
	server.close();
});

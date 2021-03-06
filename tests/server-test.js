process.env.NODE_ENV = 'test';


const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert
const chaiHttp = require('chai-http');
const server = require('../server.js');
const configuration = require('../knexfile')['test'];
const database = require('knex')(configuration);
// const knex = require('knex')(configuration)


chai.use(chaiHttp);

describe('Server', () => {
  beforeEach(function(done) {
    database.migrate.rollback()
    .then(function() {
      database.migrate.latest()
      .then(function() {
        return database.seed.run()
        .then(function() {
          done();
        });
      });
    });
  });
  it('should exist', () => {
    expect(server).to.exist;
  });
  describe('GET /', () => {
    it('should send back an html file', (done) => {
      chai.request(server)
      .get('/')
      .end((err, res) => {
        if(err) { done(err); }
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        done();
      });
    });
  });

  //SAD PATH
  describe('GET /', () => {
    it('should respond back with a 404 error', (done) => {
      chai.request(server)
      .get('/ /')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
    });
  });

  describe('GET /api/v1/users', () => {
    it('should respond back with all users', (done) => {
      chai.request(server)
      .get('/api/v1/users')
      .end((err, res) => {
        if(err) {done(err) }
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(6);
        done();
      });
    });
  });

  //SAD PATH
  describe('GET /api/v1/users', () => {
    it('should respond back with a 404 error', (done) => {
      chai.request(server)
      .get('/api/v1/userss')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
    });
  });

  describe('GET /api/v1/comments/:familyId', () => {
    it('should respond back with all comments', (done) => {
      chai.request(server)
      .get('/api/v1/comments/2')
      .end((err, res) => {
        if(err) {done(err) }
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(2);
        done();
      });
    });
  });

  //SAD PATH
  describe('GET /api/v1/comments', () => {
    it('should respond back with a 404 error', (done) => {
      chai.request(server)
      .get('/api/v1/commentss')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
    });
  });

  describe('GET /api/v1/family/all', () => {``
    it('should respond back with all family', (done) => {
      chai.request(server)
      .get('/api/v1/family')
      .end((err, res) => {
        if(err) {done(err) }
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(6);
        done();
      });
    });
  });

  //SAD PATH
  describe('GET /api/v1/family/all', () => {
    it('should respond back with a 404 error', (done) => {
      chai.request(server)
      .get('/api/v1/famly/all')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
    });
  });

  // COME BACK TO THIS ONE
  describe('GET /api/v1/donation/:familyId', () => {
    it('should respond back with all donation', (done) => {
      chai.request(server)
      .get('/api/v1/donation/1')
      .end((err, res) => {
        if(err) {done(err) }
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(1);
        done();
      });
    });
  });

  //SAD PATH
  describe('GET /api/v1/donation', () => {
    it('should respond back with a 404 error', (done) => {
      chai.request(server)
      .get('/api/v1/donations')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
    });
  });

  //GET FAMILY WITH PARAM
  describe('GET /api/v1/family', () => {
    it('should respond back with the number of families we ask for', (done) => {
      chai.request(server)
      .get('/api/v1/family/?limit=3')
      .end((err, res) => {
        if(err) {done(err) }
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(3);
        done();
      });
    });
  });

  //SAD PATH
  describe('GET /api/v1/family', () => {
    it('should respond back with a 404 error', (done) => {
      chai.request(server)
      .get('/api/v1/familly')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
    });
  });

  describe('POST /api/v1/register', function() {
    it('should create a new user', function(done) {
      let user = {
        email:'mikeziccardi@ishandsome.com',
        password:'thepasswordistaco',
        firstName:'Mike',
        lastName:'IsHandsome'
      }
      chai.request(server)
      .post('/api/v1/register')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        done();
      });
    });
  });
  //
  //SAD PATH
  describe('POST /api/v1/register', function() {
    it('should respond with a 404', function(done) {
      let user = {userName:'user fun'}
      chai.request(server)
      .post('/api/v1/userss')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.a('object');
        done();
      });
    });
  });

  // TODO: make this pass
  describe('POST /api/v1/login', function() {
    it.skip('should let a user login', function(done) {
      let user = {
        email: "acslater@gmail.com",
      }
      chai.request(server)
      .post('/api/v1/login')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(1);
        done();
      });
    });
  });

  //SAD PATH
  describe('POST /api/v1/login', function() {
    it('should respond with a 404', function(done) {
      let user = {userName:'user fun'}
      chai.request(server)
      .post('/api/v1/userss')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.a('object');
        done();
      });
    });
  });


  describe('POST /api/v1/donation', function() {
    it('should create a new donation', function(done) {
      let donation = {
        familyId:1,
        donationAmount:100,
        firstName:'bob',
        lastName:'belcher',
        email:'burgerbob@aol.com',
      }
      chai.request(server)
      .post('/api/v1/donation')
      .send(donation)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(2);
        done();
      });
    });
  });

  //SAD PATH
  describe('POST /api/v1/donation', function() {
    it('should respond with a 404', function(done) {
      let user = {userName:'user fun'}
      chai.request(server)
      .post('/api/v1/donationss')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.a('object');
        done();
      });
    });
  });

  describe('POST /api/v1/family', function() {
    it('should create a new family', function(done) {
      let family = {
        expiration: '09/01/2017',
        location:'Denver',
        name: 'The Belchers',
        title:'Lets buy a baby',
        cost: 20000,
        userId: 1
      }
      chai.request(server)
      .post('/api/v1/family')
      .send(family)
      .end((err, res) => {
        expect(res).to.have.status(201)
        expect(res).to.be.json;
        expect(res.body).to.be.a('array')
        expect(res.body).to.have.length(1);
        done();
      });
    });
  });

  //SAD PATH
  describe('POST /api/v1/family', function() {
    it('should respond with a 404', function(done) {
      let family = {
        expiration: '09/01/2017',
        location:'Denver',
        name: 'The Belchers',
        title:'Lets buy a baby',
        cost: 20000,
        userId: 1
      }
      chai.request(server)
      .post('/api/v1/familys')
      .send(family)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.a('object');
        done();
      });
    });
  });

  describe('POST /api/v1/comments', function() {
    it('should create a new comment', function(done) {
      let comment = {
        body:'This is a neato comment',
        familyId: 2,
        userId: 1,
      }
      chai.request(server)
      .post('/api/v1/comments')
      .send(comment)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(3);
        done();
      });
    });
  });

  //SAD PATH
  describe('POST /api/v1/comments', function() {
    it('should respond with a 404', function(done) {
      let comment = {
        body:'This is a neato comment',
        familyId: 2,
        userId: 1,
      }
      chai.request(server)
      .post('/api/v1/comment')
      .send(comment)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.a('object');
        done();
      });
    });
  });

  //Cant delete user if family is still associated with it?
  describe('DELETE /api/v1/users/:id', ()=> {
    it.skip('should delete a user', (done)=> {
      chai.request(server)
      .delete('/api/v1/users/1')
      .end((error, res)=> {
        expect(res).to.have.status(422)
        expect(res).to.be.json
        expect(res.body).to.be.a('object')
        expect(res.body).to.have.length(5)
        done()
      })
    })
  })

  //SAD PATH
  describe('DELETE /api/v1/users/:id', function() {
    it('should return a 422 if user is not found', function(done) {
      chai.request(server)
      .delete('/api/v1/users/134')
      .end(function(err, res) {
        expect(res).to.have.status(422);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        // expect(res.body).to.have.length(5)

        done();
      });
    });
  });

  describe('DELETE /api/v1/donation/:id', ()=> {
    it('should delete a donation', (done)=> {
      chai.request(server)
      .delete('/api/v1/donation/1')
      .end((error, res)=> {
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(res.body).to.be.a('object')
        done()
      })
    })
  })

  //SAD PATH
  describe('DELETE /api/v1/comments/:id', function() {
    it('should return a 404 if comment is not found', function(done) {
      chai.request(server)
      .delete('/api/v1/commentz/12')
      .end(function(err, res) {
        expect(res).to.have.status(404);
        expect(res.body).to.be.a('object');
        done();
      });
    });
  });

  describe('DELETE /api/v1/family/:id', ()=> {
    it.skip('should delete a donation', (done)=> {
      chai.request(server)
      .delete('/api/v1/family/1')
      .end((error, res)=> {
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(res.body).to.be.a('object')
        done()
      })
    })
  })

  //SAD PATH
  describe('DELETE /api/v1/family/:id', function() {
    it('should return a 404 if family is not found', function(done) {
      chai.request(server)
      .delete('/api/v1/famlys/1')
      .end(function(err, res) {
        expect(res).to.have.status(404);
        expect(res.body).to.be.a('object');
        done();
      });
    });
  });

  describe('PATCH /api/v1/users/:id', ()=> {
    it('should edit a users email', (done)=> {
      let updated ={
        email:'testmail@gmail.com'
      }
      chai.request(server)
      .patch('/api/v1/users/1')
      .send(updated)
      .end((error, res)=> {
        expect(res).to.have.status(201)
        expect(res.body).to.be.a('object')
        expect(res.body.success).to.equal('true')
        done()
      })
    })
  })

    //SAD PATH
  describe('PATCH /api/v1/users/:id', ()=> {
      it('should return 404 if incorrect path is entered', (done)=> {
        chai.request(server)
        .post('/api/v1/uers/1')
        .end((error, res)=> {
          expect(res).to.have.status(404)
          done()
        })
      })
    })

    describe('PATCH /api/v1/comments/:id', ()=> {
    it('should edit a comments body', (done)=> {
      chai.request(server)
      .patch('/api/v1/comments/1')
      .send({
        body: 'yoyoyoyoyoyo'
      })
      .end((error, res)=> {
        expect(res).to.have.status(201)
        expect(res).to.be.json
        expect(res.body).to.be.a('object')
        expect(res.body.success).to.equal('true')
        done()
      })
    })
  })
  //sad path
    describe('PATCH /api/v1/comments/:id', ()=> {
        it('should return 404 if incorrect path is entered', (done)=> {
          chai.request(server)
          .post('/api/v1/comments/1')
          .end((error, res)=> {
            expect(res).to.have.status(404)
            done()
          })
        })
      })

  describe('PATCH /api/family/:id', ()=> {
    it('should edit a favorites body', (done)=> {
      let updatedFamily = {
        story:'we have a new story'
      }
      chai.request(server)
      .patch('/api/v1/family/1')
      .send(updatedFamily)
      .end((error, res)=> {
        expect(res).to.have.status(200)
        expect(res.body).to.be.a('array')
        expect(res.body[0].story).to.equal('we have a new story')
        done()
      })
    })
  })
    //SAD PATH
    describe('PATCH /api/v1/favorites/:id', ()=> {
        it('should return 404 if incorrect path is entered', (done)=> {
          chai.request(server)
          .post('/api/v1/favorites/1')
          .end((error, res)=> {
            expect(res).to.have.status(404)
            done()
          })
        })
      })
    })

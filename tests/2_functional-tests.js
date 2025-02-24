const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('POST /api/books => create book object/expect book object', function() {
    
    test('Test POST /api/books with title', function(done) {
      chai.request(server)
        .post('/api/books')
        .send({title: 'Book Title'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, 'title', 'Book should contain title');
          assert.property(res.body, '_id', 'Book should contain _id');
          done();
        });
    });
    
    test('Test POST /api/books with no title given', function(done) {
      chai.request(server)
        .post('/api/books')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field title');
          done();
        });
    });
    
  });

  suite('GET /api/books => array of books', function(){
    
    test('Test GET /api/books',  function(done){
      chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          if(res.body.length > 0) {
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          }
          done();
        });
    });    
    
  });

  suite('GET /api/books/[id] => book object with [id]', function(){
    
    test('Test GET /api/books/[id] with valid id in db',  function(done){
      // Using your provided valid id
      let validId = '676e4de8f2cf7488fe7c4782';
      chai.request(server)
        .get('/api/books/' + validId)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, 'title', 'Book should contain title');
          assert.property(res.body, '_id', 'Book should contain _id');
          assert.property(res.body, 'comments', 'Book should contain comments');
          done();
        });
    });
    
    test('Test GET /api/books/[id] with id not in db',  function(done){
      chai.request(server)
        .get('/api/books/000000000000000000000000')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
    });
    
  });

  suite('POST /api/books/[id] => add comment/expect book object with id', function(){
    
    test('Test POST /api/books/[id] with comment', function(done){
      // Using your provided valid id
      let validId = '676e4de8f2cf7488fe7c4782';
      chai.request(server)
        .post('/api/books/' + validId)
        .send({comment: 'Test comment'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, 'title', 'Book should contain title');
          assert.property(res.body, '_id', 'Book should contain _id');
          assert.property(res.body, 'comments', 'Book should contain comments');
          assert.include(res.body.comments, 'Test comment', 'Comments should contain test comment');
          done();
        });
    });
    
    test('Test POST /api/books/[id] without comment field', function(done){
      // Using your provided valid id
      let validId = '676e4de8f2cf7488fe7c4782';
      chai.request(server)
        .post('/api/books/' + validId)
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'missing required field comment');
          done();
        });
    });
    
    test('Test POST /api/books/[id] with comment, id not in db', function(done){
      chai.request(server)
        .post('/api/books/000000000000000000000000')
        .send({comment: 'Test comment'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
    });
    
  });

  suite('DELETE /api/books/[id] => delete book object id', function() {
    
    test('Test DELETE /api/books/[id] with valid id in db', function(done){
      // Using your provided valid id
      let validId = '676e4de8f2cf7488fe7c4782';
      chai.request(server)
        .delete('/api/books/' + validId)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'delete successful');
          done();
        });
    });
    
    test('Test DELETE /api/books/[id] with id not in db', function(done){
      chai.request(server)
        .delete('/api/books/000000000000000000000000')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
    });
    
  });

});

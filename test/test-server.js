var chai = require('chai');
var chaiHttp = require('chai-http');

global.environment = 'test';
var server = require('../server.js');
var Item = require('../models/item');
var seed = require('../db/seed');
var mongoose = require('mongoose');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {
  var addedID = '';
  
  before(function(done) {
    seed.run(function() {
      done();
    }, function(err) {
      console.error(err);
    });
  });
  
  after(function(done) {
    // So does this remove all entries from the model?
    Item.remove(function() {
      done();
    });
  });
  
  it('should list items on get', function(done) {
    chai.request(app).get('/items').end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body.should.have.length(3);
      res.body[0].should.be.a('object');
      res.body[0].should.have.property('_id');
      res.body[0].should.have.property('name');
      res.body[0]._id.should.be.a('string');
      res.body[0].name.should.be.a('string');
      res.body[0].name.should.equal('Broad Beans');
      res.body[1].name.should.equal('Tomatoes');
      res.body[2].name.should.equal('Peppers');
      done();
    });  
  }); 
  
  it('should add an item on post', function(done) {
    chai.request(app)
      .post('/items')
      .send({name: 'pizza'})
      .end(function(err, res) {
      res.should.have.status(201);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('_id');
      // Store ID of added object so we can
      // edit and remove
      addedID = res.body._id;
      res.body.should.have.property('name');
      res.body._id.should.be.a('string');
      res.body.name.should.be.a('string');
      res.body.name.should.equal('pizza');
      //Item.should.have.length(4);
      // Is there a better way???  I tried Item.length and got 3 instead of 4
      Item.count({}, function(err, cnt) {
        if (!err) {
          cnt.should.equal(4);
        }
      });
      done();
    });
  });
  
  it('should edit an item on put to an existing id', function(done) {
    chai.request(app)
      .put('/items/' + addedID)
      .send({name: 'candy bar'})
      .end(function(err, res) {
      res.should.have.status(201);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('_id');
      res.body.should.have.property('name');
      res.body._id.should.be.a('string');
      res.body.name.should.be.a('string');
      res.body._id.should.equal(addedID);
      res.body.name.should.equal('candy bar');
      //Item.should.have.length(4);
      // Is there a better way???  I tried Item.length and got 3 instead of 4
      Item.count({}, function(err, cnt) {
        if (!err) {
          cnt.should.equal(4);
        }
      });
      done();
    });
  });
  
  it('should add new item on put to id that does not exist', function(done) {
    chai.request(app)
      .put('/items/' + mongoose.Types.ObjectId())
      .send({name: 'mushrooms'})
      .end(function(err, res) {
      res.should.have.status(201);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('_id');
      res.body.should.have.property('name');
      res.body._id.should.be.a('string');
      res.body.name.should.be.a('string');
      //res.body.id.should.equal(10);
      res.body.name.should.equal('mushrooms');
      // the post test added an item as di
      // this test so length should now be 5
      Item.count({}, function(err, cnt) {
        if (!err) {
          cnt.should.equal(5);
        }
      });
      done();
    });
  });
  
  it('should delete an item on delete', function(done) {
    chai.request(app)
      .delete('/items/' + addedID)
      .end(function(err, res) {
      res.should.have.status(201);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('message');
      res.body.message.should.be.a('string');
      res.body.message.should.equal("Item deleted!");
      // the list length should be back to 4
      Item.count({}, function(err, cnt) {
        if (!err) {
          cnt.should.equal(4);
        }
      });
      done();
    });
  });

/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

	suite('POST /api/issues/{project} => object with issue data', function() {

		test('Every field filled in', function(done) {
			chai.request(server)
			.post('/api/issues/testProject')
			.send({
				issue_title: 'Title',
				issue_text: 'text',
				created_by: 'Functional Test - Every field filled in',
				assigned_to: 'Chai and Mocha',
				status_text: 'In QA'
			})
			.end(function(err, res){
				assert.equal(res.status, 200);
				assert.isDefined(res.body._id);
				assert.equal(res.body.issue_title, 'Title');         
				assert.equal(res.body.issue_text, 'text');
				assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
				assert.equal(res.body.assigned_to, 'Chai and Mocha');
				assert.equal(res.body.status_text, 'In QA');
				assert.equal(new Date(res.body.created_on).toLocaleDateString(), new Date().toLocaleDateString());
				assert.equal(new Date(res.body.updated_on).toLocaleDateString(), new Date().toLocaleDateString());
				assert.equal(res.body.open, true);
				done();
			});
		});

		test('Required fields filled in', function(done) {
			chai.request(server)
			.post('/api/issues/testProject')
			.send({
				issue_title: 'Title',
				issue_text: 'text',
				created_by: 'Functional Test - Every field filled in'
			})
			.end(function(err, res){
				assert.equal(res.status, 200);
				assert.isDefined(res.body._id);
				assert.equal(res.body.issue_title, 'Title');         
				assert.equal(res.body.issue_text, 'text');
				assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
				assert.equal(new Date(res.body.created_on).toLocaleDateString(), new Date().toLocaleDateString());
				assert.equal(new Date(res.body.updated_on).toLocaleDateString(), new Date().toLocaleDateString());
				assert.equal(res.body.open, true);
				done();
			});
		});

		test('Missing required fields', function(done) {
			chai.request(server)
			.post('/api/issues/testProject')
			.send({
				issue_title: 'Title',
				issue_text: 'text'
			})
			.end(function(err, res){
				assert.equal(res.status, 500);
				assert.equal(res.body, "Error - Could not save Issue");
				done();
			});
		});

	});

	suite('PUT /api/issues/{project} => text', function() {

		test('No body', function(done) {
			chai.request(server)
			.put('/api/issues/testProject')
			.end(function(err, res){
				assert.equal(res.status, 200);
				assert.equal(res.body, "no updated field sent");
				done();
			});

		});

		test('One field to update', function(done) {
			chai.request(server)
			.put('/api/issues/testProject')
			.send({'_id': '5bb3d48d4890852eea4f3593', 'status_text': 'hello'})
			.end(function(err, res){
				assert.equal(res.status, 200);
				assert.equal(res.body, "successfully updated");
				done();
			});
		});

		test('Multiple fields to update', function(done) {
			chai.request(server)
			.put('/api/issues/testProject')
			.send({'_id': '5bb3d48f4890852eea4f3594', 'status_text': 'assigned', 'assigned_to': 'tester123'})
			.end(function(err, res){
				assert.equal(res.status, 200);
				assert.equal(res.body, "successfully updated");
				done();
			});
		});

	});

	suite('GET /api/issues/{project} => Array of objects with issue data', function() {

		test('No filter', function(done) {
			chai.request(server)
			.get('/api/issues/testProject')
			.query({})
			.end(function(err, res){
				assert.equal(res.status, 200);
				assert.isArray(res.body);
				assert.property(res.body[0], 'issue_title');
				assert.property(res.body[0], 'issue_text');
				assert.property(res.body[0], 'created_on');
				assert.property(res.body[0], 'updated_on');
				assert.property(res.body[0], 'created_by');
				assert.property(res.body[0], 'assigned_to');
				assert.property(res.body[0], 'open');
				assert.property(res.body[0], 'status_text');
				assert.property(res.body[0], '_id');
        done();
			});
		});

		test('One filter', function(done) {
      chai.request(server)
			.get('/api/issues/testProject')
			.query({status_text: "assigned"})
			.end(function(err, res){
				assert.equal(res.status, 200);
				assert.isArray(res.body);
				assert.property(res.body[0], 'issue_title');
				assert.property(res.body[0], 'issue_text');
				assert.property(res.body[0], 'created_on');
				assert.property(res.body[0], 'updated_on');
				assert.property(res.body[0], 'created_by');
				assert.property(res.body[0], 'assigned_to');
				assert.property(res.body[0], 'open');
				assert.property(res.body[0], 'status_text');
				assert.property(res.body[0], '_id');
        done();
			});
		});

		test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
      chai.request(server)
			.get('/api/issues/testProject')
			.query({status_text: "hello", open: true})
			.end(function(err, res){
				assert.equal(res.status, 200);
				assert.isArray(res.body);
				assert.property(res.body[0], 'issue_title');
				assert.property(res.body[0], 'issue_text');
				assert.property(res.body[0], 'created_on');
				assert.property(res.body[0], 'updated_on');
				assert.property(res.body[0], 'created_by');
				assert.property(res.body[0], 'assigned_to');
				assert.property(res.body[0], 'open');
				assert.property(res.body[0], 'status_text');
				assert.property(res.body[0], '_id');
        done();
			});
		});

	});

	suite('DELETE /api/issues/{project} => text', function() {

		test('No _id', function(done) {
			chai.request(server)
			.delete('/api/issues/testProject')
			.end(function(err, res){
				assert.equal(res.status, 200);
				assert.equal(res.body, "_id error");
				done();
			});
		});

		test('Valid _id', function(done) {
      chai.request(server)
			.delete('/api/issues/testProject')
      .send({_id: '5bb3e3c4353c4b0c38d46693'})
			.end(function(err, res){
				assert.equal(res.status, 200);
				assert.equal(res.body, "could not delete 5bb3e3c4353c4b0c38d46693");
				done();
			});
		});

	});

});

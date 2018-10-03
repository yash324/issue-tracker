/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var mongoose = require('mongoose');
module.exports = function (app, db) {
	mongoose.connect(process.env.MLAB_URI);
  var issueSchema = new mongoose.Schema({
			issue_title:  { type: String, required: true },
			issue_text:  { type: String, required: true },
			created_by: { type: String, required: true },
			created_on: { type: Date, required: true },
			updated_on: { type: Date, required: true },
			open: { type: Boolean, required: true },
			assigned_to: String,
			status_text: String
		});
	var projectSchema = new mongoose.Schema({
		project_name: {type: String, required: true},
		issues: [issueSchema]
	});

	var Project = mongoose.model('Project', projectSchema);

	
	app.route('/api/issues/:project')
	
	.get(async function (req, res){
		try{
      
      let project = await Project.findOne({project_name: req.params.project});
      project.issues = project.issues.filter((issue, index) => (          
          Object.keys(req.query)
            .every(queryParam => issue[queryParam].toString() === req.query[queryParam])
          )
      );
      res.json(project.issues);
    } catch(e){
      res.status(401).json("project not found");
    }
	})
	
	.post(async (req, res) => {
    try {
      let project = await Project.findOne({project_name: req.params.project});
      if(!project) {
        project = new Project({
          project_name: req.params.project,
          issues: []
        });
        await project.save(); 
      }
      let issueToAdd = project.issues.create({
        issue_title:req.body.issue_title, 
        issue_text: req.body.issue_text ,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || "",
        status_text: req.body.status_text || "",
        created_on: new Date(),
        updated_on: new Date(),
        open: true
      });
      project.issues.push(issueToAdd);
      let updatedProject = await project.save();
      if(updatedProject)
        return res.json(issueToAdd);
    } catch(e) {
      return res.status(500).json("Error - Could not save Issue");
    }
	})
	
	.put(async function (req, res){
		try{
      if(Object.keys(req.body).length === 0){  
        return res.json("no updated field sent");
      }
      let project = await Project.findOne({project_name: req.params.project});
      let issue = project.issues.id(req.body._id);
      
      Object.keys(req.body)
        .forEach(fieldName => (
          (req.body[fieldName] === "") ? delete req.body[fieldName]: null)
      );
      
      issue = issue.set(req.body);
      issue.updated_on = new Date();
      await project.save();
      return res.json("successfully updated"); 
      
    } catch(e) {
      return res.json(`could not update ${req.body._id}`);
    }
    
	})
	
	.delete(async function (req, res){
    if(!req.body._id){
      return res.json("_id error");
    }
		try{
      let project = await Project.findOne({project_name: req.params.project});
      project.issues.id(req.body._id).remove();
      await project.save();
      return res.json(`deleted ${req.body._id}`);
    } catch(e) {
      return res.json(`could not delete ${req.body._id}`);
    }
		
	});
	
};

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/students');
var Schema = mongoose.Schema;

var StudentSchema = new Schema({
	regid: String,
	name: String,
	age: String
});

mongoose.model('Student', StudentSchema);
var Student = mongoose.model('Student');

var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// Routes
app.get('/api/students', function(req, res) {
	Student.find(function(err, docs) {		
		res.send(docs);
	});
});

app.post('/api/students', function(req, res) {
	var student = new Student(req.body);
	student.save(function(err, doc) {
		res.send(doc);
	});
});

app.delete('/api/students/:id', function(req, res) {
	Student.remove({_id: req.params.id}, function(err, doc) {
		res.send({_id: req.params.id});
	});
});

app.put('/api/students/:id', function(req, res) {
	Student.update({_id: req.params.id}, req.body, function(err) {
		res.send({_id: req.params.id});
	});
});

app.listen(3000);
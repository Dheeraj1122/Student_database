Backbone.Model.prototype.idAttribute = '_id';

// Backbone Model
var Student = Backbone.Model.extend({
	defaults: {
		regid: '',
		name: '',
		age: ''
	}
});

// Backbone Collection
var Students = Backbone.Collection.extend({
	url: 'http://localhost:3000/api/students'
});

// instantiate a Collection
var students = new Students();

// Backbone View for Individual Student
var StudentView = Backbone.View.extend({
	model: new Student(),
	tagName: 'tr',
	initialize: function() {
		this.template = _.template($('.students-list-template').html());
	},
	events: {
		'click .edit': 'edit',
		'click .update': 'update',
		'click .cancel': 'cancel',
		'click .delete': 'delete'
	},
	edit: function() {
		$('.edit').parent().hide();
		$('.delete').parent().hide();
		this.$('.update').parent().show();
		this.$('.cancel').parent().show();

		var regid = this.$('.regid').html();
		var name = this.$('.name').html();
		var age = this.$('.age').html();

		this.$('.regid').html('<input type="text" class="form-control regid-update" value="' + regid + '">');
		this.$('.name').html('<input type="text" class="form-control name-update" value="' + name + '">');
		this.$('.age').html('<input type="text" class="form-control age-update" value="' + age + '">');
	},
	update: function() {
		this.model.set('regid', $('.regid-update').val());
		this.model.set('name', $('.name-update').val());
		this.model.set('age', $('.age-update').val());

		this.model.save(null, {
			success: function(response) {
				toastr.success('Record has been updated!', 'Success');
				studentsView.render();
			},
			error: function(err) {
				toastr.danger('Some error occurred! :(', 'Error');
				studentsView.render();
			}
		});
	},
	cancel: function() {
		studentsView.render();
	},
	delete: function() {
		this.model.destroy({
			success: function(response) {
				toastr.success('Record successfully deleted!', 'Success');
			},
			error: function(err) {
				toastr.danger('Some error occurred! :(', 'Error');
			}
		});
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

// Backbone View for all students
var StudentsView = Backbone.View.extend({
	model: students,
	el: $('.students-list'),
	initialize: function() {
		var self = this;
		this.model.on('add', this.render, this);
		this.model.on('change', function() {
			setTimeout(function() {
				self.render();
			}, 30);
		},this);
		this.model.on('remove', this.render, this);

		this.model.fetch({
			success: function(response) {
				toastr.info('How you doing?', 'Hello there!');
			},
			error: function() {
				toastr.danger('Some error occurred! :(', 'Error');
			}
		});
	},
	render: function() {
		var self = this;
		this.$el.html('');
		_.each(this.model.toArray(), function(student) {
			self.$el.append((new StudentView({model: student})).render().$el);
		});
		return this;
	}
});

// instantiate a Collection View
var studentsView = new StudentsView();

$(document).ready(function() {

	toastr.options.timeOut = 1200;
	toastr.options.showMethod = 'slideDown';
	toastr.options.hideMethod = 'slideUp';
	toastr.options.closeMethod = 'slideUp';
	toastr.options.closeButton = true;

	$('.add-record').on('click', function() {

		var error = 0;
		$('input').each(function() {				
			if(!$.trim($(this).val())) {
	          toastr.warning('Field can\'t be empty!', 'Warning');
	          error = 1;
	          return false;
	   		}
	   	});

	   	if(error == 1) return 0;

		var student = new Student({
			regid: $('.regid-input').val(),
			name: $('.name-input').val(),
			age: $('.age-input').val()
		});

		students.add(student);
		$('.regid-input').val('');
		$('.name-input').val('');
		$('.age-input').val('');

		student.save(null, {
			success: function(response) {
				toastr.success('Record saved successfully!', 'Success');
			},
			error: function() {
				toastr.danger('Some error occurred! :(', 'Error');
			}
		});
	});
});
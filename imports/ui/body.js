import { Tasks } from '../api/tasks';

import './task.js';
import './body.html';

window.Tasks = Tasks;

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});

Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // Otherwise, return all of the tasks
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
  afMethod() {
    return Session.get('taskToEdit') ? 'method-update' : 'method';
  },
  afMeteorMethod() {
    return Session.get('taskToEdit') ? 'tasks.update' : 'tasks.insert';
  },
  afButtonContent() {
    return Session.get('taskToEdit') ? 'Save' : 'Add';
  },
  afButtonClasses() {
    return Session.get('taskToEdit') ? 'btn btn-success' : 'btn btn-primary';
  },
  afTaskDoc() {
    return Session.get('taskToEdit');
  },
  tasksFormTitle() {
    const taskToEdit = Session.get('taskToEdit');
    return taskToEdit ? 'Edit task: ' + taskToEdit.title : 'Add new task';
  }
});

Template.body.events({
  'click #addTaskButton'() {
    AutoForm.resetForm('taskForm');

    Session.set('taskToEdit', null);

    $('#tasksFormModal').modal('show');
  },
  'change .hide-completed input'(event, templateInstance) {
    templateInstance.state.set('hideCompleted', event.target.checked);
  }
});

AutoForm.hooks({
  taskForm: {
    onSuccess: () => {
      $('#tasksFormModal').modal('hide');
    }
  }
});

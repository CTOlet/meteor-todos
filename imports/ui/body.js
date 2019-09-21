import { Tasks } from '../api/tasks';

import './task.js';
import './body.html';

window.Tasks = Tasks;

Template.body.onCreated(function bodyOnCreated() {
  Meteor.subscribe('tasks');
});

Template.body.helpers({
  tasks() {
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

Tracker.autorun(() => {
  if (Session.get('showTasksForm')) {
    const timerId = setInterval(() => {
      // hack: wait while document is not ready
      if (document.readyState !== 'complete') return;
      clearInterval(timerId);

      // show modal
      AutoForm.resetForm('taskForm');

      $('#tasksFormModal').modal('show');
    }, 100);
  } else {
    $('#tasksFormModal').modal('hide');
  }
});

Template.body.events({
  'click #addTaskButton'() {
    FlowRouter.go('tasks.create');
  },
  'hidden.bs.modal #tasksFormModal'() {
    FlowRouter.go('tasks.index');
  }
});

AutoForm.hooks({
  taskForm: {
    onSuccess: () => {
      FlowRouter.go('tasks.index');
    }
  }
});

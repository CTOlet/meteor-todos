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
    return Session.get('taskIdToEdit') ? 'method-update' : 'method';
  },
  afMeteorMethod() {
    return Session.get('taskIdToEdit') ? 'tasks.update' : 'tasks.insert';
  },
  afButtonContent() {
    return Session.get('taskIdToEdit') ? 'Save' : 'Add';
  },
  afButtonClasses() {
    return Session.get('taskIdToEdit') ? 'btn btn-success' : 'btn btn-primary';
  },
  afTaskDoc() {
    return Tasks.findOne({ _id: Session.get('taskIdToEdit') });
  },
  tasksFormTitle() {
    const taskToEdit = Tasks.findOne({ _id: Session.get('taskIdToEdit') });
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

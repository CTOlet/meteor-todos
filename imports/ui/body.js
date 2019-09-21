import { PUBLICATION_TASKS, Tasks, METHOD_TASKS_INSERT, METHOD_TASKS_UPDATE } from '../api/tasks';
import { ROUTE_TASKS_CREATE, ROUTE_TASKS_INDEX } from '../../client/routes';

import './task.js';
import './body.html';

window.Tasks = Tasks;

export const SESSION_SHOW_TASKS_FORM = 'showTasksForm';
export const SESSION_TASK_ID_TO_EDIT = 'taskIdToEdit';

Template.body.onCreated(function bodyOnCreated() {
  Meteor.subscribe(PUBLICATION_TASKS);
});

Template.body.helpers({
  tasks() {
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  incompleteCount() {
    return Tasks.find({ checked: { $ne: true } }).count();
  },
  afMethod() {
    return Session.get(SESSION_TASK_ID_TO_EDIT) ? 'method-update' : 'method';
  },
  afMeteorMethod() {
    return Session.get(SESSION_TASK_ID_TO_EDIT) ? METHOD_TASKS_UPDATE : METHOD_TASKS_INSERT;
  },
  afButtonContent() {
    return Session.get(SESSION_TASK_ID_TO_EDIT) ? 'Save' : 'Add';
  },
  afButtonClasses() {
    return Session.get(SESSION_TASK_ID_TO_EDIT) ? 'btn btn-success' : 'btn btn-primary';
  },
  afTaskDoc() {
    return Tasks.findOne({ _id: Session.get(SESSION_TASK_ID_TO_EDIT) });
  },
  tasksFormTitle() {
    const taskToEdit = Tasks.findOne({ _id: Session.get(SESSION_TASK_ID_TO_EDIT) });
    return taskToEdit ? 'Edit task: ' + taskToEdit.title : 'Add new task';
  }
});

Tracker.autorun(() => {
  if (Session.get(SESSION_SHOW_TASKS_FORM)) {
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
    FlowRouter.go(ROUTE_TASKS_CREATE);
  },
  'hidden.bs.modal #tasksFormModal'() {
    FlowRouter.go(ROUTE_TASKS_INDEX);
  }
});

AutoForm.hooks({
  taskForm: {
    onSuccess: () => {
      FlowRouter.go(ROUTE_TASKS_INDEX);
    }
  }
});

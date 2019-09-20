import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

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
  }
});

Template.body.events({
  'click #addTaskButton'() {
    $('#tasksFormModal').modal('show');
  },
  'submit #insertTaskForm'(event) {
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const newTask = {
      title: target.title.value,
      description: target.description.value
    };

    // Insert a task into the collection
    Meteor.call('tasks.insert', newTask);

    // Clear form
    target.title.value = '';
    target.description.value = '';

    $('#tasksFormModal').modal('hide');
  },
  'change .hide-completed input'(event, templateInstance) {
    templateInstance.state.set('hideCompleted', event.target.checked);
  }
});

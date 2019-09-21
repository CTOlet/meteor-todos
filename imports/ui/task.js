import { METHOD_TASKS_REMOVE, METHOD_TASKS_SET_CHECKED } from '../api/tasks';
import { ROUTE_TASKS_UPDATE } from '../../client/routes';

import './task.html';

Template.task.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Meteor.call(METHOD_TASKS_SET_CHECKED, this._id, !this.checked);
  },
  'click .edit'() {
    FlowRouter.go(ROUTE_TASKS_UPDATE, { taskId: this._id });
  },
  'click .remove'() {
    Meteor.call(METHOD_TASKS_REMOVE, this._id);
  }
});

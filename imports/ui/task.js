import './task.html';

Template.task.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this._id, !this.checked);
  },
  'click .edit'() {
    FlowRouter.go('tasks.update', { taskId: this._id });
  },
  'click .remove'() {
    Meteor.call('tasks.remove', this._id);
  }
});

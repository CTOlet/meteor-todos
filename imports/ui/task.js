import './task.html';

Template.task.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this._id, !this.checked);
  },
  'click .edit'() {
    AutoForm.resetForm('taskForm');

    Session.set('taskToEdit', this);

    $('#tasksFormModal').modal('show');
  },
  'click .remove'() {
    Meteor.call('tasks.remove', this._id);
  }
});

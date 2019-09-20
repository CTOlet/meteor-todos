import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import SimpleSchema from 'simpl-schema';

export const Tasks = new Mongo.Collection('tasks');

Tasks.attachSchema(new SimpleSchema({
  title: {
    type: String,
    max: 255
  },
  checked: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    },
    denyUpdate: true
  },
  updatedAt: {
    type: Date,
    autoValue: function () {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  },
}));

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find();
  });
}

Meteor.methods({
  'tasks.insert'(title) {
    Tasks.insert({title});
  },
  'tasks.remove'(taskId) {
    check(taskId, String);

    Tasks.remove(taskId);
  },
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);

    Tasks.update(taskId, {
      $set: {
        checked: setChecked,
        updatedAt: new Date()
      }
    });
  },
});
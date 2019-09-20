import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform']);

export const Tasks = new Mongo.Collection('tasks');

Tasks.attachSchema(
  new SimpleSchema({
    title: {
      type: String,
      required: true,
      max: 250
    },
    description: {
      type: String,
      optional: true,
      max: 2000,
      autoform: {
        rows: 5
      }
    },
    checked: {
      type: Boolean,
      autoValue: function() {
        if (this.isInsert) {
          return false;
        }
      }
    },
    createdAt: {
      type: Date,
      autoValue: function() {
        if (this.isInsert) {
          return new Date();
        } else if (this.isUpsert) {
          return { $setOnInsert: new Date() };
        } else {
          this.unset(); // Prevent user from supplying their own value
        }
      },
      denyUpdate: true
    },
    updatedAt: {
      type: Date,
      autoValue: function() {
        return new Date();
      },
      optional: true
    }
  })
);

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find();
  });
}

Meteor.methods({
  'tasks.insert'(newTask) {
    check(newTask, Object);

    Tasks.insert(newTask);
  },
  'tasks.remove'(taskId) {
    check(taskId, String);

    Tasks.remove(taskId);
  },
  'tasks.setChecked'(taskId, checked) {
    check(taskId, String);
    check(checked, Boolean);

    Tasks.update(taskId, { $set: { checked } });
  }
});

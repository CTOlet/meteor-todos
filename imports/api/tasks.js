import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform']);

export const Tasks = new Mongo.Collection('tasks');

export const METHOD_TASKS_INSERT = 'tasks.insert';
export const METHOD_TASKS_UPDATE = 'tasks.update';
export const METHOD_TASKS_REMOVE = 'tasks.remove';
export const METHOD_TASKS_SET_CHECKED = 'tasks.setChecked';
export const PUBLICATION_TASKS = 'tasks';

Tasks.attachSchema(
  new SimpleSchema(
    {
      title: {
        type: String,
        unique: true,
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
          if (this.isUpdate) {
            return new Date();
          } else {
            this.unset(); // Prevent user from supplying their own value
          }
        },
        optional: true
      }
    },
    { tracker: Tracker }
  )
);

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish(PUBLICATION_TASKS, function tasksPublication() {
    return Tasks.find();
  });
}

Meteor.methods({
  [METHOD_TASKS_INSERT](newTask) {
    Tasks.insert(newTask);
  },
  [METHOD_TASKS_UPDATE]({ _id, modifier }) {
    Tasks.update(_id, modifier);
  },
  [METHOD_TASKS_REMOVE](taskId) {
    check(taskId, String);

    Tasks.remove(taskId);
  },
  [METHOD_TASKS_SET_CHECKED](taskId, checked) {
    check(taskId, String);

    Tasks.update(taskId, { $set: { checked } });
  }
});

import '../imports/ui/body.js';

FlowRouter.route('/', {
  name: 'tasks.index',
  action: () => {
    Session.set('showTasksForm', false);
  }
});

FlowRouter.route('/task/new', {
  name: 'tasks.create',
  action: () => {
    Session.set('taskToEdit', null);
    Session.set('showTasksForm', true);
  }
});

FlowRouter.route('/task/edit/:taskId', {
  name: 'tasks.update',
  action: () => {
    Session.set('showTasksForm', true);
  }
});

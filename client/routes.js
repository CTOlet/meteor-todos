import { SESSION_SHOW_TASKS_FORM, SESSION_TASK_ID_TO_EDIT } from '../imports/ui/body';

export const ROUTE_TASKS_INDEX = 'tasks.index';
export const ROUTE_TASKS_CREATE = 'tasks.create';
export const ROUTE_TASKS_UPDATE = 'tasks.update';

FlowRouter.route('/', {
  name: ROUTE_TASKS_INDEX,
  action: () => {
    Session.set(SESSION_SHOW_TASKS_FORM, false);
  }
});

FlowRouter.route('/task/new', {
  name: ROUTE_TASKS_CREATE,
  action: () => {
    Session.set(SESSION_TASK_ID_TO_EDIT, null);
    Session.set(SESSION_SHOW_TASKS_FORM, true);
  }
});

FlowRouter.route('/task/edit/:taskId', {
  name: ROUTE_TASKS_UPDATE,
  action: params => {
    Session.set(SESSION_TASK_ID_TO_EDIT, params.taskId);
    Session.set(SESSION_SHOW_TASKS_FORM, true);
  }
});

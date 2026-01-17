export const Actions = {
  app_list: "app_list",
  app_view: "app_view",
  app_edit: "app_edit",
  app_create: "app_create",
  app_delete: "app_delete",
  app_member: "app_member",
  flow_list: "flow_list",
  flow_view: "flow_view",
  flow_edit: "flow_edit",
  flow_create: "flow_create",
  flow_delete: "flow_delete",
};

export const SystemRoles = {
  Admin: {
    [Actions.app_list]: 10,
    [Actions.app_view]: 10,
    [Actions.app_edit]: 10,
    [Actions.app_delete]: 10,
    [Actions.app_member]: 10,
    [Actions.flow_list]: 10,
    [Actions.flow_view]: 10,
    [Actions.flow_edit]: 10,
    [Actions.flow_create]: 10,
    [Actions.flow_delete]: 10,
  },
  Guest: {},
};

export const AppRoles = {
  Owner: {
    [Actions.app_view]: 10,
    [Actions.app_edit]: 10,
    [Actions.app_delete]: 10,
    [Actions.app_member]: 10,
    [Actions.flow_list]: 10,
    [Actions.flow_view]: 10,
    [Actions.flow_edit]: 10,
    [Actions.flow_create]: 10,
    [Actions.flow_delete]: 10,
  },
  Admin: {
    [Actions.app_view]: 10,
    [Actions.app_member]: 9,
    [Actions.flow_list]: 10,
    [Actions.flow_view]: 10,
    [Actions.flow_edit]: 10,
    [Actions.flow_create]: 10,
    [Actions.flow_delete]: 10,
  },
  Developer: {
    [Actions.app_view]: 10,
    [Actions.flow_list]: 10,
    [Actions.flow_view]: 10,
    [Actions.flow_edit]: 10,
    [Actions.flow_create]: 10,
    [Actions.flow_delete]: 10,
  },
  Tester: {
    [Actions.app_view]: 10,
    [Actions.flow_list]: 10,
    [Actions.flow_view]: 10,
  },
  Guest: {
    [Actions.app_view]: 10,
    [Actions.flow_list]: 10,
    [Actions.flow_view]: 9,
  },
};

export type SystemRole = keyof typeof SystemRoles;
export type AppRole = keyof typeof AppRoles;

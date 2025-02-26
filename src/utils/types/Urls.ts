export enum AuthUrl {
  Auth = "/auth",
  REGISTER = "/register",
  LOGIN = "/login",
}

export enum TaskUrl {
  CREATE = "/tasks",
  GET_BY_ID = "/tasks/:id",
  GET_USER_TASKS = "/users/:userId/tasks",
  UPDATE = "/tasks/:id",
  DELETE = "/tasks/:id",
}

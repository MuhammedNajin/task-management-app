import express, { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { DIContainer } from '../di/container';
import { validateRequest } from '../middleware/requestValidation';
import { 
  taskCreateSchema, 
  taskUpdateSchema, 
  taskIdSchema, 
  userIdSchema 
} from '../utils/validationSchema/Task.schema';
import { TaskUrl } from '../utils/types/Urls';
import { Server } from 'node:http';


const initializeTaskRouter = (httpServer: Server) => {
  const router = express.Router();
  const taskController = new TaskController(
    DIContainer.getInstance(httpServer).get('TaskService')
  );
  
  const validateTaskCreate = validateRequest(taskCreateSchema);
  const validateTaskUpdate = validateRequest(taskUpdateSchema);
  const validateTaskId = validateRequest(taskIdSchema, 'params');
  const validateUserId = validateRequest(userIdSchema, 'params');

  router.use((req, res, next) => {  
    console.log('Task routes', req.url);
    next();
  });
  
  router.post(
    TaskUrl.CREATE,
    validateTaskCreate,
    taskController.create.bind(taskController)
  );
  
  router.get(
    TaskUrl.GET_BY_ID,
    validateTaskId,
    taskController.getById.bind(taskController)
  );
  
  router.get(
    TaskUrl.GET_USER_TASKS,
    validateUserId,
    taskController.getUserTasks.bind(taskController)
  );
  
  router.put(
    TaskUrl.UPDATE,
    validateTaskId,
    validateTaskUpdate,
    taskController.update.bind(taskController)
  );
  
  router.delete(
    TaskUrl.DELETE,
    validateTaskId,
    taskController.delete.bind(taskController)

  );
  
  return router
}




export { initializeTaskRouter }
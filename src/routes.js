import { Router } from 'express';

import StudentController from './app/controller/StudentController';
import UserController from './app/controller/UserController';
import SessionController from './app/controller/SessionController';
import PlansController from './app/controller/PlansController';
import EnrollmentController from './app/controller/EnrollmentController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/plans', PlansController.index);
routes.get('/plans/:id', PlansController.show);

routes.post('/users', UserController.store);
routes.post('/students', StudentController.store);
routes.post('/sessions', SessionController.store);
routes.post('/plans', PlansController.store);
routes.post('/enrollment', EnrollmentController.store);

routes.use(authMiddleware);

routes.put('/users/:id', UserController.update);
routes.put('/students/:id', StudentController.update);
routes.put('/plans/:id', PlansController.update);

routes.delete('/plans/:id', PlansController.delete);
export default routes;

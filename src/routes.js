import { Router } from 'express';

import StudentController from './app/controller/StudentController';
import UserController from './app/controller/UserController';
import SessionController from './app/controller/SessionController';
import PlansController from './app/controller/PlansController';
import EnrollmentController from './app/controller/EnrollmentController';
import CheckinController from './app/controller/CheckinController';
import HelpOrderController from './app/controller/HelpOrderController';
import AnswerController from './app/controller/AnswerController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Route Help Students
routes.get('/students/:student_id/help-orders', HelpOrderController.index);
routes.post('/students/:student_id/help-orders', HelpOrderController.store);

// Route Check-in Students
routes.post('/students/:student_id/checkins', CheckinController.store);
routes.get('/students/:student_id/checkins', CheckinController.index);

// Route Session ADM
routes.post('/sessions', SessionController.store);

// Route Authentication
routes.use(authMiddleware);

// Route Answer
routes.get('/help-order/answer/notrespost', AnswerController.index);
routes.post('/help-order/:help_order_id/answer', AnswerController.store);
routes.get('/help-order/answer', AnswerController.show);

// Route Plans
routes.get('/plans', PlansController.index);
routes.get('/plans/:id', PlansController.show);
routes.post('/plans', PlansController.store);
routes.put('/plans/:id', PlansController.update);
routes.delete('/plans/:id', PlansController.delete);

// Route Enrollment
routes.get('/enrollment', EnrollmentController.index);
routes.get('/enrollment/:id', EnrollmentController.show);
routes.post('/enrollment', EnrollmentController.store);
routes.put('/enrollment/:id', EnrollmentController.update);
routes.delete('/enrollment/:id', EnrollmentController.delete);

// Route Users
routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.show);
routes.post('/users', UserController.store);
routes.put('/users/:id', UserController.update);

// Route Students
routes.get('/students', StudentController.index);
routes.get('/students/:id', StudentController.show);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

export default routes;

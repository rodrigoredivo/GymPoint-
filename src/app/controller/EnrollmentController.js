import * as Yup from 'yup';
import { addMonths, startOfDay, parseISO, isBefore } from 'date-fns';
import Student from '../models/student';
import Plan from '../models/plan';
import Enrollment from '../models/enrollment';

import WelcomeMail from '../jobs/WelcomeMail';
import Queue from '../../lib/Queue';

class EnrollmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const enrollment = await Enrollment.findAll({
      order: ['start_date'],
      limit: 10,
      offset: (page - 1) * 10,
    });

    return res.json(enrollment);
  }

  async show(req, res) {
    const { id } = req.params;

    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(400).json({ Error: 'Then enrollment was not found' });
    }

    return res.json(enrollment);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { plan_id, start_date, student_id } = req.body;

    const plan = await Plan.findOne({
      where: {
        id: plan_id,
      },
    });

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const planForAnyUserExist = await Enrollment.findOne({
      where: {
        student_id,
      },
    });

    if (planForAnyUserExist) {
      return res.status(401).json({ error: 'User alredy has enrollment' });
    }
    const price = plan.price * plan.duration;

    const dateFormatted = addMonths(
      startOfDay(parseISO(start_date)),
      plan.duration
    );

    const enrollment = await Enrollment.create({
      start_date,
      end_date: dateFormatted,
      price,
      student_id,
      plan_id,
    });

    await Queue.add(WelcomeMail.key, {
      student,
      enrollment,
      plan,
    });

    return res.json(enrollment);
  }

  async update(req, res) {
    // Validation Schema
    const schema = Yup.object().shape({
      plan_id: Yup.number(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { plan_id, start_date } = req.body;

    // Verify is Enrollment exist.
    const registration = await Enrollment.findByPk(req.params.id);

    if (!registration) {
      return res.status(400).json({ error: 'Enrollment does not exist' });
    }

    // Verify is plan exists
    const plan = await Plan.findOne({
      where: {
        id: plan_id,
      },
    });

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }
    // Calcule plan * duration
    const price = plan.price * plan.duration;
    // Formatted date
    const dateFormatted = addMonths(
      startOfDay(parseISO(start_date)),
      plan.duration
    );
    const startDate = startOfDay(parseISO(start_date));
    const currentDate = startOfDay(new Date());
    // Verify is date Actual ou valid.
    if (isBefore(startDate, currentDate)) {
      return res.status(401).json({ error: 'The date is invalid' });
    }
    // Enrollment Update
    const enrollmentUpdate = await registration.update({
      start_date: startDate,
      end_date: dateFormatted,
      price,
      plan_id,
    });

    return res.json(enrollmentUpdate);
  }

  // Delete/excluse

  async delete(req, res) {
    // Verify plan exist

    const { id } = req.params;

    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(400).json({ Error: 'Then enr was not found' });
    }

    // Delete Plan

    await Enrollment.destroy({
      where: {
        id,
      },
    });
    return res.json({ Message: 'The enrollment has been deleted' });
  }
}

export default new EnrollmentController();

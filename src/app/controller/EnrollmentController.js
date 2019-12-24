import * as Yup from 'yup';
import { addMonths, startOfHour, parseISO } from 'date-fns';
import Student from '../models/student';
import Plan from '../models/plan';
import Enrollment from '../models/enrollment';

class EnrollmentController {
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
      startOfHour(parseISO(start_date)),
      plan.duration
    );

    const enrollment = await Enrollment.create({
      start_date,
      end_date: dateFormatted,
      price,
      student_id,
      plan_id,
    });

    return res.json(enrollment);
  }
}

export default new EnrollmentController();

import { subDays, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/checkin';
import Student from '../models/student';

class CheckinController {
  // Create Check-in
  async store(req, res) {
    // Passing params in url
    const { student_id } = req.params;
    const student = await Student.findByPk(student_id);
    // Checking if the student exists
    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    // Validating if the student checked today and the week.
    const todayDate = Number(new Date());
    const startingDate = Number(subDays(todayDate, 7));
    const weekCheck = await Checkin.findAll({
      where: {
        student_id,
        created_at: {
          [Op.between]: [startOfDay(startingDate), endOfDay(todayDate)],
        },
      },
    });

    // Checking if this week's total check-in allowed.
    if (weekCheck.length >= 5) {
      return res
        .status(401)
        .json({ error: 'No more than 5 checkin per week allowed' });
    }

    // Create check-in
    const checkin = await Checkin.create({ student_id });
    // Return check-in at API-REST.
    return res.json(checkin);
  }

  // List all student check-in
  async index(req, res) {
    // Passing params in url.
    const { student_id } = req.params;
    // Finding all the check-in for the student.
    const checkins = await Checkin.findAll({
      where: { student_id },
      attributes: ['id', 'student_id', 'createdAt'],
      order: ['createdAt'],
    });

    // Counting total student check-in
    const totalOfCheckin = await Checkin.count({
      where: { student_id },
    });

    // Listing all check-ins and total check-ins
    return res.json({ checkins, totalOfCheckin });
  }
}

export default new CheckinController();

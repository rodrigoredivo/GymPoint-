import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/student';

class HelpOrderController {
  /**
   * Create a help order
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Invalid input data' });
    }

    const { student_id } = req.params;
    const { question } = req.body;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res
        .status(401)
        .json({ error: 'Only students can send questions' });
    }

    const Help = await HelpOrder.create({
      student_id,
      question,
    });

    return res.json(Help);
  }

  /**
   * List a specific help order
   */
  async index(req, res) {
    const { student_id } = req.params;

    const helpOrders = await HelpOrder.findAll({
      where: { student_id },
      attributes: [
        'id',
        'student_id',
        'question',
        'createdAt',
        'answer',
        'answer_at',
      ],
      order: ['id'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
      ],
    });

    const totalHelpOrder = await HelpOrder.count({
      where: { student_id },
    });

    return res.json({ helpOrders, totalHelpOrder });
  }
}

export default new HelpOrderController();

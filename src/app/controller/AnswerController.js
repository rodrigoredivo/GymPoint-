import * as Yup from 'yup';
import { Op } from 'sequelize';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/student';
import Queue from '../../lib/Queue';
import AnswerMail from '../jobs/AnswerMail';

class AnswerController {
  // List all not Repost

  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: {
        answer_at: null,
      },
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

    const totalHelpOrderNotRepost = await HelpOrder.count({
      where: { answer_at: null },
    });

    return res.json({ helpOrders, totalHelpOrderNotRepost });
  }

  // List all Repost

  async show(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: {
        answer_at: { [Op.ne]: null },
      },
      attributes: ['id', 'student_id', 'question', 'createdAt', 'answer'],
      order: ['id'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
      ],
    });

    const totalHelpOrderRepost = await HelpOrder.count({
      where: { answer_at: { [Op.ne]: null } },
    });

    return res.json({ helpOrders, totalHelpOrderRepost });
  }

  // Answer a help order

  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Invalid input data' });
    }

    const { help_order_id } = req.params;

    const helpOrder = await HelpOrder.findByPk(help_order_id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!helpOrder) {
      return res.status(400).json({
        error: 'This help order does not exists or has already answered',
      });
    }

    const answered = await helpOrder.update({
      ...HelpOrder,
      answer: req.body.answer,
      answer_at: new Date(),
    });

    await Queue.add(AnswerMail.key, { helpOrder });

    return res.json(answered);
  }
}

export default new AnswerController();

import { format } from 'date-fns';
import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { helpOrder } = data;
    await Mail.sendMail({
      to: `${helpOrder.student.name} <${helpOrder.student.email}>`,
      subject: 'Answer help request',
      template: 'answer',
      context: {
        name: helpOrder.student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
        answer_at: format(new Date(), "'Day' dd 'in' MMMM 'in' yyyy'"),
      },
    });
  }
}
export default new AnswerMail();

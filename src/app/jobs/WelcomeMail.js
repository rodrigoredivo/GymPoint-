import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';

class WelcomeMail {
  get key() {
    return 'WelcomeMail';
  }

  async handle({ data }) {
    const { student, plan, enrollment } = data;

    console.log('start redis');
    // SendMail
    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Welcome to Gympoint!',
      template: 'welcome',
      context: {
        student: student.name,
        price: enrollment.price,
        title: plan.title,
        duration: plan.duration,
        startDate: format(
          parseISO(enrollment.start_date),
          "'Day' dd 'in' MMMM 'in' yyyy'"
        ),
        endDate: format(
          parseISO(enrollment.end_date),
          "'Day' dd 'in' MMMM 'in' yyyy'"
        ),
      },
    });
  }
}

export default new WelcomeMail();

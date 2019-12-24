// Imports
import * as Yup from 'yup';
import Plans from '../models/plan';

class PlansController {
  // List all plans

  async index(req, res) {
    const plans = await Plans.findAll();

    return res.json(plans);
  }

  async show(req, res) {
    const plan = await Plans.findOne();

    return res.json(plan);
  }

  // Create

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .positive()
        .required(),
      price: Yup.number()
        .positive()
        .required(),
    });

    // Validations

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Verify Plans exists

    const planExists = await Plans.findOne({
      where: { title: req.body.title },
    });

    if (planExists) {
      return res.status(400).json({ error: 'Plan already exists.' });
    }

    // Create Plans

    const plans = await Plans.create(req.body);

    return res.json(plans);
  }

  // Update/Edit

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .positive()
        .integer(),
      price: Yup.number().positive(),
    });

    // Validation

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Verify plan exist

    const plan = await Plans.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }

    // Plan update

    const planUpdate = await plan.update(req.body);

    return res.json(planUpdate);
  }

  // Delete/excluse

  async delete(req, res) {
    // Verify plan exist

    const plan = await Plans.findByPk(req.params.id);
    if (!plan) {
      return res.status(400).json({ Error: 'Then plan was not found' });
    }

    // Delete Plan

    plan.destroy();
    return res.json({ Message: 'The plan has been deleted' });
  }
}

export default new PlansController();

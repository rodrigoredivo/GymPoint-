import Sequelize from 'sequelize';

import User from '../app/models/user';
import Student from '../app/models/student';
import Plans from '../app/models/plan';
import Enrollment from '../app/models/enrollment';
import Checkin from '../app/models/checkin';
import HelpOrder from '../app/models/HelpOrder';

import databaseConfig from '../config/database';

const models = [User, Student, Plans, Enrollment, Checkin, HelpOrder];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();

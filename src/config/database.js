module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'Gympoint',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};

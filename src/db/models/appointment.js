'use strict';

module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment',{
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE
  }, {
    timestamps: false,
    paranoid: true,
    underscored: true
  });

  Appointment.associate = (models) => {
    Appointment.belongsTo(models.Doctor, {foreignKey: 'doctor_id', as: "doctor"});
    Appointment.belongsTo(models.Patient, {foreignKey: 'patient_id', as: "patient"});
  }

  return Appointment;
};
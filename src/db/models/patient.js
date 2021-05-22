'use strict';

module.exports = (sequelize, DataTypes) => {
  const Patient = sequelize.define('Patient',{
    firstname: DataTypes.STRING,
    surname: DataTypes.STRING,
    id_document: DataTypes.STRING,
    pathology: DataTypes.STRING
  }, {
    timestamps: false,
    paranoid: true,
    underscored: true
  });

  Patient.associate = (models) => {
    Patient.hasOne(models.Appointment, {foreignKey: "patient_id", as: "appointment"});
  }

  return Patient;
};
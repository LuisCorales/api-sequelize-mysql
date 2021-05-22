'use strict';

module.exports = (sequelize, DataTypes) => {
  const Hospital = sequelize.define('Hospital',{
    name: DataTypes.STRING
  }, {
    timestamps: false,
    paranoid: true,
    underscored: true
  });

  Hospital.associate = (models) => {
    Hospital.hasMany(models.Doctor, {foreignKey: 'hospital_id', as: "doctor"});
  }

  return Hospital;
};
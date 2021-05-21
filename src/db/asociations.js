const Patient = require('../models/patient');
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');
const Appointment = require('../models/appointment');

// Doctor's relations
Hospital.hasMany(Doctor);
Doctor.belongsTo(Hospital);

// Appointment's relations
Patient.hasOne(Appointment);
Appointment.belongsTo(Patient);
Doctor.hasOne(Appointment);
Appointment.belongsTo(Doctor);
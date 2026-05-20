const mongoose = require('mongoose');
const TourScheduleSchema = new mongoose.Schema({
  tour: { type: mongoose.Schema.ObjectId, ref: 'Tour', required: true },
  dayNumber: { type: Number, required: true },
  timeslot: { type: String },
  activityDescription: { type: String, required: true }
});
module.exports = mongoose.model('TourSchedule', TourScheduleSchema);
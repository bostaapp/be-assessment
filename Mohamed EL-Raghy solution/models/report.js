const mongoose = require('mongoose');

//* Report Schema 
const reportSchema = new mongoose.Schema({
  status: { type: String, required: true },
  availability: { type: Number, required: true },
  outages: { type: Number, required: true },
  downtime: { type: Number, required: true },
  uptime: { type: Number, required: true },
  aveResponseTime: { type: Number, required: true },
  history: { type: [], required: true },
  timestamp: { type: Date, required: true, default: new Date() },
  forCheck: { type: mongoose.Types.ObjectId, ref: 'Check' },
});

//* Report model 
const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
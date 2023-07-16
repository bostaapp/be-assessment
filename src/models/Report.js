const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  checkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'URLCheck',
    required: true,
  },
  
  status:{
    type: String,
    enum: ['UP', 'DOWN'],
    required: true,
  },
  availability: {
    type: Number,
    required: true,
  },
  outages: {
    type: Number,
    required: true,
  },
  downtime: {
    type: Number,
    required: true,
  },
  uptime: {
    type: Number,
    required: true,
  },
  responseTime: {
    type: Number,
    required: true,
  },
  history: [{
    timestamp: {
      type: Date,
      required: true,
    },
    responseTime: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  }],

  lastCheckedAt: Date,
  lastStatusChangedAt: Date,
});


module.exports = mongoose.model('Report', reportSchema);
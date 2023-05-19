import mongoose from "mongoose";

// Define the Report schema
const reportSchema = new mongoose.Schema({
    check: { type: mongoose.Schema.Types.ObjectId, ref: 'Check', required: true },
    
    url: { type: String, required: true },
    
    status: { type: String, required: true },
    
    availability: { type: Number, required: true },
    
    outages: { type: Number, required: true },
    
    downtime: { type: Number, required: true },
    
    uptime: { type: Number, required: true },

    averageResponseTime: { type: Number, required: true },

    history: [
      {
        timestamp: { type: Date, required: true },
        logMessage: { type: String, required: true },
      },
    ],

    stats: {
        count: {type: Number, default: 0},
        outagesCount: {type: Number, default: 0},
        avaialbleCount: {type: Number, default: 0},
        responseTimesSum: {type: Number, default: 0}
    },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  });
  
  // Create the Report model
  const Reports = mongoose.model('Report', reportSchema, 'reports');
  
  export default Reports;
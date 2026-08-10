import mongoose from 'mongoose';

const goldRateHistorySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true // Format: YYYY-MM-DD
  },
  rate22K: {
    type: Number,
    required: true
  },
  rate24K: {
    type: Number,
    required: true
  },
  rate18K: {
    type: Number,
    default: 5600
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const GoldRateHistory = mongoose.model('GoldRateHistory', goldRateHistorySchema);
export default GoldRateHistory;

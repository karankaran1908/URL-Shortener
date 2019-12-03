const mongoose = require('mongoose');
const { Schema } = mongoose;
const urlSchema = new Schema(
  {
    originalUrl: String,
    urlCode: { type: String, unique: true },
    shortenedUrl: String,
    callCount: 0,
    lastUsed: Date
  },
  {
    timestamps: true
  }
);
mongoose.model('Url', urlSchema);

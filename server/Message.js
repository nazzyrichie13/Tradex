const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    fileUrl: String,       // URL to file/image
    fileType: String,      // image/jpeg, application/pdf, etc.
    createdAt: { type: Date, default: Date.now },
    isDelivered: { type: Boolean, default: false },
   isRead: { type: Boolean, default: false }

  });
  

module.exports = mongoose.model('Message', messageSchema);

import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ listing: 1 });
reportSchema.index({ reporter: 1 });
reportSchema.index({ status: 1 });

export default mongoose.model('Report', reportSchema);

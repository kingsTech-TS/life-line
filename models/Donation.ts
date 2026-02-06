import mongoose, { Schema, Document } from 'mongoose';

export interface IDonation extends Document {
  donorName: string;
  donorEmail: string;
  amount: number;
  donationType: 'one-time' | 'recurring';
  paymentReference: string;
  status: 'pending' | 'completed' | 'failed';
  projectId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DonationSchema: Schema = new Schema(
  {
    donorName: { type: String, required: true },
    donorEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    donationType: { type: String, enum: ['one-time', 'recurring'], required: true },
    paymentReference: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  },
  { timestamps: true }
);

export default mongoose.models.Donation || mongoose.model<IDonation>('Donation', DonationSchema);

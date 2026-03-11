import mongoose, { Schema, Document } from 'mongoose';

export interface IDonation extends Document {
  donorName: string;
  donorEmail: string;
  amount: number;
  donationType: 'one-time' | 'recurring';
  paymentReference: string;
  status: 'pending' | 'completed' | 'failed';
  isAnonymous: boolean;
  paymentMethod?: string;
  paymentDetails?: any;
  projectId?: mongoose.Types.ObjectId;
  paymentSource?: 'donation' | 'project' | 'shop';
  productName?: string;
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
    isAnonymous: { type: Boolean, default: false },
    paymentMethod: { type: String },
    paymentDetails: { type: Schema.Types.Mixed },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    paymentSource: { type: String, enum: ['donation', 'project', 'shop'], default: 'donation' },
    productName: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Donation || mongoose.model<IDonation>('Donation', DonationSchema);

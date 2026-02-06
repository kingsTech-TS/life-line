import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  country: string;
  image: string;
  impact: string;
  status: 'active' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    goalAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    country: { type: String, required: true },
    image: { type: String, required: true },
    impact: { type: String, required: true },
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

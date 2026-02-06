import mongoose, { Schema, Document } from 'mongoose';

export interface IImpactReport extends Document {
  title: string;
  description: string;
  imageUrl: string;
  year: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ImpactReportSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.ImpactReport || mongoose.model<IImpactReport>('ImpactReport', ImpactReportSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IAmbassador extends Document {
  name: string;
  state: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const AmbassadorSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    state: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Ambassador || mongoose.model<IAmbassador>('Ambassador', AmbassadorSchema);

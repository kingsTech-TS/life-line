import mongoose, { Schema, Document } from 'mongoose';

export interface IDeletedVendor extends Document {
  email: string;
  businessName: string;
  deletedAt: Date;
  reason?: string;
}

const DeletedVendorSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    businessName: { type: String, required: true },
    deletedAt: { type: Date, default: Date.now },
    reason: { type: String, default: 'Deleted by Admin' },
  }
);

export default mongoose.models.DeletedVendor || mongoose.model<IDeletedVendor>('DeletedVendor', DeletedVendorSchema);

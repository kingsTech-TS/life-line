import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  businessName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  commissionRate: number;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema: Schema = new Schema(
  {
    businessName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    commissionRate: { type: Number, default: 15 },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Vendor || mongoose.model<IVendor>('Vendor', VendorSchema);
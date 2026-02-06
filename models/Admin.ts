import mongoose, { Schema, Document } from 'mongoose';
export interface IAdmin extends Document {
  username: string;
  password: string;
  role: 'superadmin' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
}

const AdminSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' },
  },
  { timestamps: true }
);

AdminSchema.methods.comparePassword = async function (password: string) {
  return password === this.password;
};

// Handle model compilation/re-registration in Next.js dev
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Admin;
}

const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
export default Admin;

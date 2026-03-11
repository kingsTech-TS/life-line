import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  cart: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    variants: Record<string, string>;
    quantity: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cart: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        variants: { type: Map, of: String },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

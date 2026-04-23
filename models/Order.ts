import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  items: Array<{
    productId: string;
    vendorId: string;
    name: string;
    price: number;
    quantity: number;
    variants: Record<string, string>;
    image: string;
  }>;
  customerId: string;
  customerName: string;
  customerEmail: string;
  deliveryAddress: string;
  totalAmount: number;
  paymentReference: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    items: [
      {
        productId: { type: String, required: true },
        vendorId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
        variants: { type: Map, of: String },
        image: { type: String },
      },
    ],
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paymentReference: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
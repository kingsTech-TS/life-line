import mongoose, { Schema, Document } from 'mongoose';

export interface IShopItem extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const ShopItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.ShopItem || mongoose.model<IShopItem>('ShopItem', ShopItemSchema);

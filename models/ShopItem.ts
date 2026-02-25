import mongoose, { Schema, Document } from 'mongoose';

export interface IShopItem extends Document {
  name: string;
  description: string;
  price: number;
  image: string; // Maintain for backward compatibility if needed, but we'll prefer images array
  images: string[];
  category: string;
  stock: number;
  variants: {
    type: string; // e.g., "Size", "Color"
    options: string[]; // e.g., ["S", "M", "L"]
  }[];
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ShopItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String }, // Legacy field
    images: [{ type: String }],
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
    variants: [
      {
        type: { type: String },
        options: [{ type: String }],
      },
    ],
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.ShopItem || mongoose.model<IShopItem>('ShopItem', ShopItemSchema);

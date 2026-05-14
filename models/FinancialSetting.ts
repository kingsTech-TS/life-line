import mongoose, { Schema, Document } from 'mongoose';

export interface IFinancialSetting extends Document {
  key: string;
  value: any;
  updatedAt: Date;
}

const FinancialSettingSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.FinancialSetting || mongoose.model<IFinancialSetting>('FinancialSetting', FinancialSettingSchema);

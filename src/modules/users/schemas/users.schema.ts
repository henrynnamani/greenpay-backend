import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User extends Document {
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop()
  password?: string; // optional if using Web3 wallet login

  @Prop({ ref: 'Wallet', type: Types.ObjectId, required: false })
  walletId?: Types.ObjectId;

  @Prop({ default: 0, required: false })
  totalBalance?: number;

  @Prop({ default: 0, required: false })
  totalEmissions: number;

  @Prop({ default: 0, required: false })
  totalOffset: number;

  @Prop({ default: 0, required: false })
  totalSaved: number;

  @Prop({ default: 0 })
  greenPoints: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'userId',
});

UserSchema.virtual('offsets', {
  ref: 'CarbonOffset',
  localField: '_id',
  foreignField: 'userId',
});

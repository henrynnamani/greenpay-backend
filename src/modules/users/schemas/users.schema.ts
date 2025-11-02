import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop()
  password?: string; // optional if using Web3 wallet login

  @Prop({ ref: 'Wallet', type: Types.ObjectId, required: false })
  walletId?: Types.ObjectId;

  @Prop({ default: 5200 })
  totalBalance?: number;

  @Prop({ default: 0 })
  totalEmissions: number;

  @Prop({ default: 0 })
  totalOffset: number;

  @Prop({ default: 0 })
  greenPoints: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

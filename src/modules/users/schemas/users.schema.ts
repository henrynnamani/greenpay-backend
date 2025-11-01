import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop()
  password?: string; // optional if using Web3 wallet login

  @Prop({ unique: true, sparse: true })
  walletAddress?: string; // Celo wallet address

  @Prop({ default: 0 })
  totalEmissions: number; // total kg CO₂ emitted

  @Prop({ default: 0 })
  totalOffset: number; // total kg CO₂ offset

  @Prop({ default: 0 })
  greenPoints: number; // reward points earned

  @Prop({ default: 'user' })
  role: string; // e.g., "user", "admin"

  @Prop({ default: false })
  isVerified: boolean; // email or wallet verification status
}

export const UserSchema = SchemaFactory.createForClass(User);

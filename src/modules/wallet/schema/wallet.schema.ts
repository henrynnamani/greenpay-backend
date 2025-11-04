import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Wallet extends Document {
  @Prop({ ref: 'User', type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ required: false, unique: false })
  address: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  recipient: string;

  @Prop({ required: true })
  merchant: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: String, required: true })
  category: string;

  @Prop()
  estimatedEmission: number;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

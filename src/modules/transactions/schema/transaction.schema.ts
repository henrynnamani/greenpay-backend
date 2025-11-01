import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum CategoryEnum {
  TRANSPORT = 'transport',
  FOOD = 'food',
  ENERGY = 'energy',
  ENTERTAINMENT = 'entertainment',
}

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: String, enum: Object.values(CategoryEnum), required: true })
  category: CategoryEnum;

  @Prop()
  estimatedEmission: number;

  @Prop({ default: false })
  isOffset: boolean;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

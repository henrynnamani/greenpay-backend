import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Saving extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Boolean, default: true, required: false })
  isActive: boolean;

  @Prop({ required: true })
  target: number;

  @Prop({ required: false, default: 0 })
  current: number;

  @Prop({ type: Date, required: true })
  due: Date;
}

export const SavingSchema = SchemaFactory.createForClass(Saving);

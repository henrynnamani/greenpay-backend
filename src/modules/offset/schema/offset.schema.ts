import { CarbonProject } from '@/modules/projects/schema/projects.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Offset extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'CarbonProject', required: true })
  projectId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop()
  currency: string;

  @Prop()
  offsetAmount: number;
}

export const OffsetSchema = SchemaFactory.createForClass(Offset);

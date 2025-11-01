import { CarbonProject } from '@/modules/projects/schema/projects.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Offset extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

//   @Prop({ type: [Types.ObjectId], ref: 'Transaction' })
//   transactions: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'CarbonProject', required: true })
  projectId: CarbonProject;

  @Prop({ required: true })
  txHash: string;

  @Prop({ default: 'pending' })
  status: 'pending' | 'confirmed' | 'failed';
}

export const OffsetSchema = SchemaFactory.createForClass(Offset);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CarbonProject extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  impact: string;

  @Prop({ required: false, default: 0 })
  contributors: number;

  @Prop({ required: false, default: true })
  active: boolean;
}

export const CarbonProjectSchema = SchemaFactory.createForClass(CarbonProject);

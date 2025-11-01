import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CarbonProject extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  pricePerTon: number;

  //   @Prop({ required: true })
  //   imageUrl: string;

  @Prop({ required: false, default: true })
  active: boolean;
}

export const CarbonProjectSchema = SchemaFactory.createForClass(CarbonProject);

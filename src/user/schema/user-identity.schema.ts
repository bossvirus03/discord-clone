import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type IdentityDocument = HydratedDocument<Identity>;

@Schema()
export class Identity {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;
}

export const IdentitySchema = SchemaFactory.createForClass(Identity);

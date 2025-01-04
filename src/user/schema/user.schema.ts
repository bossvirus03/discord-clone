import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from 'lib/shared/enum/user-role.enum';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  phúc;
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  role: Role;

  @Prop()
  identityId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

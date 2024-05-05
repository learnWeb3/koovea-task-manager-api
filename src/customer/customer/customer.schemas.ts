import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { v4 as uuid } from 'uuid';

// CUSTOMER
export type CustomerDocument = HydratedDocument<Customer>;

@Schema({
  timestamps: true,
})
export class Customer {
  @Prop({
    type: mongoose.Schema.Types.String,
    default: function genUUID() {
      return uuid();
    },
  })
  _id: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  authorizationServerUserId: string;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  firstName: string;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  lastName: string;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  email: string;

  @Prop({
    type: mongoose.Schema.Types.String,
  })
  fullName: string;
}

const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.index(
  {
    authorizationServerUserId: 1,
  },
  { unique: true },
);

CustomerSchema.index({
  firstName: 1,
});

CustomerSchema.index({
  lastName: 1,
});

CustomerSchema.index({
  fullName: 1,
});

CustomerSchema.index({
  email: 1,
});

export { CustomerSchema };

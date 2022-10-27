import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Safety
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Safety on the backend
export type Safety = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freet: Types.ObjectId;
  safety: String;
};

export type PopulatedSafety = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freet: Freet;
  safety: String;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Safeties stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const SafetySchema = new Schema<Safety>({
  // The freet
  freet: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  // The safety level
  safety: {
    type: String,
    required: true
  },
});

const SafetyModel = model<Safety>('Safety', SafetySchema);
export default SafetyModel;

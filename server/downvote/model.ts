import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Downvote = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  downvoter: Types.ObjectId;
  freet: Types.ObjectId;
};

export type PopulatedDownvote = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  downvoter: User;
  freet: Freet;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Downvotes stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const DownvoteSchema = new Schema<Downvote>({
  // The downvoter
  downvoter: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The freet being downvoted
  freet: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  }
});

const DownvoteModel = model<Downvote>('Downvote', DownvoteSchema);
export default DownvoteModel;

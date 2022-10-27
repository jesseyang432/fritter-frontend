import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Upvote
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Upvote on the backend
export type Upvote = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  upvoter: Types.ObjectId;
  freet: Types.ObjectId;
};

export type PopulatedUpvote = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  upvoter: User;
  freet: Freet;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Upvotes stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const UpvoteSchema = new Schema<Upvote>({
  // The upvoter
  upvoter: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The freet being upvoted
  freet: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  }
});

const UpvoteModel = model<Upvote>('Upvote', UpvoteSchema);
export default UpvoteModel;

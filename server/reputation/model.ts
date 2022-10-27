import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Community} from '../community/model';

/**
 * This file defines the properties stored in a Reputation
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Reputation on the backend
export type Reputation = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: Types.ObjectId;
  community: Types.ObjectId;
  reputation: Number;
};

export type PopulatedReputation = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: User;
  community: Community;
  reputation: Number;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Reputations stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ReputationSchema = new Schema<Reputation>({
  // The user
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The community
  community: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Community'
  },
  // The reputation score
  reputation: {
    type: Number,
    required: true
  }
});

const ReputationModel = model<Reputation>('Reputation', ReputationSchema);
export default ReputationModel;

import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Community
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Community on the backend
export type Community = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  members: [Types.ObjectId];
  creator: Types.ObjectId;
  dateCreated: Date;
  name: string;
};

export type PopulatedCommunity = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  members: [User];
  creator: User;
  dateCreated: Date;
  name: string;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Communities stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const CommunitySchema = new Schema<Community>({
  // The members
  members: {
    // Use Types.ObjectId outside of the schema
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'User'
  },
  // The creator of the community
  creator: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the community was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The name of the community
  name: {
    type: String,
    required: true
  }
});

const CommunityModel = model<Community>('Community', CommunitySchema);
export default CommunityModel;

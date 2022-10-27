import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Upvote, PopulatedUpvote} from '../upvote/model';

// Update this if you add a property to the Upvote type!
type UpvoteResponse = {
  _id: string;
  upvoter: string;
  freet: string;
};

/**
 * Transform a raw Upvote object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Upvote>} upvote - An upvote
 * @returns {UpvoteResponse} - The upvote object formatted for the frontend
 */
const constructUpvoteResponse = (upvote: HydratedDocument<Upvote>): UpvoteResponse => {
  const upvoteCopy: PopulatedUpvote = {
    ...upvote.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = upvoteCopy.upvoter;
  delete upvoteCopy.upvoter;
  return {
    ...upvoteCopy,
    _id: upvoteCopy._id.toString(),
    upvoter: username,
    freet: upvoteCopy.freet._id.toString()
  };
};

export {
  constructUpvoteResponse
};

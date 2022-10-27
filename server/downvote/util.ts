import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Downvote, PopulatedDownvote} from '../downvote/model';

// Update this if you add a property to the Downvote type!
type DownvoteResponse = {
  _id: string;
  downvoter: string;
  freet: string;
};

/**
 * Transform a raw Downvote object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Downvote>} downvote - A downvote
 * @returns {DownvoteResponse} - The upvote object formatted for the frontend
 */
const constructDownvoteResponse = (downvote: HydratedDocument<Downvote>): DownvoteResponse => {
  const downvoteCopy: PopulatedDownvote = {
    ...downvote.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = downvoteCopy.downvoter;
  delete downvoteCopy.downvoter;
  return {
    ...downvoteCopy,
    _id: downvoteCopy._id.toString(),
    downvoter: username,
    freet: downvoteCopy.freet._id.toString()
  };
};

export {
  constructDownvoteResponse
};

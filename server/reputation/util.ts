import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Reputation, PopulatedReputation} from '../reputation/model';

// Update this if you add a property to the Reputation type!
type ReputationResponse = {
  _id: string;
  user: string;
  community: string;
  reputation: Number;
};

/**
 * Transform a raw Reputation object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Reputation>} reputation - A reputation
 * @returns {ReputationResponse} - The reputation object formatted for the frontend
 */
const constructReputationResponse = (reputation: HydratedDocument<Reputation>): ReputationResponse => {
  const reputationCopy: PopulatedReputation = {
    ...reputation.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = reputationCopy.user;
  const {name} = reputationCopy.community;
  delete reputationCopy.user;
  delete reputationCopy.community;
  return {
    ...reputationCopy,
    _id: reputationCopy._id.toString(),
    user: username,
    community: name,
    reputation: reputationCopy.reputation
  };
};

export {
  constructReputationResponse
};

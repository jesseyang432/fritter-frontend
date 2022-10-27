import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Community, PopulatedCommunity} from '../community/model';

// Update this if you add a property to the Community type!
type CommunityResponse = {
  _id: string;
  members: string[];
  creator: string;
  dateCreated: string;
  name: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Community object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Community>} community - A community
 * @returns {CommunityResponse} - The community object formatted for the frontend
 */
const constructCommunityResponse = (community: HydratedDocument<Community>): CommunityResponse => {
  const communityCopy: PopulatedCommunity = {
    ...community.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = communityCopy.creator;
  const members = [];
  for (const user of communityCopy.members) {
    members.push(user.username);
  }
  delete communityCopy.creator;
  delete communityCopy.members;
  return {
    ...communityCopy,
    members: members,
    _id: communityCopy._id.toString(),
    creator: username,
    dateCreated: formatDate(community.dateCreated)
  };
};

export {
  constructCommunityResponse
};

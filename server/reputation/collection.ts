import type {HydratedDocument, Types} from 'mongoose';
import type {Reputation} from './model';
import ReputationModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';
import CommunityCollection from '../community/collection';

/**
 * This files contains a class that has the functionality to explore reputation
 * stored in MongoDB.
 * Feel free to add additional operations in this file.
 */
class ReputationCollection {
  /**
   * Find a reputation by the names of the user and community
   * 
   * @param communityName - The name of the community
   * @param username - The name of the user
   * @return {Promise<HydratedDocument<Reputation>>}
   */
  static async findOneByNames(communityName: string, username: string): Promise<HydratedDocument<Reputation>> {
    const community = await CommunityCollection.findOneByName(communityName);
    const user = await UserCollection.findOneByUsername(username);

    return ReputationCollection.findOneByIds(community._id, user._id);
  }

  /**
   * Find a reputation by the ids of the user and community
   * 
   * @param communityId - The ID of the community
   * @param userId - The ID of the user
   * @return {Promise<HydratedDocument<Reputation>>}
   */
  static async findOneByIds(communityId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Reputation>> {
    await ReputationCollection.addOne(communityId, userId);
    return ReputationModel.findOne({user: userId, community: communityId}).populate('user community');
  }

  /**
   * Initializes a 0-value reputation of user and community (if none currently exists)
   * 
   * @param communityId - The ID of the community
   * @param userId - The ID of the user
   * @return {Promise<void>}
   */
  static async addOne(communityId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<void> {
    const currentReputation = await ReputationModel.findOne({user: userId, community: communityId});
    if (!currentReputation) {
      const reputation = new ReputationModel({
        user: userId,
        community: communityId,
        reputation: 0
      });

      await reputation.save();
    }
  }

  /**
   * Attempt to increase reputation of creator/community of given freet by specified delta
   * 
   * @param freetId - The ID of the freet being affected
   * @param delta - The change to the reputation value
   * @return {Promise<void>}
   */
  static async updateByDelta(freetId: Types.ObjectId | string, delta: number): Promise<void> {
    const freet = await FreetCollection.findOne(freetId);
    const authorId = freet.authorId;
    const communityId = freet.community;
    if (communityId) {
      const reputation = await ReputationCollection.findOneByIds(communityId, authorId);
      reputation.reputation = (reputation.reputation as number) + delta;
      await reputation.save();
    }
  }


}

export default ReputationCollection;

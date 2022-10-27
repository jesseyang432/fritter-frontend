import type {HydratedDocument, Types} from 'mongoose';
import type {Community} from './model';
import CommunityModel from './model';
import UserCollection from '../user/collection';
var mongoose = require('mongoose');

/**
 * This files contains a class that has the functionality to explore communities
 * stored in MongoDB, including adding, finding, updating, and deleting communities.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Community> is the output of the FreetModel() constructor,
 * and contains all the information in Community. https://mongoosejs.com/docs/typescript.html
 */
class CommunityCollection {
  /**
   * Add a community to the collection
   *
   * @param {string} creatorId - The id of the creator of the community
   * @param {string} name - The name of the community
   * @return {Promise<HydratedDocument<Community>>} - The newly created community
   */
  static async addOne(creatorId: Types.ObjectId | string, name: string): Promise<HydratedDocument<Community>> {
    const date = new Date();
    const community = new CommunityModel({
      members: [creatorId],
      creator: creatorId,
      dateCreated: date,
      name
    });
    await community.save(); // Saves freet to MongoDB
    const user = await UserCollection.findOneByUserId(creatorId);
    user.communities.push(mongoose.Types.ObjectId(community._id));
    await user.save();
    return community.populate('members creator');
  }

  /**
   * Find a community by communityId
   *
   * @param {string} communityId - The id of the community to find
   * @return {Promise<HydratedDocument<CommunityId>> | Promise<null> } - The community with the given communityId, if any
   */
  static async findOneByCommunityId(communityId: Types.ObjectId | string): Promise<HydratedDocument<Community>> {
    return CommunityModel.findOne({_id: communityId}).populate('members creator');
  }

  /**
   * Find a community by name (case insensitive).
   *
   * @param {string} name - The name of the community to find
   * @return {Promise<HydratedDocument<Community>> | Promise<null>} - The community with the given name, if any
   */
  static async findOneByName(name: string): Promise<HydratedDocument<Community>> {
    return CommunityModel.findOne({name: new RegExp(`^${name.trim()}$`, 'i')});
  }

  /**
   * Get all the communities in the database
   *
   * @return {Promise<HydratedDocument<Community>[]>} - An array of all of the communities
   */
  static async findAll(): Promise<Array<HydratedDocument<Community>>> {
    // Retrieves communities and sorts them from most to least recent created
    return CommunityModel.find({}).sort({dateCreated: -1}).populate('members creator');
  }

  // /**
  //  * Get all the communities of a given username
  //  * 
  //  * @param userId - The id of the user to find communities for
  //  * @return {Promise<HydratedDocument<Community>[]>} - An array of all of the communities of the user
  //  */
  // static async findAllByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Community>>> {
  //   const user = await UserCollection.findOneByUserId(userId);
  //   return CommunityModel.find({})
  //   return await user.populate('communities').communities;
  //   return user.communities.map((communityId) => CommunityModel.findOne({_id: communityId}));
  // }

  /**
   * Add user to a community
   * 
   * @param userId - the id of the user to add
   * @param communityId - the id of the community to add the user to
   * @return {Promise<HydratedDocument<Community>>} - The community the user was added to
   */
  static async addUserIdToCommunity(userId: Types.ObjectId | string, communityId: Types.ObjectId | string): Promise<HydratedDocument<Community>> {
    const community = await CommunityModel.findOne({_id: communityId});
    community.members.push(mongoose.Types.ObjectId(userId));
    await community.save();
    const user = await UserCollection.findOneByUserId(userId);
    user.communities.push(mongoose.Types.ObjectId(communityId));
    await user.save();
    return community.populate('members creator');
  }

  /**
   * Remove user from a community
   * 
   * @param userId - the id of the user to remove
   * @param communityId - the id of the community to remove the user from
   * @return {Promise<HydratedDocument<Community>>} - The community the user was removed from
   */
   static async removeUserIdFromCommunity(userId: Types.ObjectId | string, communityId: Types.ObjectId | string): Promise<HydratedDocument<Community>> {
    const community = await CommunityModel.findOne({_id: communityId});
    const userIndex = community.members.indexOf(mongoose.Types.ObjectId(userId));
    community.members.splice(userIndex, 1);
    await community.save();
    const user = await UserCollection.findOneByUserId(userId);
    const communityIndex = user.communities.indexOf(mongoose.Types.ObjectId(communityId));
    user.communities.splice(communityIndex, 1);
    await user.save();
    return community.populate('members creator');
  }

  // /**
  //  * Delete a community from the collection.
  //  *
  //  * @param {string} communityId - The communityId of community to delete
  //  * @return {Promise<Boolean>} - true if the community has been deleted, false otherwise
  //  */
  //  static async deleteOne(communityId: Types.ObjectId | string): Promise<boolean> {
  //   const community = await CommunityModel.deleteOne({_id: communityId});
  //   return community !== null;
  // }
}

export default CommunityCollection;

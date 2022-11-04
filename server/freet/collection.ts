import type {HydratedDocument, Types} from 'mongoose';
import type {Freet} from './model';
import FreetModel from './model';
import UserCollection from '../user/collection';
import CommunityCollection from '../community/collection';
import SafetyCollection from '../safety/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FreetCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @param {string} communityName - Name of community freet will be posted in (empty string if none)
   * @param {string} parentId - The id of the potential parent freet
   * @param {string} safetyLevel - The level of safety of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
   static async addOne(authorId: Types.ObjectId | string, content: string, communityName: string, parentId: Types.ObjectId | string, safetyLevel: string): Promise<HydratedDocument<Freet>> {
    const date = new Date();
    const community = await CommunityCollection.findOneByName(communityName);
    let freet;
    if (community) {
      if (parentId) {
        freet = new FreetModel({
          authorId,
          dateCreated: date,
          content,
          dateModified: date,
          community: community._id,
          parent: parentId
        });
      } else {
        freet = new FreetModel({
          authorId,
          dateCreated: date,
          content,
          dateModified: date,
          community: community._id,
        });
      }
    } else {
      if (parentId) {
        freet = new FreetModel({
          authorId,
          dateCreated: date,
          content,
          dateModified: date,
          parent: parentId
        });
      } else {
        freet = new FreetModel({
          authorId,
          dateCreated: date,
          content,
          dateModified: date
        });
      }
    }
    await freet.save(); // Saves freet to MongoDB
    await SafetyCollection.addOne(freet._id, safetyLevel);
    return freet.populate('authorId community');
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    return FreetModel.findOne({_id: freetId}).populate('authorId community');
  }

  /**
   * Get all the freets in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Freet>>> {
    // Retrieves freets and sorts them from most to least recent
    return FreetModel.find({}).sort({dateModified: -1}).populate('authorId community');
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Freet>>> {
    const author = await UserCollection.findOneByUsername(username);
    return FreetModel.find({authorId: author._id}).sort({dateModified: -1}).populate('authorId community');
  }

  static async findAllByCommunityName(communityName: string): Promise<Array<HydratedDocument<Freet>>> {
    const community = await CommunityCollection.findOneByName(communityName);
    return FreetModel.find({community: community._id}).sort({dateModified: -1}).populate('authorId community');
  }

  /**
   * Update a freet with the new content
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateOne(freetId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetModel.findOne({_id: freetId});
    freet.content = content;
    freet.dateModified = new Date();
    await freet.save();
    return freet.populate('authorId community');
  }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const freet = await FreetModel.deleteOne({_id: freetId});
    return freet !== null;
  }

  /**
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await FreetModel.deleteMany({authorId});
  }
}

export default FreetCollection;

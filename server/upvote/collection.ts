import type {HydratedDocument, Types} from 'mongoose';
import type {Upvote} from './model';
import UpvoteModel from './model';
import DownvoteCollection from '../downvote/collection';
import ReputationCollection from '../reputation/collection';

/**
 * This files contains a class that has the functionality to explore upvote
 * stored in MongoDB.
 * Feel free to add additional operations in this file.
 */
class UpvoteCollection {
  /**
   * Add an upvote to the collection (removing potential downvote on same freet)
   *
   * @param {string} upovterId - The id of the user upvoting
   * @param {string} freetId - The id of the freet
   * @return {Promise<HydratedDocument<Upvote>>} - The newly created upvote
   */
  static async addOne(upvoterId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Upvote>> {
    await DownvoteCollection.deleteOne(upvoterId, freetId);
    
    const upvote = new UpvoteModel({
      upvoter: upvoterId,
      freet: freetId
    });

    // Synchronously try to update reputation
    await ReputationCollection.updateByDelta(freetId, 1);
 
    await upvote.save(); // Saves upvote to MongoDB
    return upvote.populate('upvoter');
  }

  /**
   * Get all the upvotes of a given freet
   *
   * @param {string} freetId - The id of the freet
   * @return {Promise<HydratedDocument<Upvote>[]>} - An array of all of the upvotes
   */
  static async findAllByFreet(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Upvote>>> {
    return UpvoteModel.find({freet: freetId}).populate('upvoter');
  }

  /**
   * Gets an upvote from the upvoter and freet
   * 
   * @param userId - ID of the upvoter
   * @param freetId - ID of the freet
   * @returns {Promise<HydratedDocument<Upvote>>} - Upvote object
   */
  static async findOneByUserAndFreet(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Upvote>> {
    return UpvoteModel.findOne({upvoter: userId, freet: freetId});
  }

  /**
   * Delete an upvote with freet `freetId` and upvoter `upvoterId`.
   *
   * @param {string} upvoterId - The id of the user who upvoted
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(upvoterId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<boolean> {
    const exists = await UpvoteModel.findOne({upvoter: upvoterId, freet: freetId});
    const upvote = await UpvoteModel.deleteOne({upvoter: upvoterId, freet: freetId});
    if (exists && upvote !== null) {
      // Synchronously try to update reputation
      await ReputationCollection.updateByDelta(freetId, -1);
    }
    return upvote !== null;
  }
}

export default UpvoteCollection;

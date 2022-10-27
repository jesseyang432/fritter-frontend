import type {HydratedDocument, Types} from 'mongoose';
import type {Downvote} from './model';
import DownvoteModel from './model';
import UpvoteCollection from '../upvote/collection';
import ReputationCollection from '../reputation/collection';

/**
 * This files contains a class that has the functionality to explore downvote
 * stored in MongoDB.
 * Feel free to add additional operations in this file.
 */
class DownvoteCollection {
  /**
   * Add an upvote to the collection (removing potential downvote on same freet)
   *
   * @param {string} downvoterId - The id of the user upvoting
   * @param {string} freetId - The id of the freet
   * @return {Promise<HydratedDocument<Downvote>>} - The newly created upvote
   */
  static async addOne(downvoterId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Downvote>> {
    await UpvoteCollection.deleteOne(downvoterId, freetId);
    
    const downvote = new DownvoteModel({
      downvoter: downvoterId,
      freet: freetId
    });

    // Synchronously try to update reputation
    await ReputationCollection.updateByDelta(freetId, -1);
 
    await downvote.save(); // Saves upvote to MongoDB
    return downvote.populate('downvoter');
  }

  /**
   * Get all the downvotes of a given freet
   *
   * @param {string} freetId - The id of the freet
   * @return {Promise<HydratedDocument<Downvote>[]>} - An array of all of the upvotes
   */
  static async findAllByFreet(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Downvote>>> {
    return DownvoteModel.find({freet: freetId}).populate('downvoter');
  }

  /**
   * Gets a downvoter from the downvoter and freet
   * 
   * @param userId - ID of the downvoter
   * @param freetId - ID of the freet
   * @returns {Promise<HydratedDocument<Downvote>>} - Downvote object
   */
  static async findOneByUserAndFreet(userId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Downvote>> {
    return DownvoteModel.findOne({downvoter: userId, freet: freetId});
  }

  /**
   * Delete a downvote with freet `freetId` and downvote `downvoterId`.
   *
   * @param {string} downvoterId - The id of the user who downvoted
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(downvoterId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<boolean> {
    const exists = await DownvoteModel.findOne({downvoter: downvoterId, freet: freetId})
    const downvote = await DownvoteModel.deleteOne({downvoter: downvoterId, freet: freetId});
    if (exists && downvote !== null) {
      // Synchronously try to update reputation
      await ReputationCollection.updateByDelta(freetId, 1);
    }
    return downvote !== null;
  }
}

export default DownvoteCollection;

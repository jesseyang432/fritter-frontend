import type {HydratedDocument, Types} from 'mongoose';
import type {Safety} from './model';
import SafetyModel from './model';

/**
 * This files contains a class that has the functionality to explore safety
 * stored in MongoDB.
 * Feel free to add additional operations in this file.
 */
class SafetyCollection {
  /**
   * Creates a safety for a freet
   * 
   * @param freetId - The ID of the freet
   * @param level - The safety level of the freet (SFW, NSFW, or nullified)
   * @return {Promise<HydratedDocument<Safety>>}
   */
  static async addOne(freetId: Types.ObjectId | string, level: string): Promise<HydratedDocument<Safety>> {
    const safety = new SafetyModel({
      freet: freetId,
      safety: level
    });

    await safety.save();
    return safety.populate('freet');
  }

  /**
   * Find a safety by the ids of the freet
   * 
   * @param freetId - The ID of the freet
   * @return {Promise<HydratedDocument<Safety>>}
   */
  static async findOneByFreet(freetId: Types.ObjectId | string): Promise<HydratedDocument<Safety>> {
    return SafetyModel.findOne({freet: freetId}).populate('freet');
  }

}

export default SafetyCollection;

import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Safety, PopulatedSafety} from '../safety/model';

// Update this if you add a property to the Safety type!
type SafetyResponse = {
  _id: string;
  freet: string;
  safety: string;
};

/**
 * Transform a raw Safety object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Safety>} safety - A safety
 * @returns {SafetyResponse} - The safety object formatted for the frontend
 */
const constructSafetyResponse = (safety: HydratedDocument<Safety>): SafetyResponse => {
  const safetyCopy: PopulatedSafety = {
    ...safety.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  return {
    ...safetyCopy,
    _id: safetyCopy._id.toString(),
    freet: safetyCopy.freet._id.toString(),
    safety: safetyCopy.safety as string,
  };
};

export {
  constructSafetyResponse
};

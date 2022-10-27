import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import UpvoteCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as upvoteValidator from '../upvote/middleware';
import * as util from './util';

const router = express.Router();


/**
 * Create a new upvote.
 *
 * @name POST /api/upvotes/:freetId
 *
 * @param {string} freetId - The ID of the freet to upvote
 * @return {UpvoteResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is invalid
 * @throws {400} - If the user has already upvoted the freet
 */
router.post(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    upvoteValidator.isNotUpvotedByUser
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const upvote = await UpvoteCollection.addOne(userId, req.params.freetId);

    res.status(201).json({
      message: 'Your upvote was created successfully.',
      upvote: util.constructUpvoteResponse(upvote)
    });
  }
);

/**
 * Remove an upvote.
 *
 * @name DELETE /api/upvotes/:freetId
 *
 * @param {string} freetId - The ID of the freet to upvote
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is invalid
 * @throws {400} - If the user has not upvoted the freet
 */
 router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    upvoteValidator.isUpvotedByUser,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    await UpvoteCollection.deleteOne(userId, req.params.freetId);

    res.status(201).json({
      message: 'Your upvote was removed successfully.'
    });
  }
);

/**
 * Get upvotes on a freet.
 *
 * @name GET /api/upvotes/:freetId
 *
 * @param {string} freetId - The ID of the freet to upvote
 * @return {UpvoteResponse[]} - Array of upvotes on a freet
 * @throws {404} - If the freetId is invalid
 */
 router.get(
  '/:freetId?',
  [
    freetValidator.isFreetExists,
  ],
  async (req: Request, res: Response) => {
    const upvotes = await UpvoteCollection.findAllByFreet(req.params.freetId);
    const response = upvotes.map(util.constructUpvoteResponse);
    res.status(200).json(response);
  }
);


export {router as upvoteRouter};

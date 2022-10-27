import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import DownvoteCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as downvoteValidator from '../downvote/middleware';
import * as util from './util';

const router = express.Router();


/**
 * Create a new downvote.
 *
 * @name POST /api/downvotes/:freetId
 *
 * @param {string} freetId - The ID of the freet to upvote
 * @return {DownvoteResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is invalid
 * @throws {400} - If the user has already downvoted the freet
 */
router.post(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    downvoteValidator.isNotDownvotedByUser
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const upvote = await DownvoteCollection.addOne(userId, req.params.freetId);

    res.status(201).json({
      message: 'Your downvote was created successfully.',
      downvote: util.constructDownvoteResponse(upvote)
    });
  }
);

/**
 * Remove a downvote.
 *
 * @name DELETE /api/downvotes/:freetId
 *
 * @param {string} freetId - The ID of the freet to upvote
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the freetId is invalid
 * @throws {400} - If the user has not downvoted the freet
 */
 router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    downvoteValidator.isDownvotedByUser,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    await DownvoteCollection.deleteOne(userId, req.params.freetId);

    res.status(201).json({
      message: 'Your downvote was removed successfully.'
    });
  }
);

/**
 * Get downvotes on a freet.
 *
 * @name GET /api/downvotes/:freetId
 *
 * @param {string} freetId - The ID of the freet to upvote
 * @return {DownvoteResponse[]} - Array of upvotes on a freet
 * @throws {404} - If the freetId is invalid
 */
 router.get(
  '/:freetId?',
  [
    freetValidator.isFreetExists,
  ],
  async (req: Request, res: Response) => {
    const downvotes = await DownvoteCollection.findAllByFreet(req.params.freetId);
    const response = downvotes.map(util.constructDownvoteResponse);
    res.status(200).json(response);
  }
);


export {router as downvoteRouter};

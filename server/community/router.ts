import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import CommunityCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as communityValidator from '../community/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the communities
 *
 * @name GET /api/communities
 *
 * @return {CommunityResponse[]} - A list of all the communities
 */
router.get(
  '/',
  async (req: Request, res: Response) => {
    const allCommunities = await CommunityCollection.findAll();
    const response = allCommunities.map(util.constructCommunityResponse);
    res.status(200).json(response);
  }
);

/**
 * Get a community by name
 *
 * @name GET /api/communities/:communityName
 *
 * @return {CommunityResponse} - A community
 */
 router.get(
  '/:communityName?',
  [
    communityValidator.isCommunityExistsByName
  ],
  async (req: Request, res: Response) => {
    const community = await CommunityCollection.findOneByName(req.params.communityName);
    const response = util.constructCommunityResponse(community);
    res.status(200).json(response);
  }
);

/**
 * Create a new community.
 *
 * @name POST /api/communities
 *
 * @param {string} name - The name of the community
 * @return {CommunityResponse} - The created community
 * @throws {403} - If the user is not logged in
 * @throws {409} - If the community name already exists
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    communityValidator.isNameNotAlreadyInUse,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const community = await CommunityCollection.addOne(userId, req.body.name);

    res.status(201).json({
      message: 'Your community was created successfully.',
      community: util.constructCommunityResponse(community)
    });
  }
);

/**
 * Join a community
 *
 * @name PUT /api/communities/join/:communityId
 *
 * @return {CommunityResponse} - the updated community
 * @throws {403} - if the user is not logged in
 * @throws {404} - if the communityId is not valid
 * @throws {400} - If the user is already in the community
 */
router.put(
  '/join/:communityId?',
  [
    userValidator.isUserLoggedIn,
    communityValidator.isCommunityExists,
    communityValidator.isUserNotInCommunity,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const community = await CommunityCollection.addUserIdToCommunity(userId, req.params.communityId);
    res.status(200).json({
      message: 'Your community was updated successfully.',
      community: util.constructCommunityResponse(community)
    });
  }
);

/**
 * Leave a community
 *
 * @name PUT /api/communities/leave/:communityId
 *
 * @return {CommunityResponse} - the updated community
 * @throws {403} - if the user is not logged in
 * @throws {404} - if the communityId is not valid
 * @throws {400} - If the user is not in the community
 */
 router.put(
  '/leave/:communityId?',
  [
    userValidator.isUserLoggedIn,
    communityValidator.isCommunityExists,
    communityValidator.isUserInCommunity,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const community = await CommunityCollection.removeUserIdFromCommunity(userId, req.params.communityId);
    res.status(200).json({
      message: 'Your community was updated successfully.',
      community: util.constructCommunityResponse(community)
    });
  }
);

export {router as communityRouter};

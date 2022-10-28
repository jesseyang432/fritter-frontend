import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import CommunityCollection from '../community/collection';

/**
 * Checks if a name in req.body is already in use
 */
 const isNameNotAlreadyInUse = async (req: Request, res: Response, next: NextFunction) => {
  const community = await CommunityCollection.findOneByName(req.body.name);

  if (!community) {
    next();
    return;
  }

  res.status(409).json({
    error: 'A community with this name already exists.'
  });
};

/**
 * Checks if a community exists based on communityId provided in req.params
 */
 const isCommunityExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const community = await CommunityCollection.findOneByCommunityId(req.params.communityId);

    if (community) {
      next();
    } else {
      res.status(404).json({error: 'Community not found.'});
    }
  } catch (error) {
    res.status(404).json({error: 'Community not found.'});
  }
};

/**
 * Checks if a community exists based on communityName provided in req.params
 */
 const isCommunityExistsByName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const community = await CommunityCollection.findOneByName(req.params.communityName);

    if (community) {
      next();
    } else {
      res.status(404).json({error: 'Community not found.'});
    }
  } catch (error) {
    res.status(404).json({error: 'Community not found.'});
  }
};

/**
 * Checks if the current user is not in the community whose communityName is in req.params
 */
 const isUserInCommunityByName = async (req: Request, res: Response, next: NextFunction) => {
  const community = await CommunityCollection.findOneByName(req.params.communityName);
  const userId = req.session.userId;
  if (!community.members.some((member) => (member._id.toString() === userId))) {
    res.status(403).json({
      error: 'Cannot access community you are not in.'
    });
    return;
  }

  next();
}; 

/**
 * Checks if the current user is not in the community whose communityId is in req.params
 */
const isUserNotInCommunity = async (req: Request, res: Response, next: NextFunction) => {
  const community = await CommunityCollection.findOneByCommunityId(req.params.communityId);
  const userId = req.session.userId;
  if (community.members.some((member) => (member._id.toString() === userId))) {
    res.status(400).json({
      error: 'Cannot join community you are already in.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is not in the community whose communityId is in req.params
 */
 const isUserInCommunity = async (req: Request, res: Response, next: NextFunction) => {
  const community = await CommunityCollection.findOneByCommunityId(req.params.communityId);
  const userId = req.session.userId;
  if (!community.members.some((member) => (member._id.toString() === userId))) {
    res.status(400).json({
      error: 'Cannot leave community you are not in.'
    });
    return;
  }

  next();
};

/**
 * Checks if user is violating how they can post in community whose name is in req.body.community
 */
 const isUserPostingWronglyCommunity = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.community) {
    const community = await CommunityCollection.findOneByName(req.body.community);
    if (!community) {
      res.status(404).json({
        error: 'Community to post in was not found.'
      });
      return;
    }
    const userId = req.session.userId;
    if (!community.members.some((member) => (member._id.toString() === userId))) {
      res.status(403).json({
        error: 'Cannot post in community you are not part of.'
      });
      return;
    }
  }
  next();
};

export {
  isNameNotAlreadyInUse,
  isCommunityExists,
  isCommunityExistsByName,
  isUserInCommunityByName,
  isUserInCommunity,
  isUserNotInCommunity,
  isUserPostingWronglyCommunity
};

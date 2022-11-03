import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import CommunityCollection from '../community/collection';

/**
 * Checks if a freet with freetId is req.params exists
 */
const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const freet = validFormat ? await FreetCollection.findOne(req.params.freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: `Freet with freet ID ${req.params.freetId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if a freet is responding to a valid parent (req.body.parentId must exist or be empty and must be within the specified community)
 */
 const isRespondingToValidParent = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.parentId === '') {
    next();
    return;
  }
  const validFormat = Types.ObjectId.isValid(req.body.parentId);
  const parentFreet = validFormat ? await FreetCollection.findOne(req.body.parentId) : '';
  if (!parentFreet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.body.parentId} does not exist.`
      }
    });
    return;
  }
  const community = await CommunityCollection.findOneByName(req.body.community);
  if ((parentFreet.community && !community) || (community && parentFreet.community !== community._id)) {
    res.status(409).json({
      error: 'Freet being posted and Freet it replies to are in differing communities.'
    });
    return;
  }
  
  next();
}

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidFreetContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Freet content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Freet content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidFreetModifier = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const userId = freet.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' freets.'
    });
    return;
  }

  next();
};

export {
  isValidFreetContent,
  isFreetExists,
  isValidFreetModifier,
  isRespondingToValidParent
};

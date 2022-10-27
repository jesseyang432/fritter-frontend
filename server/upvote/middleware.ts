import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UpvoteCollection from '../upvote/collection';

/**
 * Checks if a freet with id freetId in req.params has not been upvoted by the user
 */
const isNotUpvotedByUser = async (req: Request, res: Response, next: NextFunction) => {
  const upvote = await UpvoteCollection.findOneByUserAndFreet(req.session.userId, req.params.freetId);
  if (upvote) {
    res.status(400).json({
      error: 'You have already upvoted this Freet.'
    });
    return;
  }

  next();
}

/**
 * Checks if a freet with id freetId in req.params has already been upvoted by the user
 */
 const isUpvotedByUser = async (req: Request, res: Response, next: NextFunction) => {
  const upvote = await UpvoteCollection.findOneByUserAndFreet(req.session.userId, req.params.freetId);
  if (!upvote) {
    res.status(400).json({
      error: 'You have not yet upvoted this Freet.'
    });
    return;
  }

  next();
}

export {
  isUpvotedByUser,
  isNotUpvotedByUser,
};

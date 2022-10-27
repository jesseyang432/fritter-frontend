import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import DownvoteCollection from '../downvote/collection';

/**
 * Checks if a freet with id freetId in req.params has not been downvoted by the user
 */
const isNotDownvotedByUser = async (req: Request, res: Response, next: NextFunction) => {
  const downvote = await DownvoteCollection.findOneByUserAndFreet(req.session.userId, req.params.freetId);
  if (downvote) {
    res.status(400).json({
      error: 'You have already downvoted this Freet.'
    });
    return;
  }

  next();
}

/**
 * Checks if a freet with id freetId in req.params has already been downvoted by the user
 */
 const isDownvotedByUser = async (req: Request, res: Response, next: NextFunction) => {
  const downvote = await DownvoteCollection.findOneByUserAndFreet(req.session.userId, req.params.freetId);
  if (!downvote) {
    res.status(400).json({
      error: 'You have not yet downvoted this Freet.'
    });
    return;
  }

  next();
}

export {
  isDownvotedByUser,
  isNotDownvotedByUser,
};

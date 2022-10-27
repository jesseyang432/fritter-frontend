import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import CommunityCollection from '../community/collection';

/**
 * Checks that req.query.community is valid community name and req.query.username is valid username
 */
const isValidQuery = async (req: Request, res: Response, next: NextFunction) => {
  const community = await CommunityCollection.findOneByName(req.query.community as string);
  const user = await UserCollection.findOneByUsername(req.query.username as string);
  if (!community) {
    res.status(404).json({
      error: 'Community not found.'
    });
    return;
  } else if (!user) {
    res.status(404).json({
      error: 'User not found.'
    });
    return;
  }

  next();
}
export {
  isValidQuery
};

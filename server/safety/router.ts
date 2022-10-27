import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as freetValidator from '../freet/middleware';
import * as util from './util';
import SafetyCollection from './collection';

const router = express.Router();

/**
 * Get safety of a given freet
 *
 * @name GET /api/safety/:freetId
 *
 * @return {SafetyResponse} - Safety object
 * @throws {404} - If the freetId is invalid
 */
 router.get(
  '/:freetId?',
  [
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const safety = await SafetyCollection.findOneByFreet(req.params.freetId);
    const response = util.constructSafetyResponse(safety);
    res.status(200).json(response);
  }
);

export {router as safetyRouter};

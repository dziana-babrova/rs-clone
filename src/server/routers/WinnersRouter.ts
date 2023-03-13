import * as express from 'express';
import WinnersController from '../controllers/WinnersController';

const winnersRouter = express.Router();
const controller = new WinnersController();

winnersRouter.get('/', controller.getWinners);

export default winnersRouter;

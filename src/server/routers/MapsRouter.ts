import * as express from 'express';
import MapsController from '../controllers/MapsController';
import authMiddleware from '../middleware/auth-middleware';

const mapsRouter = express.Router();
const controller = new MapsController();

mapsRouter.get('/', authMiddleware, controller.getMaps);
mapsRouter.post('/', authMiddleware, controller.createMaps);
mapsRouter.put('/', authMiddleware, controller.updateMaps);

export default mapsRouter;

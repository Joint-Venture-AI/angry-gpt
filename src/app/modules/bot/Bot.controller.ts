import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';
import { BotServices } from './Bot.service';

export const BotControllers = {
  create: catchAsync(async (req, res) => {
    const data = await BotServices.create(req.body);

    serveResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: 'Bot created successfully',
      data,
    });
  }),

  update: catchAsync(async (req, res) => {
    const data = await BotServices.update(req.params.bookId, req.body);

    serveResponse(res, {
      message: 'Bot updated successfully',
      data,
    });
  }),

  delete: catchAsync(async (req, res) => {
    await BotServices.delete(req.params.botId);

    serveResponse(res, {
      message: 'Bot deleted successfully',
    });
  }),

  list: catchAsync(async (req, res) => {
    const { bots, meta } = await BotServices.list(req.query);

    serveResponse(res, {
      message: 'Bots fetched successfully',
      meta,
      data: bots,
    });
  }),
};

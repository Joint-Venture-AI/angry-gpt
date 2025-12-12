import { SettingService } from './Setting.service';
import catchAsync from '../../../util/server/catchAsync';
import serveResponse from '../../../util/server/serveResponse';

export const SettingController = {
  modify: catchAsync(async (req, res) => {
    await SettingService.modify(req.body.name, req.body.value);

    serveResponse(res, {
      message: 'Setting modified successfully.',
    });
  }),

  retrieve: catchAsync(async (req, res) => {
    const settings = await SettingService.retrieve();

    serveResponse(res, {
      message: 'Setting retrieved successfully.',
      data: settings,
    });
  }),

  retrieveByName: catchAsync(async (req, res) => {
    const setting = await SettingService.retrieveByName(req.params.name);

    serveResponse(res, {
      message: 'Setting retrieved successfully.',
      data: setting?.value,
    });
  }),
};

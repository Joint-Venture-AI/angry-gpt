import Setting from './Setting.model';

export const SettingService = {
  modify: async (name: string, value: string) =>
    Setting.updateOne({ name }, { value }, { upsert: true }),

  retrieve: async () => Setting.find(),

  retrieveByName: async (name: string) => Setting.findOne({ name }),
};

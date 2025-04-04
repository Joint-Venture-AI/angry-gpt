import { Schema, model } from 'mongoose';
import { TSetting } from './Setting.interface';

const settingSchema = new Schema<TSetting>({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const Setting = model<TSetting>('Setting', settingSchema);

export default Setting;

import { connect } from 'mongoose';
import { config } from 'dotenv';

export const dbConnect = async () => {
  try {
    await connect('mongodb://127.0.0.1:27017/monitor_api');
  } catch (err) {
    console.log(err);
  }
};

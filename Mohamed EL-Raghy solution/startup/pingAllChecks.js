const { Check } = require('../models/check');

const monitor = require('../services/uptime-monitor');
let ping;

module.exports = async () => {
  console.log('Monitoring....');
  try{
    const checks = await Check.find();
    if(checks.length === 0) {
      console.log('There is no check to monitor, please create a check');
      // throw new Error('There is no checks to monitor..');
    } else {
      checks.forEach(async(check) => {
        ping = await monitor(check);
        ping.start();
      });
    }
  } catch (error) {
    throw error;
  }
}
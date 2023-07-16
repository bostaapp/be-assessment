const URLCheck = require('../models/URLCheck');

class URLCheckService {
  async createURLCheck(data) {
    const urlCheck = new URLCheck(data);
    await urlCheck.save();
    return urlCheck;
  }

  async getURLChecks() {
    const urlCheck = await URLCheck.find();
    if (urlCheck) {
      throw new Error('URL check not found');
    }
    return urlCheck;
  }
  async getURLCheck(id) {
    const urlCheck = await URLCheck.findById(id);
    if (!urlCheck) {
      throw new Error('URL check not found');
    }
    return urlCheck;
  }

  async updateURLCheck(id, updates) {
    const urlCheck = await URLCheck.findByIdAndUpdate(id, updates, { new: true });
    if (!urlCheck) {
      throw new Error('URL check not found');
    }
    return urlCheck;
  }

  async deleteURLCheck(id) {
    const urlCheck = await URLCheck.findByIdAndDelete(id);
    if (!urlCheck) {
      throw new Error('URL check not found');
    }
  }
}

module.exports = new URLCheckService();

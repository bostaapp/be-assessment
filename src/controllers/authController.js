const authService = require('../services/authService');

class AuthController {
  async signup(req, res) {
    try {
      const { email, password } = req.body;
      const user = await authService.signup(email, password);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const token = await authService.login(email, password);
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async verifyEmail(req, res) {
    try {
      const {token} = req.query;
      const user = await authService.verifyEmail(token);
      res.json({ message: `the user ${user?.email} is verified`});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

   
}

module.exports = new AuthController();

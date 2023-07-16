const urlCheckService = require("../services/urlCheckService");

class URLCheckController {
	async createURLCheck(req, res) {
		try {
			const {
				name,
				url,
				protocol,
				path,
				port,
				webhook,
				timeout,
				interval,
				threshold,
				authentication,
				httpHeaders,
				assert,
				tags,
				ignoreSSL,
			} = req.body;
			const userId = req.user.id;
			const urlCheck = await urlCheckService.createURLCheck({
				name,
				url,
				protocol,
				path,
				port,
				webhook,
				timeout,
				interval,
				threshold,
				authentication,
				httpHeaders,
				assert,
				tags,
				ignoreSSL,
				userId,
			});
			res.json(urlCheck);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async getURLChecks(req, res) {
		try {
			const urlChecks = await urlCheckService.getURLChecks();
			res.json(urlChecks);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
	async getURLCheck(req, res) {
		try {
			const urlCheckId = req.params.id;
			const urlCheck = await urlCheckService.getURLCheck(urlCheckId);
			res.json(urlCheck);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async updateURLCheck(req, res) {
		try {
			const urlCheckId = req.params.id;
			const updates = req.body;
			const urlCheck = await urlCheckService.updateURLCheck(
				urlCheckId,
				updates
			);
			res.json(urlCheck);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	async deleteURLCheck(req, res) {
		try {
			const urlCheckId = req.params.id;
			await urlCheckService.deleteURLCheck(urlCheckId);
			res.sendStatus(204);
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}

module.exports = new URLCheckController();

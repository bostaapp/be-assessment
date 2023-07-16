const mongoose = require("mongoose");
const app = require("./src/app");
const { runMonitorScheduler } = require("./src/services/monitorScheduler");
const port = 3000;

mongoose
	.connect("mongodb://localhost/uptime_monitoring", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		// useCreateIndex: true,
	})
	.then(() => {
		app.listen(port, () => {
			console.log(`Server listening at http://localhost:${port}`);
			runMonitorScheduler();
		});
	})
	.catch((error) => {
		console.error("Error connecting to MongoDB:", error);
	});

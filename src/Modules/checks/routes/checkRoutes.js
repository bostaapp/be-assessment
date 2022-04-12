const express = require("express");
const isAuthenticated = require("../../../../common/middleware/isAuthenticated");
const { getChecks, putCheck, deleteChecks, getCheckById, updateCheck } = require("../controllers/checkController");


const route = express.Router();

route.get("/checks", isAuthenticated(), getChecks);

route.get("/checks/:checkId", isAuthenticated(), getCheckById);

route.put("/checks", isAuthenticated(), putCheck);

route.put("/checks/:id", isAuthenticated(), updateCheck);

route.delete("/checks/:checkId", isAuthenticated(), deleteChecks);


module.exports = route;
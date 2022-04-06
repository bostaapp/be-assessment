const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const eventEmitter = require("../Utils/eventEmitter");
const Check = require("../Models/checkSchema");
const Report = require("../Models/reportSchema");

exports.createCheck = (req, res, next) => {
  //validation errors
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  }

  //check if duplicated Check created for the same user
  Check.findOne({
    $and: [
      { url: req.body.url },
      { path: req.body.path },
      { owner: req.body.owner },
    ],
  })
    .then((data) => {
      if (data) {
        next(new Error("duplicated check"));
      } else {
        //create new check
        new Check({
          owner: req.body.owner,
          name: req.body.name,
          url: req.body.url,
          protocol: req.body.protocol,
          path: req.body.path,
          port: req.body.port,
          timeout: req.body.timeout,
          interval: req.body.interval,
          threshold: req.body.threshold,
          authentication: req.body.authentication,
          httpHeaders: req.body.httpHeaders,
          assert: req.body.assert,
          tags: req.body.tags,
          ignoreSSL: req.body.ignoreSSL,
        })
          .save()
          .then((data) => {
            res.status(201).json({ message: "check created", data: data });
            eventEmitter.emit("checkCreated", data);

            //create new report object for this check
            new Report({
              check: data._id,
              status: 200,
              availability: 0,
              outages: 0,
              requests: 0,
              downtime: 0,
              uptime: 0,
              responseTime: 0,
              history: [],
            })
              .save()
              .then((report) => {
                console.log(report);
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
            next(error);
          });
      }
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
};

exports.updateCheck = (req, res, next) => {
  //validation errors
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  }
  //check if user is the check owner
  const token = req.headers["authorization"];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // not valid token
    Check.findById(req.body._id).then((data) => {
      if (user._id != data.owner) res.sendStatus(403); //not the owner
      Check.findByIdAndUpdate(
        req.body._id,
        {
          $set: {
            ...req.body,
          },
        },
        { new: true }
      )
        .then((check) => {
          res.status(201).json({ message: "updated", data: check });
        })
        .catch((error) => {
          console.log(error);
          next(error);
        });
    });
  });

  Check.findByIdAndUpdate(
    req.body._id,
    {
      $set: {
        ...req.body,
      },
    },
    { new: true }
  )
    .then((check) => {
      res.status(201).json({ message: "updated", data: check });
      eventEmitter.emit("checkUpdated", check);
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
};

exports.deleteCheck = (req, res, next) => {
  //check if user is the check owner
  const token = req.headers["authorization"];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // not valid token
    Check.findById(req.body._id).then((data) => {
      if (user._id != data.owner) res.sendStatus(403); //not the owner
      Check.findByIdAndDelete(req.params.id)
        .then((check) => {
          res.status(201).json({ message: "deleted", data: check });
          eventEmitter.emit("checkDeleted", check);
        })
        .catch((error) => {
          console.log(error);
          next(error);
        });
    });
  });
};

exports.getCheck = (req, res, next) => {
  //check if user is the check owner
  const token = req.headers["authorization"];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // not valid token
    Check.findById(req.body._id).then((data) => {
      if (user._id != data.owner) res.sendStatus(403); //not the owner
      res.status(200).json({ data: data });
    });
  });
  Check.findById(req.params.id)
    .then((data) => {
      if (user._id != data.owner) res.sendStatus(403); //not the owner
      res.status(200).json({ data: data });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
};

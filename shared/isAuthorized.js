import jwt from "jsonwebtoken";

const isAuthorized = () => {
  return async (req, res, next) => {
    try {
      if (!req.headers.authorization) {
        res.status(401).json({ message: "unauthoraized" });
      }

      if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = await jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded;
        next();
      }
    } catch (error) {
      return res.status(400).json({ error });
    }
  };
};

export { isAuthorized };

import jwt from "jsonwebtoken";

const logInAuthMiddleware = (req, res, next) => {
  try {
    // first take the token from the header
    const authHeader = req.headers.authorization;

    // make sure that there is a header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token is provided",
      });
    }

    // remove bearer
    const token = authHeader.split(" ")[1];

    // decode the token
    //const decoded = jwt.verify(token, process.env.jwt);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    // go to the route
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

//module.exports = logInAuthMiddleware;
export default logInAuthMiddleware;

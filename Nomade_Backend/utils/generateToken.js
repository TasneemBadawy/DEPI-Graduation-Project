import jwt from "jsonwebtoken";

// the function that generates the token
export const generateToken = (email , Role) => {
  return jwt.sign({ id: email , role : Role}, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export default generateToken;

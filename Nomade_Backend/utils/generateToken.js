import jwt from "jsonwebtoken";

// the function that generates the token
export const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role || "user" }, 
    process.env.JWT_SECRET, 
    { expiresIn: "1d" }
  );
};

export default generateToken;
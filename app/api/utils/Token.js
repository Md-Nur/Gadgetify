import jwt from "jsonwebtoken";

import ApiError from "../utils/ApiError";

const generateToken = (tokenData) => {
  const token = jwt.sign(tokenData, process.env.JWT_SECRET_TOKEN, {
    expiresIn: "125d",
  });
  return token;
};

export function getTokenData(data) {
  if (!data) return {};
  let decodedData;
  try {
    decodedData = jwt.verify(data, process.env.JWT_SECRET_TOKEN);
  } catch (error) {
    throw new ApiError(450, error.message);
  }

  return decodedData;
}

export default generateToken;

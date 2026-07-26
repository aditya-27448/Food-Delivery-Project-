import jwt from "jsonwebtoken";

const genToken = async (userId) => {
  try {
    // jwt.sign is used to assign a token to userid or simpely say generate a token.
    const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};

export default genToken;

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  accessToken: {
    expiresIn: "1d",
  },
  refreshToken: {
    expiresIn: "7d",
  },
};

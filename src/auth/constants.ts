export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  accessToken: {
    expiresIn: "60s",
  },
  refreshToken: {
    expiresIn: "7d",
  },
};

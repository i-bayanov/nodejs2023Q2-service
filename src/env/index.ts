const PORT = parseInt(process.env.PORT, 10);

const postgresHost = process.env.POSTGRES_HOST;
const postgresPort = parseInt(process.env.POSTGRES_PORT, 10);
const postgresUser = process.env.POSTGRES_USER;
const postgresPassword = process.env.POSTGRES_PASSWORD;
const postgresDB = process.env.POSTGRES_DB;

const cryptSault = parseInt(process.env.CRYPT_SALT, 10);

const accessTokenSecret = process.env.JWT_SECRET_KEY;
const refreshTokenSecret = process.env.JWT_SECRET_REFRESH_KEY;
const accessTokenExpire = process.env.TOKEN_EXPIRE_TIME;
const refreshTokenExpire = process.env.TOKEN_REFRESH_EXPIRE_TIME;

if (
  !PORT ||
  !postgresHost ||
  !postgresPort ||
  !postgresUser ||
  !postgresPassword ||
  !postgresDB ||
  !cryptSault ||
  !accessTokenSecret ||
  !refreshTokenSecret ||
  !accessTokenExpire ||
  !refreshTokenExpire
)
  throw new Error('Environment not configured correctly');

export {
  PORT,
  postgresHost,
  postgresPort,
  postgresUser,
  postgresPassword,
  postgresDB,
  cryptSault,
  accessTokenSecret,
  refreshTokenSecret,
  accessTokenExpire,
  refreshTokenExpire,
};

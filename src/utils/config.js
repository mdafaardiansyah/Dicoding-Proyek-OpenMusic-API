/**
 * Konfigurasi untuk service eksternal
 * Menampung semua konfigurasi yang dibutuhkan oleh service external
 */

const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  database: {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  },
  s3: {
    bucketName: process.env.AWS_BUCKET_NAME,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
  },
  redis: {
    host: process.env.REDIS_SERVER || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
    url: process.env.REDIS_PASSWORD 
      ? `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_SERVER || 'localhost'}:${process.env.REDIS_PORT || 6379}`
      : `redis://${process.env.REDIS_SERVER || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
  },
  jwt: {
    accessTokenKey: process.env.ACCESS_TOKEN_KEY,
    refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
    accessTokenAge: process.env.ACCESS_TOKEN_AGE,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
  },
};

module.exports = config;
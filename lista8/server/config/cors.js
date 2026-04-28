const localhostOrigin = /^http:\/\/localhost(:\d+)?$/;

const corsOptions = {
  origin: localhostOrigin,
};

module.exports = { localhostOrigin, corsOptions };

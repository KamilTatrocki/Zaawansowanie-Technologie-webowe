const localhostOrigin = /^http:\/\/localhost(:\d+)?$/;

const corsOptions = {
  origin: localhostOrigin,
};

export { localhostOrigin, corsOptions };

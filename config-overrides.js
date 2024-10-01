module.exports = function override(config, env) {
  config.resolve.fallback = {
    "path": false,
    "stream": false ,
    crypto: false,
    "os": false ,
    "vm": false
  };

  return config;
};

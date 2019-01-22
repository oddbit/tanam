const tanamConfig = require(`./tanamConfig`);

export const environment = {
  production: false,
  logging: {
    cache: true,
    routing: false,
  },
  tanamConfig: tanamConfig.tanamConfig,
};

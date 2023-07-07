module.exports = {
    configureWebpack: {
      // Custom Webpack configuration options
    },
    devServer: {
      // Dev server configuration options
    },
    // Other configuration options...
  
    // Set environment variables
    chainWebpack: config => {
      config.plugin('define').tap(args => {
        const env = args[0];
        args[0] = {
          ...env,
          API_KEY: JSON.stringify(process.env.VUE_APP_API_KEY)
        };
        return args;
      });
    }
  };
  
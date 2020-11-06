module.exports = {
  apps : [{
    name: 'nodepop',
    script: './bin/www',
    watch: false,
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
      DEBUG: 'nodeapi:*'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  },
  {
    name: 'thumbnailService',
    script: './microservices/thumbnailService.js',
    watch: false,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};

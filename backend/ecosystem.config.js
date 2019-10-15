/**
 * @file pm2 配置文件, 用作 contious deployment
 * 本地开发使用 nodemon
 */

const {
  BETA_DEPLOY_USER,
  BETA_DEPLOY_PATH,
  BETA_DEPLOY_HOST
} = process.env

module.exports = {
  apps: [{
    name: 'tuchuang.space',
    script: 'service.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    // args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    env_beta: {
      NODE_ENV: 'beta'
    }
  }],

  deploy: {
    production: {
      user: 'root',
      host: '47.110.138.177',
      ref: 'origin/master',
      repo: 'git@github.com:Jiang-Xuan/tuchuang.space.git',
      path: '/var/www/production',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    beta: {
      user: BETA_DEPLOY_USER,
      host: BETA_DEPLOY_HOST,
      ref: 'origin/master',
      repo: 'git@github.com:Jiang-Xuan/tuchuang.space.git',
      path: BETA_DEPLOY_PATH,
      'post-deploy': 'echo \'post deploy\' && cd ./backend && npx crss-env MONGOMS_DISABLE_POSTINSTALL=1 yarn install && pm2 reload ecosystem.config.js --env beta'
    }
  }
}

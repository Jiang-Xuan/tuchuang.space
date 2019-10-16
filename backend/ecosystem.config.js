/**
 * @file pm2 配置文件, 用作 contious deployment
 * 本地开发使用 nodemon
 */

const {
  BETA_DEPLOY_USER,
  BETA_DEPLOY_PATH,
  BETA_DEPLOY_HOST,
  PROD_DEPLOY_USER,
  PROD_DEPLOY_PATH,
  PROD_DEPLOY_HOST,
  GITHUB_REF
} = process.env

let tag = null
if (GITHUB_REF && GITHUB_REF.startsWith('refs/tags/')) {
  console.log('production 环境的部署')
  tag = GITHUB_REF.slice(10)

  console.log(`GITHUB_REF: ${GITHUB_REF}, tag: ${tag}`)
}

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
      user: PROD_DEPLOY_USER,
      host: PROD_DEPLOY_HOST,
      ref: `origin/${tag}`,
      repo: 'git@github.com:Jiang-Xuan/tuchuang.space.git',
      path: PROD_DEPLOY_PATH,
      'post-deploy': 'echo \'post deploy\' && cd ./backend && npx cross-env MONGOMS_DISABLE_POSTINSTALL=1 yarn install && pm2 reload ecosystem.config.js --env production'
    },
    beta: {
      user: BETA_DEPLOY_USER,
      host: BETA_DEPLOY_HOST,
      ref: 'origin/feat-CD',
      repo: 'git@github.com:Jiang-Xuan/tuchuang.space.git',
      path: BETA_DEPLOY_PATH,
      'post-deploy': 'echo \'post deploy\' && cd ./backend && npx cross-env MONGOMS_DISABLE_POSTINSTALL=1 yarn install && pm2 reload ecosystem.config.js --env beta'
    }
  }
}

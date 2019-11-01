/**
 * @file 前端代码使用 pm2 deploy 功能来发布
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
    name: 'frondend.tuchuang.space',
    script: './bff/service.js',
    // https://github.com/Unitech/pm2/pull/2650
    append_env_to_name: true,
    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    // args: 'one two',
    instances: 1,
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 4303
    },
    env_beta: {
      NODE_ENV: 'beta',
      PORT: 4302
    }
  }],
  deploy: {
    production: {
      user: PROD_DEPLOY_USER,
      host: PROD_DEPLOY_HOST,
      ref: tag,
      repo: 'git@github.com:Jiang-Xuan/tuchuang.space.git',
      path: PROD_DEPLOY_PATH,
      'post-deploy': [
        'echo \'post deploy\'',
        'cd ./frondend',
        'yarn install',
        'node ./downloadIndexHtml.js',
        'pm2 reload ecosystem.config.js --env production'
      ].join(' && ')
    },
    beta: {
      user: BETA_DEPLOY_USER,
      host: BETA_DEPLOY_HOST,
      ref: 'origin/master',
      repo: 'git@github.com:Jiang-Xuan/tuchuang.space.git',
      path: BETA_DEPLOY_PATH,
      'post-deploy': [
        'echo \'post deploy\'',
        'cd ./frondend',
        'yarn install',
        'npx cross-env DEPLOY_TYPE=beta node ./downloadIndexHtml.js',
        'pm2 reload ecosystem.config.js --env beta'
      ].join(' && ')
    }
  }
}

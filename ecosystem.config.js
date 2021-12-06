module.exports = {
  apps : [{
      name: 'accountbook',
      script: './bin/www', // 앱 실행 스크립트
      instances: 2, // 앱 인스턴스의 수
      watch: true,
      instance_var: 'SCHEDULE_VAR', // 편한 이름으로 설정하면 됩니다.
      exec_mode: 'cluster', // 실행 모드.
      // env: { // 환경변수. 모든 배포 환경에서 공통으로 사용한다.
      //   NODE_ENV: 'development', //production
      // },
      // wait_ready: true,
      //listen_timeout: 50000,
      //kill_timeout: 5000,
      // env_staging: { // staging 배포 환경에서만 사용할 환경 변수
      //   API_ROOT: 'http://api.server.name'
      // },
    }
  ],
  
  /**
   * 배포 설정
   * pm2 deploy staging setup
   * pm2 deploy ecosystem.config.js staging
   */ 
  deploy : {
    staging: {
      // user: 'root', // 접속할 계정. SSH를 사용해서 서버에 접속할 수 있어야 한다.
      // host: 'appstaging.server.name', // 서버 도메인 또는 IP
      // ref: 'origin/develop', // 서버에서 clone할 브랜치
      // repo: 'git@github.com:user/reponame.git', // Git 저장소 URL
      // ssh_options: 'StrictHostKeyChecking=no', // SSH 접속 옵션.
      // path: '/home/www/project_root', // 앱을 설치할 폴더 위치
      'post-deploy': // PM2가 배포(git clone)한 후 실행할 명령어
        'npm install && npm run build && pm2 reload ecosystem.config.js'
    },
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};

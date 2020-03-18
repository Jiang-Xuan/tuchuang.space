cd ./backend

yarn install

pm2 start ecosystem.js --env beta

cd ./frondend

node downloadIndexHtml.js

cd ./bff

yarn install

pm2 start ecosystem.js --env beta

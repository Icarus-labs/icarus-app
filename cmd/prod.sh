yarn build
ssh df-sg "
  rm -rf /var/www/dapp/icarus-app
  exit
"
scp -r build df-sg:/var/www/dapp/icarus-app
ssh df-sg "
  chmod -R 777 /var/www/dapp/icarus-app
  exit
"
yarn build
ssh df-sg-test "
  rm -rf /var/www/dapp/icarus-app
  exit
"
scp -r build df-sg-test:/var/www/dapp/icarus-app

ssh df-sg-test "
  chmod -R 777 /var/www/dapp/icarus-app/img
  exit
"
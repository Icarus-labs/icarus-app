yarn build
ssh df-sg-test "
  rm -rf /var/www/dapp/icarus-app
  exit
"
scp -r build df-sg-test:/var/www/dapp/icarus-app

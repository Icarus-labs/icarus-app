yarn build
ssh df-sg "
  rm -rf /var/www/dapp/icarus-app-2
  exit
"
scp -r build df-sg:/var/www/dapp/icarus-app-2

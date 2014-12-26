# Home bookkeeper
## Instalation
Install **NodeJs**
```sh
sudo apt-get install python-software-properties python g++ make
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
```
Install **SailsJs**
```sh
sudo npm -g install sails
```
Install **Nodemon**
```sh
sudo npm -g install nodemon
```
Build **back-end** part
```sh
cd mkApi/
sudo npm install
```
Build **front-end** part
```sh
cd ../mkWeb/
sudo npm install
sudo npm install -g gulp
gulp
```

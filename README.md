# Домашняя бухгалтерия

## Установка

Установить **NodeJs**
```sh
sudo apt-get install python-software-properties python g++ make
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
```

Установить **Nodemon**
```sh
sudo npm -g install nodemon
```

Клонировать проект
```sh
$ git clone git@github.com:dimkahare/money_keeper.git
$ cd money_keeper 
```

Собрать **back-end**
```sh
$ cd mkApi/
$ sudo npm install
```

Собрать **front-end**
```sh
$ cd mkWeb/
$ sudo npm install
$ sudo npm install -g bower
$ sudo npm install -g gulp
$ gulp
```

Перейти в каталог выше и запустить серверную часть
```sh
$ cd ../
$ nodemon
```

MoneyKeeper должен быть доступен по адресу ```http://localhost:8080/app```

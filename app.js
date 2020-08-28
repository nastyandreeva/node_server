var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var expressValidator= require('express-validator'); 
var expressSession = require('express-session'); 
var routes = require('./routes/index'); 
var app = express();
var jsonParser = bodyParser.json();

app.use(expressValidator()); 
app.use(express.static(__dirname + "/public"));
app.use(expressSession({secret:'max', saveUninitialized:false,resave:false}))//нов

app.use('/', routes) 
// получение списка данных
app.get("/api/coins", function(req, res){

    var content = fs.readFileSync("coins.json", "utf8");
    var coins = JSON.parse(content);
    res.send(coins);
});
// получение одной валюты по id
app.get("/api/coins/:id", function(req, res){

    var id = req.params.id; // получаем id
    var content = fs.readFileSync("coins.json", "utf8");
    var coins = JSON.parse(content);
    var coin = null;
    // находим в массиве валюту по id
    for(var i=0; i<coins.length; i++){
        if(coins[i].id==id){
            coin = coins[i];
            break;
        }
    }
    // отправляем валюту
    if(coin){
        res.send(coin);
    }
    else{
        res.status(404).send();
    }
});
// получение отправленных данных
app.post("/api/coins", jsonParser, function (req, res) {

    if(!req.body) return res.sendStatus(400);

    var newTicker = req.body.ticker;
    var newName = req.body.name;
    var coin = {ticker: newTicker, name: newName};

    var data = fs.readFileSync("coins.json", "utf8");
    var coins = JSON.parse(data);
    // находим максимальный id
    var id = Math.max.apply(Math,coins.map(function(o){return o.id;}))
    // увеличиваем его на единицу
    coin.id = id+1;
    // добавляем валюту в массив
    coins.push(coin);
    var data = JSON.stringify(coins);
    // перезаписываем файл с новыми данными
    fs.writeFileSync("coins.json", data);
    res.send(coin);
});
// удаление валюты по id
app.delete("/api/coins/:id", function(req, res){

    var id = req.params.id;
    var data = fs.readFileSync("coins.json", "utf8");
    var coins = JSON.parse(data);
    var index = -1;
    // находим индекс валюты в массиве
    for(var i=0; i<coins.length; i++){
        if(coins[i].id==id){
            index=i;
            break;
        }
    }
    if(index > -1){
        // удаляем валюту из массива по индексу
        var coin = coins.splice(index, 1)[0];
        var data = JSON.stringify(coins);
        fs.writeFileSync("coins.json", data);
        // отправляем удаленную валюту
        res.send(coin);
    }
    else{
        res.status(404).send();
    }
});
// изменение валюты
app.put("/api/coins", jsonParser, function(req, res){

    if(!req.body) return res.sendStatus(400);

    var moneyId = req.body.id;
    var newTicker = req.body.ticker;
    var newName = req.body.name;

    var data = fs.readFileSync("coins.json", "utf8");
    var coins = JSON.parse(data);
    var coin;
    for(var i=0; i<coins.length; i++){
        if(coins[i].id==moneyId){
            coin = coins[i];
            break;
        }
    }
    // изменяем данные у валюты
    if(coin){
        coin.ticker = newTicker;
        coin.name = newName;
        var data = JSON.stringify(coins);
        fs.writeFileSync("coins.json", data);
        res.send(coin);
    }
    else{
        res.status(404).send(coin);
    }
});
app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});

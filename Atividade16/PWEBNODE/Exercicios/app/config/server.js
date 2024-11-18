var express = require('express');
var consign = require('consign');
var app=express(); // executando o express
app.set('view engine', 'ejs'); // o mecanismo de engine a ser usado
app.set('views','./app/views'); // diretório onde os arquivos estão localizados
consign({cwd:'app'})
.include('routes')
.then('config/dbConnection.js')
.into(app);
consign().include('app/routes').into(app);
module.exports = app; 

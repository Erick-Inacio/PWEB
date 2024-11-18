var sql = require ('mssql');
 var connSQLServer = function(){

   const sqlConfig = {
       user: 'BD2213009',
       password: '@12345678a',
       database:'BD',
       server: 'APOLO',
       options:{
           encrypt: false,
           trustServerCertificate: true
       }
   }      
    return sql.connect(sqlConfig);}

module.exports = function(){
    console.log('O autoload carregou o módulo de conecção com o bd');
    return connSQLServer;}
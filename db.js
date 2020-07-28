
const {port,user,dialet,database,host} = require('./configuracion_db');
const Sequelize= require('sequelize');
const sequelize= new Sequelize(`${dialet}://${user}:@${host}:${port}/${database}`);

module.exports=()=> sequelize;

const router= require('express').Router();
const middleware=require('./middlewares');
const apiProductos= require('./api/productos');

const apiUsuarios= require('./api/usuarios');


router.use('/productos', apiProductos);
router.use('/usuarios', apiUsuarios);

module.exports=router;



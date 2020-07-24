const router= require('express').Router();
const middleware=require('./middlewares');
const apiProductos= require('./api/productos');

const apiUsuarios= require('./api/usuarios');
const apiPedidos= require('./api/pedidos');


router.use('/productos', apiProductos);
router.use('/usuarios', apiUsuarios);
router.use('/pedidos', apiPedidos);

module.exports=router;



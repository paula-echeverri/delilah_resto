const router=require('express').Router();
const {verificar_token,validacion_usuario,validacion_admin,validacion_constrasena}=require('../middlewares');
const connection= require('../../db');
const { response } = require('express');
const sequelize=connection();




router.get('/', verificar_token,validacion_admin,async(req,res)=>{



    const myquery= `SELECT p.estado,p.hora,p.idpedido,group_concat(pr.nombre_producto separator ',') as descripcion,p.metodo_pago,SUM(pr.precio) as total_pedido,u.nombre_apellido,u.direccion FROM pedidos p 
    JOIN detalle_pedido d ON p.idpedido=d.idpedido
    JOIN usurario u ON p.idUsurario=u.idUsurario
    JOIN productos pr ON d.id_plato=pr.id_plato group by p.idpedido `


        try{

            const pedidos= await sequelize.query(myquery,{type: sequelize.QueryTypes.SELECT})
            
        res.json(pedidos);


       

    }catch (e){

        console.error(e)
    }



    

})




router.get('/mi_pedido',verificar_token, async(req,res)=>{


    const {correo}=req.query;
    const myquery=`SELECT p.estado,p.hora,p.idpedido,group_concat(pr.nombre_producto separator ',') as descripcion,p.metodo_pago,SUM(pr.precio) as total_pedido FROM pedidos p 
    JOIN detalle_pedido d ON p.idpedido=d.idpedido
    JOIN usurario u ON p.idUsurario=u.idUsurario
    JOIN productos pr ON d.id_plato=pr.id_plato
    WHERE u.correo = ?
    GROUP BY p.idpedido`

    try{

        const mi_pedido= await sequelize.query(myquery,{replacements: [correo]})


        res.json(mi_pedido[0]);


    } catch (e){

        console.log(e)

    }




})


router.put('/:idpedido',async(req,res)=>{




})

module.exports=router;
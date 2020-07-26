const router = require('express').Router();
const moment = require('moment');
const {
    verificar_token,
    validacion_admin,
    validacion_estado,
    validacion_id
} = require('../middlewares');
const connection = require('../../db');
const {
    response
} = require('express');
const sequelize = connection();





router.post('/', validacion_id, (req, res) => {

    const {
        productos
    } = req.body;

    const {
        id_pedido
    } = req;

    console.log(id_pedido);
    console.log(productos);



    for (i in productos) {

        my_query = `INSERT INTO detalle_pedido(idpedido;id_plato) VALUES (?;?)`;

        sequelize.query(my_query, ({
                replacements: [id_pedido, productos[i].id_plato]
            }))
            .then((response) => {


                res.json(response);
                console.log(response);

            }).catch((error) => {

                console.log(error);

            })

    }
})













/*router.get('/', verificar_token,validacion_admin,async(req,res)=>{*/

router.get('/', verificar_token, validacion_admin, async (req, res) => {

    const myquery = `SELECT p.estado,p.hora,p.idpedido,group_concat(pr.nombre_producto separator ',') as descripcion,p.metodo_pago,SUM(pr.precio) as total_pedido,u.nombre_apellido,u.direccion FROM pedidos p 
    JOIN detalle_pedido d ON p.idpedido=d.idpedido
    JOIN usurario u ON p.idUsurario=u.idUsurario
    JOIN productos pr ON d.id_plato=pr.id_plato group by p.idpedido `

    try {

        const pedidos = await sequelize.query(myquery, {
            type: sequelize.QueryTypes.SELECT
        })

        res.json(pedidos);


    } catch (e) {

        console.error(e)
    }


})



router.get('/mi_pedido', verificar_token, async (req, res) => {


    const {
        correo
    } = req.query;
    const myquery = `SELECT p.estado,p.hora,p.idpedido,group_concat(pr.nombre_producto separator ',') as descripcion,p.metodo_pago,SUM(pr.precio) as total_pedido FROM pedidos p 
    JOIN detalle_pedido d ON p.idpedido=d.idpedido
    JOIN usurario u ON p.idUsurario=u.idUsurario
    JOIN productos pr ON d.id_plato=pr.id_plato
    WHERE u.correo = ?
    GROUP BY p.idpedido`

    try {

        const mi_pedido = await sequelize.query(myquery, {
            replacements: [correo]
        })


        res.json(mi_pedido[0]);


    } catch (e) {

        console.log(e)

    }
})

router.put('/:idpedido', verificar_token, validacion_estado, async (req, res) => {

    const {
        idpedido
    } = req.params;
    const {
        estado
    } = req.body;
    const myquery = `UPDATE pedidos SET estado = ? WHERE idpedido  = ?`

    try {

        const pedido_actualizado = await sequelize.query(myquery, {
            replacements: [estado, idpedido]
        })


        const query = `SELECT p.estado,p.hora,p.idpedido,group_concat(pr.nombre_producto separator ',') as descripcion,p.metodo_pago,SUM(pr.precio) as total_pedido,u.nombre_apellido,u.direccion FROM pedidos p 
        JOIN detalle_pedido d ON p.idpedido=d.idpedido
        JOIN usurario u ON p.idUsurario=u.idUsurario
        JOIN productos pr ON d.id_plato=pr.id_plato group by p.idpedido `

        try {

            const pedido_detalle = await sequelize.query(query, {
                replacements: [idpedido]
            })
            res.json(pedido_detalle[0]);

        } catch (e) {

            console.log(e);
        }



    } catch (e) {

        console.log(e);
    }





})



router.delete('/:idpedido', verificar_token, validacion_admin, async (req, res) => {


    const {
        idpedido
    } = req.params;


    const myquery = ` DELETE FROM detalle_pedido WHERE idpedido=?`



    try {

        const detalle_pedido_borrado = await sequelize.query(myquery, {
            replacements: [idpedido]
        })


        const query = ` DELETE FROM pedidos WHERE idpedido=?`


        try {

            const pedido_borrado = await sequelize.query(myquery, {
                replacements: [idpedido]
            })

            res.json({
                status: 'pedido borrado'
            })




        } catch (e) {


            console.log(e)
        }




    } catch (e) {


        console.log(e);
    }




})

module.exports = router;
const router = require('express').Router();
const moment = require('moment');
const {
    verificar_token,
    validacion_admin,
    validacion_estado
    
} = require('../middlewares');
const connection = require('../../db');
const {
    response
} = require('express');
const sequelize = connection();




/* Realizar pedidos*/

router.post('/', verificar_token, async (req, res) => {
    const {
        correo
    } = req.query;
    const {
        metodo_pago,
        productos
    } = req.body;
    const hora = moment().format('LTS');
    const idUsuario = await obtenerIdUsuario(correo);
    console.log(correo, metodo_pago, hora, idUsuario);

    query = `INSERT INTO pedidos (estado, metodo_pago, hora, idUsurario) VALUES ('nuevo',?,?,?)`;
    sequelize.query(query, ({
            replacements: [metodo_pago, hora, idUsuario]
        }))
        .then((response) => {
            crearDetallePedido(response[0], productos);
            res.json({message:'El pedido se ha creado exitosamente'});
        }).catch((error) => {
            console.log(error)
        });
});

const obtenerIdUsuario = async (correo) => {
    myquery = `SELECT idUsurario FROM usurario where correo=?`;
    const usuario_id = await sequelize.query(myquery, {
        replacements: [correo]
    });
    return usuario_id[0][0].idUsurario;
};

const crearDetallePedido = (idPedido, productos) => {
    for (i in productos) {
        my_query = `INSERT INTO detalle_pedido(idpedido,id_plato) VALUES (?,?)`;
        sequelize.query(my_query, ({
            replacements: [idPedido, productos[i].id_plato]
        })).then((response) => {

            console.log(response);
        }).catch((e) => {

            console.log(e);
        })
    }
}


/* Obtener los pedidos */

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

/**Obtener el pedido del usuario */

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

/**Editar pedidos */

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

/**Borrar pedidos */

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
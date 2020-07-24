
const router=require('express').Router();
const {secreto,verificar_token,validacion_usuario,validacion_admin,validacion_constrasena}=require('../middlewares');
const connection= require('../../db');
const sequelize=connection();


router.get('/',verificar_token, async (req, res)=>{

    const query= 'SELECT * FROM productos';
    try{

        const productos= await  sequelize.query(query,{type: sequelize.QueryTypes.SELECT})
        res.json(productos);

    } catch (e){

        console.error(e)
    }
})


router.put('/:id_plato',verificar_token,validacion_admin, (req,res)=>{


const {id_plato}=req.params;
const {nombre_producto,precio}=req.body;

const myQuery=`UPDATE productos SET  nombre_producto=?, precio=?   WHERE id_plato = ?  `;

sequelize.query(myQuery,{replacements: [nombre_producto,precio,id_plato]})
.then ((data)=>{
    res.json({status:'updated'});
}).catch (e=> console.error('algo salido ', e));

});







router.delete('/:id_plato', verificar_token,validacion_admin,(req,res)=>{

const {id_plato}=req.params;
const myQuery=  `DELETE FROM productos WHERE id_plato = ? `;
sequelize.query(myQuery,{replacements:  [id_plato]})
.then ((data)=>{
    res.json({status:'deleted'});
}).catch (e=> console.error('algo salido ', e));

});


router.post('/',verificar_token,validacion_admin, (req,res)=>{

    const query='INSERT INTO productos (nombre_producto,precio) VALUES (?,?)';
    const {nombre_producto,precio}=req.body;

    sequelize.query(query,{replacements:[nombre_producto, precio]})

        .then((response)=>{

                res.json({status: 'insertado', productos: req.body})

        }).catch((e)=> console.error(e));


})

module.exports=router;
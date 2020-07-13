
const router=require('express').Router();
const connection= require('../../db');
const sequelize=connection();


router.get('/', async (req, res)=>{

    const query= 'SELECT * FROM productos';
    try{

        const productos= await  sequelize.query(query,{type: sequelize.QueryTypes.SELECT})
        res.json(productos);

    } catch (e){

        console.error(e)
    }
})


router.put('/:id_plato', (req,res)=>{


const {id_plato}=req.params;
const {nombre_producto,precio}=req.body;

const myQuery=`UPDATE productos SET  nombre_producto=?, precio=?   WHERE id_plato = ?  `;

sequelize.query(myQuery,{replacements: [nombre_producto,precio,id_plato]})
.then ((data)=>{
    res.json({status:'updated'});
}).catch (e=> console.error('algo salido ', e));

});




/*
router.put('/productos/:id', (req,res)=>{

const id=req.params.id;
const{ nombre_productos, precio }=req.body;

let producto=productos.find(elem=>{

    if(elem.id==Number(id)){

        return elem;
    }
})

if (producto){

    producto.nombre_productos=nombre_productos;
    producto.precio=precio;
    res.json(producto);
}else{

    res.status(404).json(` no puedes modificar el producto`)

}

})*/


router.delete('/:id_plato',(req,res)=>{

const {id_plato}=req.params;
const myQuery=  `DELETE FROM productos WHERE id_plato = ? `;
sequelize.query(myQuery,{replacements:  [id_plato]})
.then ((data)=>{
    res.json({status:'deleted'});
}).catch (e=> console.error('algo salido ', e));

});


router.post('/', (req,res)=>{

    const query='INSERT INTO productos (nombre_producto,precio) VALUES (?,?)';
    const {nombre_producto,precio}=req.body;

    sequelize.query(query,{replacements:[nombre_producto, precio]})

        .then((response)=>{

                res.json({status: 'insertado', productos: req.body})

        }).catch((e)=> console.error(e));


})

module.exports=router;
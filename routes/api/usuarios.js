const router=require('express').Router();
const jwt= require('jsonwebtoken');
const secreto=require('../middlewares');
const connection= require('../../db');
const sequelize=connection();


router.post('/login', (req,res)=>{

    const correo=req.query.correo;

  
    const token=jwt.sign(correo,secreto)
    res.json({token:token});
})


router.get('/registro', async (req,res)=>{

    const email=req.query.correo;


    const query= 'SELECT * FROM usurario';
    try{

        const usuarios= await  sequelize.query(query,{type: sequelize.QueryTypes.SELECT})
        res.json(usuarios);


    } catch (e){

        console.error(e)
    
    }



})


router.post('/registro',(req, res)=>{

    const query='INSERT INTO usurario (nombre_apellido, correo, telefono, direccion, usuario , contrasena, admon) VALUES (?,?,?,?,?,?,0)'
    const{nombre_apellido, correo, telefono, direccion, usuario , contrasena}=req.body;
    console.log(query);

    sequelize.query(query,{replacements:[nombre_apellido, correo, telefono, direccion, usuario , contrasena]})
    .then((response)=>{

            res.json({status: 'nuevo registro',usurario: req.body})

    }).catch((e)=>{console.error(e)})



})


module.exports=router;

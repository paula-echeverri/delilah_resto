

const jwt= require('jsonwebtoken');
const {restart} = require('nodemon');
const connection= require('../db');
const sequelize=connection();

const secreto= 'p4ul44ndre4';


const validacion_usuario=(req, res, next)=>{
    const{correo}=req.body;

    const myquery='SELECT *FROM usurario where correo=?';
    sequelize.query(myquery,{replacements:[correo]})
    .then((response)=>{
        if(response[0][0]){

            next();
        }else{

            res.status(404).json({message:'Este usuario no esta registrado'})
        }


    }).catch((error)=>{


        console.log(error);
    })




}


const validacion_admin=(req, res, next)=>{

    const {correo}=req.body;


    if(!correo){

        res.status(401).json({message: 'No olvides colocar el correo en el body'})
    }
    
    const myquery='SELECT admon FROM usurario where correo=?';
    sequelize.query(myquery,{replacements:[correo]})
    .then((response)=>{

        const admon= response[0][0].admon;
        if(admon==1){

            next();
        }else{

            res.status(404).json({message:'Solo los admon tienen acceso a esta información'})


        }

    })


}


const validacion_constrasena=(req, res, next)=>{
    const{correo, contrasena}=req.body;
    const myquery='SELECT contrasena FROM usurario where correo=?';
    sequelize.query(myquery,{replacements:[correo]})
    .then((response)=>{

        const pwd=response[0][0].contrasena;
        if(pwd==contrasena){

            next();
        }else{

            res.status(404).json({message:'Intenta nuevamente en ingresar tu contrasena o correo'})


        }


    })

}


const usuario_existente=(req,res, next)=>{


    const {correo}=req.body;

    myquery='SELECT * FROM usurario where correo=?';

    sequelize.query(myquery,{replacements:[correo]})
    .then((response)=>{


        if(response[0][0]){

                res.status(409).json({message:'Ya existe un correo asociado , Ingresa uno nuevo'})
        }

        next();
    })


    }
   




//validacion de token



const verificar_token= (req, res, next)=>{

    const token=req.header('token');

    if(!token){

        res.status(401).json({message: 'no hay un token en el requerimiento'})
    }

    try{
       
        const payload=jwt.verify(token,secreto);
        req.payload=payload;

        next();

          
         
        
    }catch(e){

        return res.status(409).json({error:'la sesion ha expirado o no tienes permiso'})

    }

}


module.exports={

    validacion_constrasena, 
    validacion_usuario,
    verificar_token,
    validacion_admin,
    usuario_existente,
    secreto
}
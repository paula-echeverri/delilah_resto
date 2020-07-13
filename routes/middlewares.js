

const jwt= require('jsonwebtoken');
const secreto= 'p4ul44ndre4';




const validacion_usuario=(req, res, next)=>{
    const{correo, contrasena}=req.body;

    const [existe_usuario]=usurario.filter(user=>{

        if(user.correo===correo&& user.contrasena===contrasena){

            return user;
        }

    })


    if(!existe_usuario){

        return res.status(409).json({error: 'Porfavor verificar usuario o contraseña'})
    }

    next();


}


//validacion de token



const verificar_token= (req, res, next)=>{

    try{

        const token=req.headers.autorization.split('')[1];
        let payload={};
        const verificar_token=jwt.verify(token,secreto);

        if (verificar_token){

            req.query.correo=verificar_token.correo;
            return next();
        }
    }catch(e){

        return res.status(409).json({error:'la sesion ha expirado o no tienes permiso'})

    }

}


module.exports={

    validacion_usuario,
    verificar_token,
    secreto
}
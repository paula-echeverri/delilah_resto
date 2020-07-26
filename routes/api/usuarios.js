const router = require('express').Router();
const jwt = require('jsonwebtoken');
const {
    secreto,
    verificar_token,
    validacion_usuario,
    validacion_admin,
    validacion_constrasena,
    usuario_existente
} = require('../middlewares');
const {
    check,
    validacion_resultado,
    validationResult
} = require('express-validator');
const connection = require('../../db');
const sequelize = connection();

/** Logeo admon y usuario*/

router.post('/login', validacion_usuario, validacion_constrasena, (req, res) => {
    const {
        correo
    } = req.body;
    const payload = {
        correo
    };
    const token = jwt.sign(payload, secreto)
    res.json({
        token
    });
})

/** Obtener  los usuarios registrados*/

router.get('/registro', verificar_token, validacion_admin, async (req, res) => {
    const email = req.query.correo;
    const query = 'SELECT * FROM usurario';
    try {
        const usuarios = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        })
        res.json(usuarios);
    } catch (e) {
        console.error(e)
    }
})

/** Registro de usuarios  */ 
router.post('/registro', [
    check('nombre_apellido', 'el nombre es obligagorio').not().isEmpty(),
    check('contrasena', 'la contraseña es obligatoria').not().isEmpty(),
    check('usuario', 'El usuario  es obligatorio').not().isEmpty(),
    check('correo', 'El correo debe ser correcto').isEmail()
], usuario_existente, (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(422).json({
            message: errores.array()
        })
    }
    const query = 'INSERT INTO usurario (nombre_apellido, correo, telefono, direccion, usuario , contrasena, admon) VALUES (?,?,?,?,?,?,0)'
    const {
        nombre_apellido,
        correo,
        telefono,
        direccion,
        usuario,
        contrasena
    } = req.body;
      console.log(query);
    sequelize.query(query, {
            replacements: [nombre_apellido, correo, telefono, direccion, usuario, contrasena]
        })
        .then((response) => {
            res.json({
                status: 'nuevo registro',
                usurario: req.body
            })
        }).catch((e) => {
            console.error(e)
        })
})

module.exports = router;

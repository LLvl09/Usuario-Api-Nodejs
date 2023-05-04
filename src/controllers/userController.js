const mongoose = require('mongoose');
const User = mongoose.model('User');
const ValidationContract = require('../validators/validationContract');
const bcrypt = require('bcrypt');
const LoginDto = require('../models/LoginDto');
const config = require('../config/config');
const jwt = require('jsonwebtoken');

exports.post = async (req, res, next) => {
    let contract = new ValidationContract();

    contract.hasMinLen(req.body.nome, 3, 'The name must contain at least 6 characters!');
    contract.hasMinLen(req.body.senha, 6, 'The password must contain at least 6 characters!');
    contract.isEmail(req.body.email, 'Your email is invalid!');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    const user = new User(req.body);

    try {
        // Verifica se o usuário já existe no banco de dados
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;

        await user.save();

        res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
}

exports.login = async (req, res, next) => {
    let contract = new ValidationContract();

    contract.isEmail(req.body.email, 'Your email is invalid');

    if (!req.body.email) {
        res.status(400).send({ message: 'O email is required!' });
    }
    if (!req.body.password) {
        res.status(400).send({ message: 'A senha is required!' });
    }

    try {
        const userLogin = new LoginDto(req.body);

        const userExist = await User.findOne({ email: userLogin.email });

        if (userExist === null) {
            res.status(404).send({ message: 'User not found' })

        }
        bcrypt.compare(userLogin.password, userExist.password, function (err, value) {
            if (value) {
                console.log(value);
            } else {
                res.status(400).send({ message: `Password don't match` });
            }
        });

        const secret = config.SECRET_TOKEN;
        const token = jwt.sign({
            id: userExist.id
        },
            secret, {
            expiresIn: 3600
        });

        res.status(200).send({ message: 'Login successfully', token: `${token}` });
    } catch (e) {
        res.status(500).send({ message: 'Failed to login the user', data: e });
    }
}

exports.private = async (req, res, next) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id, '-password');
          if (user) {
            res.status(200).send({ user });
        }
    } catch (e) {
        res.status(404).send({ message: 'User not found', data: e });
    }
    
    const checkToken = (req, res, next) => {
        const authHeader= req.headers['authorization'];
        const token = authHeader && authHeader.split(" ")[1];

        if(token === null) {
            res.status(401).send({message: 'Acess denied'});
        }
    }
}

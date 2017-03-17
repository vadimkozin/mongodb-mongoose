// Пользователи
// реализовать: Пользователи (имя) [список, добавление, редактирование, удаление]

const User = require('../models/db').UserModel;
const log = require('../libs/log')(module);

// удалить всех пользователей
exports.delAll = function(req, res, next) {
    User.remove({}, function(err, result) { 
        if(err) return log.error(err);
        res.json({result: result});
        log.info('Удаление всех пользователей, result:', result.result);
    });    
}

// добавить пользователя 
exports.addUser = function(req, res, next) {
    if (!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const user = new User({name});
    user.save(function(err) {
        if(err) return log.error(err);
        res.send(user);
        log.info("Сохранен объект user:", name);
    });
}

// вернуть всех пользователей
exports.getUsers = function(req, res, next) {
    User.find({}, function(err, docs) {
        if(err) return log.error(err);
        res.send(docs);
        log.info('Список пользователей:', JSON.stringify(docs));
    });    
}

// найти пользователя по имени. Вернет список если пользователей с заданым инемем несколько.
exports.findByName = function(req, res, next) {
    let name = req.params.name;
    if (!name) {
        return res.status(400).json({message: "Для поиска по имени нужно указать поле: name"});
    }
    User.find({name}, function(err, docs) {
        if(err) return log.error(err);
        res.send(docs);
        log.info(`Пользователь(и) по имени ${name}:`, JSON.stringify(docs));
    });      
}

// найти пользователя по id
exports.findById = function(req, res, next) {
    let id = req.params.id;
    if (!id) {
        return res.status(400).json({message: "Для поиска по id нужно указать поле: id"});
    }
    User.findById(id, function(err, user) { 
        if(err) return log.error(err);
        res.send(user);
        log.info(`Поиск пользователя по id ${id}: `, user);
    });   
}

// удаление пользователя по id
exports.delById = function(req, res, next) {
    const id = req.params.id;
    User.findByIdAndRemove(id, function(err, user) {
        if(err) return log.error(err);
        res.send(user);
        log.info(`Удаление пользователя ${id} :`, JSON.stringify(user));
    });   
}

// удаление пользователя(ей) по имени
exports.delByName = function(req, res, next) {
    const name = req.params.name;
    User.remove({name}, function(err, user) {
        if(err) return log.error(err);
        res.send(user);
        log.info(`Удаление пользователя ${name} :`, JSON.stringify(user));
    });   
}

// редактирование пользователя по id
exports.editUserById = function(req, res, next) {
    const id = req.params.id;
    const name = req.body.name;
    if (!name) {
        return res.status(400).json({message: 'Для обновления нужно указать поле: name '});
    }    
    User.findByIdAndUpdate(id, {name: name}, function(err, user) {
        if(err) return log.error(err);
        res.send(user);
        log.info("Обновленный объект", user);
    });  
}

// редактирование пользователя по имени. Если пользователей с тактм именем несколько, то обновит всех.
exports.editUserByName = function(req, res, next) {
    const name = req.params.name;
    const newName = req.body.name;
    if (!( name || newName)) {
        return res.status(400).json({message: 'Для обновления нужно указать старое и новое имя'});
    }    
    User.update({name: name}, {name: newName}, function(err, result) { 
        if(err) return log.info(err);
        res.send(result.result);
        log.error(result);
    }); 
}

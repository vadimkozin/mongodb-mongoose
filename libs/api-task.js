// Задачи
// реализовать:
//   Задачи (название, описание, открыта/закрыта, пользователь) [список, добавление, редактирование, удаление];
//   Задачу можно открыть/закрывать, делегировать на пользователя;
//   Поиск по названию и описанию задач.

const Task = require('../models/db').TaskModel;
const log = require('../libs/log')(module);

// удалить все задачи
exports.delAll = function(req, res, next) {
    Task.remove({}, function(err, result) { 
        if(err) return log.error(err);
        res.json({result: result});
        log.info('Удаление всех задач, result:', result.result);
    });    
}

// добавить задачу 
exports.addTask = function(req, res, next) {
    if (!req.body) return res.sendStatus(400);
    const newTask = {};
    if (req.body.name) newTask.name = req.body.name;
    if (req.body.desc) newTask.desc = req.body.desc;
    if (req.body.open) newTask.open = req.body.open;
    if (req.body.userId) newTask.userId = req.body.userId;
         
    Task.create(newTask, function(err) {
        if(err)  { 
            res.send(err);
            return log.error(err);
        }
        res.send(newTask);
        log.info("Сохранен объект task:", newTask);
    });
}

// вернуть всех задачи
exports.getTasks = function(req, res, next) {
    Task.find({}, function(err, docs) {
        if(err) return log.error(err);
        res.send(docs);
        log.info('Список задач:', JSON.stringify(docs));
    });    
}

// редактирование задачи по имени
exports.editTaskByName = function(req, res, next) {
    const name = req.params.name;
    const newTask = getTaskParams(req);

    Task.update({name: name}, newTask, function(err, result) { 
        if(err) return log.info(err);
        res.send(result);
        log.info(`Обновление задачи ${name}, result:`, result);
    }); 
}

// редактирование задачи по id
exports.editTaskById = function(req, res, next) {
    const id = req.params.id;
    const newTask = getTaskParams(req);

    Task.findByIdAndUpdate(id, newTask, {new: true}, function(err, result) { 
        if(err) return log.info(err);
        res.send(result);
        log.info(`Обновление задачи ${id}, result:`, result);
    }); 
}

// удаление задачи по id
exports.delById = function(req, res, next) {
    const id = req.params.id;
    Task.findByIdAndRemove(id, function(err, task) {
        if(err) return log.error(err);
        res.send(task);
        log.info(`Удаление задачи ${id} :`, JSON.stringify(task));
    });   
}

// удаление задачи по имени
exports.delByName = function(req, res, next) {
    const name = req.params.name;
    Task.remove({name}, function(err, task) {
        if(err) return log.error(err);
        res.send(task);
        log.info(`Удаление задачи ${name} :`, JSON.stringify(task));
    });   
}

// найти задачу по id
exports.findById = function(req, res, next) {
    let id = req.params.id;
    Task.findById(id, function(err, task) { 
        if(err) return log.error(err);
        res.send(task);
        log.info(`Поиск задачи по id ${id}: `, task);
    });   
}

// найти задачу по имени
exports.findByName = function(req, res, next) {
    let name = req.params.name;
    Task.find({name}, function(err, docs) {
        if(err) return log.error(err);
        res.send(docs);
        log.info(`Поиск задачи по имени ${name}:`, JSON.stringify(docs));
    });      
}

// найти задачу по описанию
exports.findByDesc = function(req, res, next) {
    let desc = req.params.desc;
    const re_desc = new RegExp('^.*' + desc + '.*$', 'i');
    Task.find({desc: re_desc}, function(err, docs) {
        if(err) return log.error(err);
        res.send(docs);
        log.info(`Поиск задачи по описанию ${desc}:`, JSON.stringify(docs));
    });      
}

// открыть задачу
exports.openTask = function(req, res, next) {
    doTask(req, res, 'open');
}

// закрыть задачу
exports.closeTask = function(req, res, next) {
    doTask(req, res, 'close');
}

// делегирование задачи на пользователя
exports.delegateTaskOnUser = function(req, res, next) {
    const name = req.params.name;
    const userId = req.params.id;
    Task.update({name}, {userId}, function(err, result) { 
        if(err) return log.info(err);
        res.send(result);
        log.info(`Делегирование задачи ${name} на пользователя ${userId}, result:`, result);
    }); 
}

// возвращает заполненный объект параметрами из тела запроса для задачи 
function getTaskParams(req) {
    const obj = {};
    if (req.body.name) obj.name = req.body.name;
    if (req.body.desc) obj.desc = req.body.desc;
    if (req.body.open) obj.open = req.body.open; 
    if (req.body.userId) obj.userId = req.body.userId;
    return obj;     
}

// изменения состояния задачи: открыта/закрыта
function doTask(req, res, status) {
    const name = req.params.name;
    let msg = "";
    
    switch (status)  {
        case "open": bOpen = true; msg = "Открытие"; break;
        case "close": bOpen = false; msg = "Закрытие"; break;
        default: bOpen = false; msg = "Закрытие(default)";
    }

    Task.update({name: name}, {open: bOpen}, function(err, result) { 
        if(err) return log.info(err);
        res.send(result);
        log.info(`${msg} задачи ${name}, result:`, result);
    }); 
}

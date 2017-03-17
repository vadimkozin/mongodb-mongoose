/*
Основное задание:

Создать приложение на Express.js «Список задач» используя библиотеку mongoose в виде API:

Пользователи (имя) [список, добавление, редактирование, удаление];
Задачи (название, описание, открыта/закрыта, пользователь) [список, добавление, редактирование, удаление];
Задачу можно открыть/закрывать, делегировать на пользователя;
Поиск по названию и описанию задач.

*/
const express = require("express");
const bodyParser = require("body-parser");
const config = require('./libs/config');
const user = require('./libs/api-user');
const task = require('./libs/api-task');
const app = express();
const log = require('./libs/log')(module);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true})); 

// ПОЛЬЗОВАТЕЛИ
// Инициализация (удалим всех пользователей)
app.delete("/api/users/delete", user.delAll);
// добавить пользователя 
app.post("/api/users", user.addUser);
// вернуть всех пользователей
app.get("/api/users", user.getUsers);
// найти пользователя(ей) по имени
app.get("/api/users/name/:name", user.findByName);
// найти пользователя по id
app.get("/api/users/id/:id", user.findById);
// удаление пользователя по id
app.delete("/api/users/id/:id", user.delById);
// удаление пользователя(ей) по имени
app.delete("/api/users/name/:name", user.delByName);
// редактирование пользователя по id
app.put("/api/users/id/:id", user.editUserById);
// редактирование пользователя(ей) по имени
app.put("/api/users/name/:name", user.editUserByName);

// ЗАДАЧИ
// Инициализация (удалим все задачи)
app.delete("/api/tasks/delete", task.delAll);
// добавить задачу
app.post("/api/tasks", task.addTask);
// вернуть все задачи
app.get("/api/tasks", task.getTasks);
// редактирование задачи по имени
app.put("/api/tasks/name/:name", task.editTaskByName);
// удаление задачи по id
app.delete("/api/tasks/id/:id", task.delById);
// удаление задачи по имени
app.delete("/api/tasks/name/:name", task.delByName);
// найти задачу по имени
app.get("/api/tasks/name/:name", task.findByName);
// найти задачу по id
app.get("/api/tasks/id/:id", task.findById);
// найти задачу по описанию
app.get("/api/tasks/desc/:desc", task.findByDesc);
// открыть/закрыть задачу
app.put("/api/tasks/name/:name/open", task.openTask);
app.put("/api/tasks/name/:name/close", task.closeTask);
// делегировать задачу на пользователя
app.put("/api/tasks/name/:name/userid/:id", task.delegateTaskOnUser);

app.all('*', (req, res) => {
    const msg = 'Некорректный запрос: ' +  req.path; 
    res.status(400).send(msg);
    log.info(msg);
});

app.use((err, req, res, next) => {   
    log.error(err);
    res.json(err);
});

app.set('port', process.env.PORT || config.get('port') || 3000);

app.listen(app.get('port'), function() {
    log.info("Server listened at port %d", app.get('port'));
});

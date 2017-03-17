// схемы, модели, подключение к базе

const config = require('../libs/config');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const objectId = require('mongodb').ObjectID;
const log = require('../libs/log')(module);

mongoose.connect(config.get('mongoose:uri'));
const db = mongoose.connection;

db.on('error', function (err) { log.error('connection error:', err.message);}); 
db.once('open', function callback () { log.info("Connected to DB!"); });

const Schema = mongoose.Schema;

// схемы
const User = new Schema ({
    name : {
        type: String,
        required: true
    }},
    {versionKey: false}
);

const Task = new Schema ({
    name: {
        type: String,
        unique: true,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    open: {
        type: Boolean,
        default: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        default: new objectId(0)
        
    }},
    {versionKey: false}
);

// модели
const UserModel = mongoose.model('User', User);
const TaskModel = mongoose.model('Task', Task);

module.exports.UserModel = UserModel;
module.exports.TaskModel = TaskModel;


const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const MO = require('method-override');
const session = require('express-session');

const socketio = require('socket.io');

const app = express();
const taskRoutes = require('./routes/task_routes');
const regsRoutes = require('./routes/reg_routes');
const sessionsRoutes = require('./routes/sessions_routes');
const findUser= require('./middlewares/find_user');
const authUser = require('./middlewares/auth_user');
const catRoutes = require('./routes/categories_routes');

app.use(bodyParser.urlencoded({extended:true}));
app.use(MO('_method'));
app.set('view engine','pug');

app.use(session({
    secret: ['123', '2345'],
    saveUninitialized: false,
    resave: false
}));
app.use(findUser);
app.use(authUser);
app.use(taskRoutes);
app.use(regsRoutes);
app.use(sessionsRoutes);
app.use(catRoutes);

app.get('/', function(req, res){
    res.render('home', {user: req.user});
});

let server = app.listen(process.env.PORT || 3000);
let io = socketio(server);
let sockets = {};

let userCount = 0;
io.on('connection', function(socket){
    let userId = socket.request._query.loggeduser;
    if (userId) sockets[userId] = socket;
    
    userCount++;

    io.emit('count_updated',{count: userCount});

    socket.on('new_task', function(data){
        if (data.userId){
            let userSocket = sockets[data.userId];
            if (!userSocket) return;

            userSocket.emit('new_task', data);
        }
        io.emit('new_task', data);
    });

    socket.on('disconnect', function(){
        Object.keys(sockets).forEach(userId=>{
            let s = sockets[userId];
            if (s.id == socket.id) sockets[userId] = null;
        });
        
        userCount--;
        io.emit('count_updated',{count: userCount});
    });
});

const client = require('./realtime/client');
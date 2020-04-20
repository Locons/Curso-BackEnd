const Task = require('../models').Task;
const User = require('../models').User;

module.exports = {
    index: function(req, res){
        Task.findAll().then(tasks => {
            res.render('tasks/index', {tasks: req.user.tasks});
        })
    },
    show: function(req, res){
        Task.findByPk(req.params.id,{
            include: [
                {
                    model: User,
                    as: 'user'
                },
                'categories'
            ]
        }).then(function(task){
            res.render('tasks/show', {task});
        })
    },
    create: function(req, res){
        Task.create({
            des: req.body.des,
            userId: req.user.id
        }).then(result => {
            res.json(result);
        }).catch(err => {
            res.json(err);
        })
    },
    new: function(req, res){
        res.render('tasks/new');
    },
    update: function(req, res){
        let task = Task.findByPk(req.params.id).then(task=>{
            task.des = req.body.des;
            task.save().then(()=>{
                let catId = req.body.categories.split(",");

                task.addCategories(catId).then(()=>{
                    res.redirect(`/tasks/${task.id}`);
                })
            })
        })
    },
    edit: function(req, res){
        Task.findByPk(req.params.id).then(function(task){
            res.render('tasks/edit', {task});
        })
    },
    destroy: function(req, res){
        Task.destroy({
            where: {
                id: req.params.id
            }
        }).then(function(elim){
            res.redirect('/tasks');
        })
    }
};
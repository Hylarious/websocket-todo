const express = require('express');
const socket = require('socket.io');

const app = express()

const tasks = []

const server = app.listen(8000, () => {
    console.log("Server running on port: 8000");
})

const io = socket(server);


io.on('connection', (socket) => {
    console.log("New user! I'm sending tasks");
    socket.emit('updateData', tasks);
    socket.on('addTask', (task) => {
        console.log('I got new task');
        tasks.push(task);
        socket.broadcast.emit('updateData', tasks)
    });
    socket.on('removeTask', (rTask) => {
        const i = tasks.findIndex(task => {
            return task.id === rTask.id
        });
        tasks.splice(i, 1)
        console.log('Task removed');
        socket.broadcast.emit('updateData', tasks)
    })
})

app.use((req, res) => {
    res.status(404).send({ message: 'Not found'})
})
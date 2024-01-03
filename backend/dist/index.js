"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IoManager_1 = require("./managers/IoManager");
const io = IoManager_1.IoManager.getIo();
io.listen(3000);
io.on('connection', client => {
    client.on('event', data => {
        console.log(data);
    });
    client.on('disconnect', () => {
    });
});

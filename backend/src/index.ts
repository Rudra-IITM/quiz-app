import http from 'http';
import { Server } from 'socket.io';
import { IoManager } from './managers/IoManager';

const io = IoManager.getIo();

io.listen(3000);

io.on('connection', client => {
  client.on('event', data => { 
    console.log(data);
   });
  client.on('disconnect', () => { 

   });
});

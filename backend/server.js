require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const noteRoutes = require('./routes/notes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use('/notes', noteRoutes);

mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Socket.IO Logic
const activeUsers = {}; // { noteId: Set<socket.id> }

io.on('connection', (socket) => {
  socket.on('join_note', (noteId) => {
    socket.join(noteId);
    if (!activeUsers[noteId]) activeUsers[noteId] = new Set();
    activeUsers[noteId].add(socket.id);
    io.to(noteId).emit('active_users', activeUsers[noteId].size);
    socket.noteId = noteId;
  });

  socket.on('note_update', ({ noteId, content }) => {
    socket.to(noteId).emit('note_update', content);
  });

  socket.on('leave_note', (noteId) => {
    if (noteId && activeUsers[noteId]) {
      activeUsers[noteId].delete(socket.id);
      if (activeUsers[noteId].size === 0) {
        delete activeUsers[noteId];
      } else {
        io.to(noteId).emit('active_users', activeUsers[noteId].size);
      }
}
  });

  socket.on('disconnect', () => {
    const noteId = socket.noteId;
    if (noteId && activeUsers[noteId]) {
      activeUsers[noteId].delete(socket.id);
      io.to(noteId).emit('active_users', activeUsers[noteId].size);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
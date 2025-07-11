<<<<<<< HEAD
# collab-notes
Collab Notes Real-time collaborative note-taking app built with React, Node.js, Express, MongoDB, and Socket.IO.  Create and share note rooms for instant multi-user editing Live updates and auto-save Rich text/Markdown support See active collaborators Note version history No login required—just share the note link and start collaborating!
=======
# Collab Notes

A real-time collaborative note-taking app using Node.js, Express, MongoDB, Socket.IO, and React.

## Features
- Create shared note rooms
- Real-time editing with live sync across clients
- Notes persist in MongoDB
- See active collaborators
- Auto-save every 5 seconds

## Getting Started

### 1. Clone the repo
```
git clone <your-repo-url>
cd collab-notes
```

### 2. Setup environment variables
Copy `.env.example` to `.env` and fill in your MongoDB URI if needed.

### 3. Install dependencies
```
cd backend
npm install
cd ../frontend
npm install
```

### 4. Run the backend
```
cd ../backend
npm start
```

### 5. Run the frontend
```
cd ../frontend
npm start
```

### 6. Open in browser
Go to `http://localhost:3000`

## API Endpoints
- `POST /notes` - Create a new note
- `GET /notes/:id` - Fetch note by ID
- `PUT /notes/:id` - Update note content

## WebSocket Events
- `join_note` - Join a note room
- `note_update` - Broadcast live content changes
- `active_users` - Notify when users join/leave
- `leave_note` - Leave a note room

## Bonus Features
- Last updated time
- Active collaborators

## License
MIT
>>>>>>> 366e887 (Initial commit)

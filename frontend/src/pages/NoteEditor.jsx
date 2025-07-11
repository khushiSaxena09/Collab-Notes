import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getNote, updateNote } from "../api";
import ReactMarkdown from "react-markdown";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL || "http://localhost:5000");

export default function NoteEditor() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [activeUsers, setActiveUsers] = useState(1);
  const timeoutRef = useRef();

  useEffect(() => {
    getNote(id).then((res) => {
      setNote(res.data);
      setContent(res.data.content);
      setLastUpdated(res.data.updatedAt);
    });
    socket.emit("join_note", id);
    socket.on("note_update", (newContent) => {
      setContent(newContent);
    });
    socket.on("active_users", setActiveUsers);
    return () => {
      socket.off("note_update");
      socket.off("active_users");
      socket.emit("leave_note", id);
    };
  }, [id]);

  const handleChange = ({ text }) => {
    setContent(text);
    socket.emit("note_update", { noteId: id, content: text });
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      updateNote(id, text).then((res) => setLastUpdated(res.data.updatedAt));
    }, 5000);
  };

  const handleSave = async () => {
    const res = await updateNote(id, content);
    setLastUpdated(res.data.updatedAt);
  };

  if (!note)
    return (
      <div
        className="main-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.5em",
        }}
      >
        Loading...
      </div>
    );

  return (
    <div
      className="main-container"
      style={{
        maxWidth: 700,
        margin: "40px auto",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        padding: 32,
        fontFamily: "Segoe UI, Arial, sans-serif",
      }}
    >
      <h2 style={{ marginBottom: 16, color: "#2d3748" }}>{note.title}</h2>
      <div
        className="status-bar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          background: "#f7fafc",
          padding: "8px 16px",
          borderRadius: 8,
          fontSize: "1em",
          color: "#4a5568",
        }}
      >
        <span>
          Active collaborators: <b>{activeUsers}</b>
        </span>
        <span>
          Last updated:{" "}
          <b>{new Date(lastUpdated).toLocaleString()}</b>
        </span>
      </div>
      <MdEditor
        value={content}
        style={{
          height: "400px",
          borderRadius: 8,
          border: "1px solid #e2e8f0",
          marginBottom: 16,
        }}
        renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
        onChange={handleChange}
      />
      <button
        onClick={handleSave}
        style={{
          marginTop: "1em",
          padding: "10px 24px",
          background: "#3182ce",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontWeight: 500,
          fontSize: "1em",
          cursor: "pointer",
          boxShadow: "0 1px 4px rgba(49,130,206,0.12)",
        }}
      >
        Save
      </button>
    </div>
  );
}
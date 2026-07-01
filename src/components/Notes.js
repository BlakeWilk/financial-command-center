import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateId, today } from '../utils/helpers';
import Header from './Header';

export default function Notes() {
  const { notes, setNotes } = useApp();
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);

  const addNote = () => {
    if (!text.trim()) return;
    setNotes(prev => [{
      id: generateId(),
      text: text.trim(),
      date: today(),
      createdAt: new Date().toISOString(),
    }, ...prev]);
    setText('');
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setText(note.text);
  };

  const saveEdit = () => {
    if (!text.trim() || !editingId) return;
    setNotes(prev => prev.map(n =>
      n.id === editingId ? { ...n, text: text.trim(), editedAt: new Date().toISOString() } : n
    ));
    setEditingId(null);
    setText('');
  };

  return (
    <div className="page">
      <Header />
      <div className="page-content">
        <h2>📝 Notes</h2>

        {/* Input */}
        <div className="card note-input">
          <textarea
            placeholder="Write a note... (financial tip, idea, reminder)"
            value={text}
            onChange={e => setText(e.target.value)}
            rows={3}
          />
          <button
            className="btn primary"
            onClick={editingId ? saveEdit : addNote}
            disabled={!text.trim()}
          >
            {editingId ? 'Save' : 'Add Note'}
          </button>
          {editingId && (
            <button className="btn small" onClick={() => { setEditingId(null); setText(''); }}>
              Cancel
            </button>
          )}
        </div>

        {/* Notes List */}
        {notes.length === 0 ? (
          <div className="empty-state">
            <p>No notes yet</p>
          </div>
        ) : (
          notes.map(note => (
            <div key={note.id} className="card note-item">
              <p className="note-text">{note.text}</p>
              <div className="note-footer">
                <span className="note-date">{note.date}</span>
                <div className="note-actions">
                  <button className="btn small" onClick={() => startEdit(note)}>✏️</button>
                  <button className="btn small danger" onClick={() => deleteNote(note.id)}>🗑️</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
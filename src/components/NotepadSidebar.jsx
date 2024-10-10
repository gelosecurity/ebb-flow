import React, { useState, useEffect } from 'react';
import './NotepadSidebar.css';

const NotepadSidebar = ({ isOpen, onToggle }) => {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const savedNotes = localStorage.getItem('notepadContent');
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  const handleNotesChange = (event) => {
    const newNotes = event.target.value;
    setNotes(newNotes);
    localStorage.setItem('notepadContent', newNotes);
  };

  return (
    <div className={`notepad-sidebar ${isOpen ? 'open' : ''}`}>
      <button onClick={onToggle} title="Toggle Notepad">
        <i className="fas fa-sticky-note"></i>
      </button>
      <div className="notepad-content">
        <h4>Notes</h4>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Write your analysis here..."
        />
      </div>
    </div>
  );
};

export default NotepadSidebar;
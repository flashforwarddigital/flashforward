import React, { useState } from 'react';
import { Note } from '../AdminPage'; // Assuming Note interface is exported
import { supabase } from '../../lib/supabase';

interface NotesListProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  currentUserId: string | null;
}

const NotesList: React.FC<NotesListProps> = ({ notes, setNotes, currentUserId }) => {
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newNote.title.trim() && !newNote.content.trim()) || !currentUserId) return;
    
    setIsAdding(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from('notes')
        .insert({
          title: newNote.title.trim() || null,
          content: newNote.content.trim() || null,
          user_id: currentUserId
        })
        .select()
        .single();

      if (insertError) throw insertError;
      if (data) {
        setNotes(prev => [...prev, data]);
        setNewNote({ title: '', content: '' });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add note');
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote) return;
    
    setIsAdding(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('notes')
        .update({
          title: editingNote.title,
          content: editingNote.content
        })
        .eq('id', editingNote.id);

      if (updateError) throw updateError;
      
      setNotes(prev => prev.map(note => 
        note.id === editingNote.id ? editingNote : note
      ));
      setEditingNote(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update note');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      setNotes(prev => prev.filter(note => note.id !== id));
      if (editingNote?.id === id) {
        setEditingNote(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-light mb-4 tracking-tight">Notes</h3>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded text-sm">
          {error}
        </div>
      )}

      {editingNote ? (
        <form onSubmit={handleUpdateNote} className="space-y-4 bg-black/20 p-4 rounded">
          <div>
            <label className="block text-sm font-light mb-2 tracking-tight">
              Title
            </label>
            <input
              type="text"
              value={editingNote.title || ''}
              onChange={(e) => setEditingNote({...editingNote, title: e.target.value})}
              placeholder="Note title"
              className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-light mb-2 tracking-tight">
              Content
            </label>
            <textarea
              value={editingNote.content || ''}
              onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
              placeholder="Note content"
              rows={4}
              className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-[#0CF2A0] text-black px-4 py-2 rounded transition-colors hover:bg-[#07C280] disabled:opacity-50"
              disabled={isAdding}
            >
              {isAdding ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => setEditingNote(null)}
              className="bg-gray-700 text-white px-4 py-2 rounded transition-colors hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleAddNote} className="space-y-4 bg-black/20 p-4 rounded">
          <div>
            <label className="block text-sm font-light mb-2 tracking-tight">
              Title
            </label>
            <input
              type="text"
              value={newNote.title}
              onChange={(e) => setNewNote({...newNote, title: e.target.value})}
              placeholder="Note title"
              className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
              disabled={isAdding || !currentUserId}
            />
          </div>
          <div>
            <label className="block text-sm font-light mb-2 tracking-tight">
              Content
            </label>
            <textarea
              value={newNote.content}
              onChange={(e) => setNewNote({...newNote, content: e.target.value})}
              placeholder="Note content"
              rows={4}
              className="w-full px-4 py-2 bg-black border border-gray-800 rounded text-white focus:outline-none focus:border-[#0CF2A0] transition-colors"
              disabled={isAdding || !currentUserId}
            />
          </div>
          <button
            type="submit"
            className="bg-[#0CF2A0] text-black px-4 py-2 rounded transition-colors hover:bg-[#07C280] disabled:opacity-50"
            disabled={isAdding || (!newNote.title.trim() && !newNote.content.trim()) || !currentUserId}
          >
            {isAdding ? 'Adding...' : 'Add Note'}
          </button>
        </form>
      )}

      <div className="space-y-4 mt-6">
        {notes.length === 0 ? (
          <div className="text-center text-gray-400 py-4">
            No notes yet. Add one to get started.
          </div>
        ) : (
          notes.map((note) => (
            <div 
              key={note.id} 
              className="p-4 bg-black/20 rounded"
            >
              {note.title && (
                <h4 className="text-[#0CF2A0] font-light mb-2">{note.title}</h4>
              )}
              {note.content && (
                <p className="text-gray-300 whitespace-pre-wrap mb-3">{note.content}</p>
              )}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setEditingNote(note)}
                  className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-red-400 hover:text-red-300 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Created: {new Date(note.created_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesList;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import NoteDetail from './NoteDetail';
export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await API.get('/notes/');
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const saveNote = async (note) => {
    try {
      await API.post('/notes/', note);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await API.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };
  const allTags = [...new Set(notes.flatMap(n => n.tags || []))];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase());
    const matchesTag = activeTag ? note.tags?.includes(activeTag) : true;
    return matchesSearch && matchesTag;
  });
  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>📚 StudySync</h1>
        <div style={styles.right}>
          <span style={styles.username}>Hello, {username}!</span>
          <button style={styles.logout} onClick={logout}>Logout</button>
        </div>
      </div>
      <div style={styles.body}>
        <NoteEditor onSave={saveNote} />
        <input
          style={styles.search}
          placeholder="🔍 Search notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {allTags.length > 0 && (
          <div style={styles.tagFilter}>
          <span
            style={{...styles.tagBtn, background: activeTag === '' ? '#4f46e5' : '#e5e7eb', color: activeTag === '' ? 'white' : '#333'}}
            onClick={() => setActiveTag('')}>
            All
          </span>
          {allTags.map((tag, i) => (
            <span
             key={tag}
             style={{...styles.tagBtn, background: activeTag === tag ? '#4f46e5' : '#e5e7eb', color: activeTag === tag ? 'white' : '#333'}}
             onClick={() => setActiveTag(activeTag === tag ? '' : tag)}>
             {tag}
            </span>
          ))}
       </div>
      )}
        {filteredNotes.length === 0 ? (
          <p style={styles.empty}>No notes yet — create your first one above! 👆</p>
        ) : (
          <div style={styles.grid}>
           {filteredNotes.map(note => (
             <NoteCard key={note._id} note={note} onDelete={deleteNote} onClick={() => setSelectedNote(note)} />
          ))}
          </div>
         )}
          {selectedNote && <NoteDetail note={selectedNote} onClose={() => setSelectedNote(null)} />}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight:'100vh', background:'#f0f2f5' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 32px', background:'white', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' },
  logo: { color:'#4f46e5', margin:0 },
  right: { display:'flex', alignItems:'center', gap:'16px' },
  username: { color:'#333', fontWeight:'500' },
  logout: { padding:'8px 16px', background:'#ef4444', color:'white', border:'none', borderRadius:'8px', cursor:'pointer' },
  body: { maxWidth:'800px', margin:'0 auto', padding:'32px 16px' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'16px' },
  empty: { textAlign:'center', color:'#888', marginTop:'40px' },
  search: { width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px', marginBottom:'24px', boxSizing:'border-box', color:'#333', backgroundColor:'white' },
  tagFilter: { display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'24px' },
  tagBtn: { padding:'6px 16px', borderRadius:'20px', fontSize:'13px', fontWeight:'600', cursor:'pointer' },
};
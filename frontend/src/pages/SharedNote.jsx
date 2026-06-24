import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function SharedNote() {
  const { token } = useParams();
  const [note, setNote] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/api/notes/view/${token}`)
      .then(res => setNote(res.data))
      .catch(() => setError('Note not found or link is invalid.'));
  }, [token]);

  if (error) return <div style={styles.center}><h2>{error}</h2></div>;
  if (!note) return <div style={styles.center}><h2>Loading...</h2></div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.badge}>📖 Shared Note</div>
        <h1 style={styles.title}>{note.title}</h1>
        <p style={styles.date}>{note.created_at}</p>
        <p style={styles.content}>{note.content}</p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight:'100vh', background:'#f0f2f5', display:'flex', justifyContent:'center', padding:'40px 16px' },
  card: { background:'white', borderRadius:'16px', padding:'40px', width:'100%', maxWidth:'700px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', height:'fit-content' },
  badge: { background:'#ede9fe', color:'#4f46e5', padding:'6px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:'600', display:'inline-block', marginBottom:'16px' },
  title: { color:'#333', fontSize:'28px', margin:'0 0 8px 0' },
  date: { color:'#aaa', fontSize:'13px', marginBottom:'24px' },
  content: { color:'#444', fontSize:'16px', lineHeight:'1.8', whiteSpace:'pre-wrap' },
  center: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }
};
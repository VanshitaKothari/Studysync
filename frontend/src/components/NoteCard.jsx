const TAG_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function NoteCard({ note, onDelete, onClick }) {
  return (
    <div style={styles.card} onClick={onClick}>
      <div style={styles.header}>
        <h3 style={styles.title}>{note.title}</h3>
        <button style={styles.delete} onClick={(e) => { e.stopPropagation(); onDelete(note._id); }}>🗑️</button>
      </div>
      <p style={styles.content}>{note.content}</p>
      {note.tags && note.tags.length > 0 && (
        <div style={styles.tagRow}>
          {note.tags.map((tag, i) => (
            <span key={tag} style={{...styles.tag, background: TAG_COLORS[i % TAG_COLORS.length]}}>
              {tag}
            </span>
          ))}
        </div>
      )}
      <span style={styles.date}>{note.created_at}</span>
    </div>
  );
}

const styles = {
  card: { background:'white', borderRadius:'12px', padding:'20px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', display:'flex', flexDirection:'column', gap:'8px', overflow:'hidden', cursor:'pointer' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  title: { margin:0, color:'#333', fontSize:'16px', fontWeight:'600', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' },
  delete: { background:'none', border:'none', cursor:'pointer', fontSize:'16px', flexShrink:0 },
  content: { margin:0, color:'#666', fontSize:'14px', lineHeight:'1.5', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:4, WebkitBoxOrient:'vertical', wordBreak:'break-word' },
  tagRow: { display:'flex', flexWrap:'wrap', gap:'6px' },
  tag: { padding:'3px 10px', borderRadius:'20px', color:'white', fontSize:'11px', fontWeight:'600' },
  date: { color:'#aaa', fontSize:'12px' }
};
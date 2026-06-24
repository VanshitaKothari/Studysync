import { useState } from 'react';

const TAG_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function NoteEditor({ onSave }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = () => {
    if (!content.trim()) return;
    onSave({ title: title || 'Untitled', content, tags });
    setTitle('');
    setContent('');
    setTags([]);
  };

  return (
    <div style={styles.container}>
      <input
        style={styles.titleInput}
        placeholder="Note title..."
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        style={styles.textarea}
        placeholder="Write your note here..."
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={4}
      />
      <div style={styles.tagRow}>
        {tags.map((tag, i) => (
          <span key={tag} style={{...styles.tag, background: TAG_COLORS[i % TAG_COLORS.length]}}>
            {tag} <span style={styles.removeTag} onClick={() => removeTag(tag)}>x</span>
          </span>
        ))}
        <input
          style={styles.tagInput}
          placeholder="Add tag + Enter..."
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          onKeyDown={addTag}
        />
      </div>
      <button style={styles.button} onClick={handleSave}>Save Note</button>
    </div>
  );
}

const styles = {
  container: { background:'white', borderRadius:'12px', padding:'20px', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', marginBottom:'24px' },
  titleInput: { width:'100%', padding:'10px', marginBottom:'12px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'15px', fontWeight:'600', boxSizing:'border-box', color:'#333', backgroundColor:'white' },
  textarea: { width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px', resize:'vertical', boxSizing:'border-box', color:'#333', backgroundColor:'white', fontFamily:'inherit' },
  tagRow: { display:'flex', flexWrap:'wrap', gap:'8px', alignItems:'center', margin:'12px 0' },
  tag: { padding:'4px 10px', borderRadius:'20px', color:'white', fontSize:'12px', fontWeight:'600', cursor:'pointer' },
  removeTag: { marginLeft:'4px', cursor:'pointer' },
  tagInput: { border:'1px dashed #ddd', borderRadius:'20px', padding:'4px 12px', fontSize:'12px', color:'#333', outline:'none', backgroundColor:'white' },
  button: { marginTop:'4px', padding:'10px 24px', background:'#4f46e5', color:'white', border:'none', borderRadius:'8px', fontSize:'14px', cursor:'pointer', fontWeight:'600' }
};
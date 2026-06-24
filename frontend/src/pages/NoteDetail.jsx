import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function NoteDetail({ note, onClose }) {
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [quizDone, setQuizDone] = useState(false);

  const generateShareLink = async () => {
    try {
      const res = await API.post(`/notes/share/${note._id}`);
      const link = `${window.location.origin}/shared/${res.data.share_token}`;
      setShareLink(link);
    } catch (err) {
      console.error(err);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateFlashcards = () => {
    const lines = note.content.split('\n').filter(l => l.trim());
    const cards = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.toLowerCase().startsWith('q:')) {
        const question = line.substring(2).trim();
        const next = lines[i + 1]?.trim();
        const answer = next?.toLowerCase().startsWith('a:') ? next.substring(2).trim() : 'No answer provided';
        cards.push({ question, answer });
        i++;
      }
    }
    if (cards.length === 0) {
      alert('No flashcards found! Write Q: and A: lines in your note.\n\nExample:\nQ: What is Python?\nA: A high-level programming language');
      return;
    }
    setFlashcards(cards);
    setShowFlashcards(true);
    setCurrentCard(0);
    setFlipped(false);
    setScore({ correct: 0, wrong: 0 });
    setQuizDone(false);
  };

  const handleAnswer = (correct) => {
    const newScore = correct
      ? { ...score, correct: score.correct + 1 }
      : { ...score, wrong: score.wrong + 1 };
    setScore(newScore);
    if (currentCard + 1 >= flashcards.length) {
      setQuizDone(true);
    } else {
      setCurrentCard(currentCard + 1);
      setFlipped(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>{note.title}</h2>
          <button style={styles.close} onClick={onClose}>✕</button>
        </div>
        <p style={styles.date}>{note.created_at}</p>

        {!showFlashcards ? (
          <>
            <p style={styles.content}>{note.content}</p>
            <div style={styles.actions}>
              <button style={styles.btnPurple} onClick={generateFlashcards}>
                🃏 Flashcard Quiz
              </button>
              <p style={{fontSize:'12px', color:'#888', margin:'8px 0 0 0'}}>
                💡 Write Q: and A: lines in your note to generate flashcards
              </p>
              <button style={styles.btnGreen} onClick={generateShareLink}>
                🔗 Share Note
              </button>
            </div>
            {shareLink && (
              <div style={styles.shareBox}>
                <input style={styles.shareInput} value={shareLink} readOnly />
                <button style={styles.btnCopy} onClick={copyLink}>
                  {copied ? '✅ Copied!' : 'Copy'}
                </button>
              </div>
            )}
          </>
        ) : quizDone ? (
          <div style={styles.result}>
            <h3>Quiz Complete! 🎉</h3>
            <p style={{color:'#22c55e', fontSize:'18px'}}>✅ Correct: {score.correct}</p>
            <p style={{color:'#ef4444', fontSize:'18px'}}>❌ Wrong: {score.wrong}</p>
            <p style={{fontSize:'16px'}}>Score: {Math.round((score.correct / flashcards.length) * 100)}%</p>
            <button style={styles.btnPurple} onClick={() => setShowFlashcards(false)}>
              Back to Note
            </button>
          </div>
        ) : (
          <div style={styles.flashcard}>
            <p style={styles.cardCount}>{currentCard + 1} / {flashcards.length}</p>
            <div style={styles.card} onClick={() => setFlipped(!flipped)}>
              <p style={styles.cardText}>
                {flipped ? flashcards[currentCard].answer : flashcards[currentCard].question}
              </p>
              <p style={styles.hint}>{flipped ? '📖 Answer' : '❓ Click to reveal'}</p>
            </div>
            {flipped && (
              <div style={styles.answerBtns}>
                <button style={styles.btnWrong} onClick={() => handleAnswer(false)}>❌ Wrong</button>
                <button style={styles.btnCorrect} onClick={() => handleAnswer(true)}>✅ Correct</button>
              </div>
            )}
            <button style={{...styles.btnPurple, marginTop:'16px'}} onClick={() => setShowFlashcards(false)}>
              Exit Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: { position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000 },
  modal: { background:'white', borderRadius:'16px', padding:'32px', width:'90%', maxWidth:'600px', maxHeight:'80vh', overflowY:'auto' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' },
  title: { margin:0, color:'#333', fontSize:'22px' },
  close: { background:'none', border:'none', fontSize:'20px', cursor:'pointer', color:'#666' },
  date: { color:'#aaa', fontSize:'13px', marginBottom:'16px' },
  content: { color:'#444', fontSize:'15px', lineHeight:'1.8', whiteSpace:'pre-wrap', marginBottom:'24px' },
  actions: { display:'flex', gap:'12px', marginBottom:'16px' },
  btnPurple: { padding:'10px 20px', background:'#4f46e5', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'600' },
  btnGreen: { padding:'10px 20px', background:'#22c55e', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'600' },
  shareBox: { display:'flex', gap:'8px', marginTop:'12px' },
  shareInput: { flex:1, padding:'8px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'13px', color:'#333', backgroundColor:'white' },  btnCopy: { padding:'8px 16px', background:'#4f46e5', color:'white', border:'none', borderRadius:'8px', cursor:'pointer' },
  flashcard: { textAlign:'center' },
  cardCount: { color:'#888', marginBottom:'16px' },
  card: { background:'#f0f2f5', borderRadius:'12px', padding:'40px 24px', cursor:'pointer', marginBottom:'16px', minHeight:'120px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' },
  cardText: { fontSize:'18px', color:'#333', margin:0 },
  hint: { color:'#888', fontSize:'13px', marginTop:'12px' },
  answerBtns: { display:'flex', gap:'16px', justifyContent:'center' },
  btnWrong: { padding:'10px 24px', background:'#ef4444', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'600' },
  btnCorrect: { padding:'10px 24px', background:'#22c55e', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'600' },
  result: { textAlign:'center', padding:'24px' }
};
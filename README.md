# 📚 StudySync

A full-stack web app where students can create notes, share them, and quiz themselves with flashcards.

## 🔗 Live Demo
[StudySync Live](studysync-2hi7.vercel.app)

## ✨ Features
- 🔐 User authentication with JWT tokens + bcrypt
- 📝 Create, save, and delete notes
- 🔍 Real-time search across all notes
- 🔗 Share notes via public link (no login required)
- 🃏 Flashcard quiz mode with scoring
- 🏷️ Tags and categories with colored badges

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Flask (Python) |
| Database | MongoDB Atlas |
| Auth | JWT + bcrypt |
| Deployed | Vercel + Render |

## 📸 Screenshots
<img width="1399" height="866" alt="image" src="https://github.com/user-attachments/assets/c8957106-3908-484b-9f5e-0f3a6faed87d" />


## 🚀 Run Locally

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📄 Environment Variables
Create `backend/.env`:
```
MONGO_URI=your-mongodb-connection-string
JWT_SECRET_KEY=your-secret-key
```

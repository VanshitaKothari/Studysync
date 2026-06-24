from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from pymongo import MongoClient
import os

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-secret-change-in-prod")
app.config["MONGO_URI"] = os.getenv("MONGO_URI")

jwt = JWTManager(app)

client = MongoClient(app.config["MONGO_URI"])
db = client["studysync"]
app.db = db

from routes.auth import auth_bp
from routes.notes import notes_bp

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(notes_bp, url_prefix="/api/notes")

@app.route("/api/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    app.run(debug=True, port=5000)
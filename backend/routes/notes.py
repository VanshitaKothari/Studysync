from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv
from models.note import create_note

load_dotenv()

notes_bp = Blueprint("notes", __name__)

client = MongoClient(os.getenv("MONGO_URI"))
db = client["studysync"]
notes = db["notes"]

@notes_bp.route("/", methods=["POST"])
@jwt_required()
def create():
    user_id = get_jwt_identity()
    data = request.get_json()
    title = data.get("title", "Untitled")
    content = data.get("content", "")
    tags = data.get("tags", [])

    if not content:
        return jsonify({"error": "Content is required"}), 400

    note = create_note(user_id, title, content)
    note["tags"] = tags
    result = notes.insert_one(note)

    return jsonify({
        "message": "Note created",
        "id": str(result.inserted_id)
    }), 201

@notes_bp.route("/", methods=["GET"])
@jwt_required()
def get_notes():
    user_id = get_jwt_identity()
    user_notes = list(notes.find({"user_id": user_id}).sort("created_at", -1))

    for note in user_notes:
        note["_id"] = str(note["_id"])
        note["created_at"] = note["created_at"].strftime("%b %d, %Y")

    return jsonify(user_notes), 200

@notes_bp.route("/<note_id>", methods=["DELETE"])
@jwt_required()
def delete_note(note_id):
    user_id = get_jwt_identity()
    notes.delete_one({"_id": ObjectId(note_id), "user_id": user_id})
    return jsonify({"message": "Note deleted"}), 200
import uuid

@notes_bp.route("/share/<note_id>", methods=["POST"])
@jwt_required()
def share_note(note_id):
    user_id = get_jwt_identity()
    share_token = str(uuid.uuid4())
    notes.update_one(
        {"_id": ObjectId(note_id), "user_id": user_id},
        {"$set": {"share_token": share_token}}
    )
    return jsonify({"share_token": share_token}), 200

@notes_bp.route("/view/<share_token>", methods=["GET"])
def view_shared_note(share_token):
    note = notes.find_one({"share_token": share_token})
    if not note:
        return jsonify({"error": "Note not found"}), 404
    note["_id"] = str(note["_id"])
    note["created_at"] = note["created_at"].strftime("%b %d, %Y")
    return jsonify(note), 200
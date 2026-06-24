from datetime import datetime

def create_note(user_id, title, content):
    return {
        "user_id": user_id,
        "title": title,
        "content": content,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "tags": []
    }
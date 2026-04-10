from google.adk.tools.tool_context import ToolContext
from google.cloud import firestore
import uuid
from datetime import datetime

# Firestore setup
db = firestore.Client(project='mnemosyne-492716', database='link-saver')
collection = db.collection("memory")

# -----------------------------
# TOOL 1: Save Prompt
# -----------------------------
def save_user_input(tool_context: ToolContext, link: str, description: str):
    tool_context.state["link"] = link
    tool_context.state["description"] = description
    return {"status": "saved"}

# -----------------------------
# TOOL 2: Fetch Content (Mock)
# -----------------------------
def fetch_content(tool_context: ToolContext):
    link = tool_context.state.get("link", "")
    description = tool_context.state.get("description", "")

    content = f"{description} from {link}"
    tool_context.state["raw_content"] = content

    return {"content": content}

# -----------------------------
# TOOL 3: Transcribe (Mock)
# -----------------------------
def transcribe_content(tool_context: ToolContext):
    raw = tool_context.state.get("raw_content", "")
    transcript = raw.lower()

    tool_context.state["transcript"] = transcript
    logging.info(f"[State updated] Added transcript: {transcript}")
    return {"transcript": transcript}

# -----------------------------
# TOOL 4: Store in Firestore
# -----------------------------
def store_memory(tool_context: ToolContext):
    structured = tool_context.state.get("structured_data", {})

    structured["id"] = str(uuid.uuid4())
    structured["created_at"] = datetime.utcnow().isoformat()

    collection.document(structured["id"]).set(structured)
    logging.info(f"data added:{structured}")

    return {"status": "stored", "data": structured}

# -----------------------------
# TOOL 5: Retrieve Memory
# -----------------------------
def retrieve_memory(tool_context: ToolContext):
    docs = collection.stream()
    memories = [doc.to_dict() for doc in docs]

    tool_context.state["memories"] = memories
    logging.info(f"State updated with memories: {memories}")
    return {"memories": memories}

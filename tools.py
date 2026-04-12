from google.adk.tools.tool_context import ToolContext
from google.cloud import firestore
import uuid
from datetime import datetime
import logging
import re
import requests
from youtube_transcript_api import YouTubeTranscriptApi
from dotenv import load_dotenv
load_dotenv()

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

# Firestore setup
db = firestore.Client(project='mnemosyne-492716', database='link-saver')
collection = db.collection("links")

def add_prompt_to_state(
    tool_context: ToolContext, prompt: str
) -> dict[str, str]:
    """Saves the user's initial prompt to the state."""
    tool_context.state["PROMPT"] = prompt
    logging.info(f"[State updated] Added to PROMPT: {prompt}")
    return {"status": "success"}
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
def extract_video_id(url: str) -> str:
    regex = r"(?:v=|youtu\.be/)([a-zA-Z0-9_-]{11})"
    match = re.search(regex, url)
    if not match:
        raise ValueError("Invalid YouTube URL")
    return match.group(1)


def fetch_youtube_content(link: str):
    video_id = extract_video_id(link)

    # 1. Fetch metadata
    url = "https://www.googleapis.com/youtube/v3/videos"
    params = {
        "part": "snippet,contentDetails,statistics",
        "id": video_id,
        "key": YOUTUBE_API_KEY,
    }

    res = requests.get(url, params=params)
    data = res.json()

    if not data.get("items"):
        raise Exception("Video not found")

    item = data["items"][0]
    description=item["snippet"]["description"]
    metadata = {
        "video_id": video_id,
        "published_at": item["snippet"]["publishedAt"],
        "title": item["snippet"]["title"],
        "channel": item["snippet"]["channelTitle"],
        "creator_name": snippet["channelTitle"],   
        "creator_id": snippet["channelId"], 
        "category": YOUTUBE_CATEGORIES.get(
            item["snippet"].get("categoryId", ""),
            "Unknown"
        ),
        "tags": item["snippet"].get("tags", []),
    }

    # 2. Fetch transcript
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        transcript = " ".join([t["text"] for t in transcript_list])
        has_audio = True
    except Exception:
        transcript = None
        has_audio = True  # still true → can fallback later

    return {
        "link":link,
        "description":description,
        "source_type": "youtube",
        "metadata": metadata,
        "transcript": transcript,
        "has_audio": has_audio,
    }


def fetch_generic_content(link: str):
    try:
        res = requests.get(link, timeout=10)
        text = res.text

        return {
            "source_type": "generic",
            "metadata": {"url": link},
            "content": text[:15000],  # limit size
            "has_audio": False,
        }
    except Exception as e:
        raise Exception(f"Failed to fetch generic content: {str(e)}")

def is_youtube_link(url: str) -> bool:
    return "youtube.com" in url or "youtu.be" in url


def fetch_content(tool_context):
    link = tool_context.state.get("link", "")
    description = tool_context.state.get("description", "")

    if not link:
        return {"status": "failed", "reason": "No link provided"}

    try:
        # 🔍 Detect source type
        if is_youtube_link(link):
            video_id = extract_video_id(link)

            # 1. Fetch metadata from YouTube API
            url = "https://www.googleapis.com/youtube/v3/videos"
            params = {
                "part": "snippet,contentDetails,statistics",
                "id": video_id,
                "key": YOUTUBE_API_KEY,
            }

            res = requests.get(url, params=params)
            data = res.json()

            if not data.get("items"):
                raise Exception("Video not found")

            item = data["items"][0]

            metadata = {
                "video_id": video_id,
                "title": item["snippet"]["title"],
                "description": item["snippet"]["description"],
                "channel": item["snippet"]["channelTitle"],
                "published_at": item["snippet"]["publishedAt"],
                "views": item["statistics"].get("viewCount"),
            }

            # 2. Fetch transcript
            try:
                transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
                transcript = " ".join([t["text"] for t in transcript_list])
            except Exception:
                transcript = None

            result = {
                "source_type": "youtube",
                "metadata": metadata,
                "content": transcript,
                "has_audio": True,
            }

        else:
            # 🌐 Generic fetch
            res = requests.get(link, timeout=10)
            text = res.text[:15000]

            result = {
                "source_type": "generic",
                "metadata": {"url": link},
                "content": text,
                "has_audio": False,
            }

        # 🧠 Save into agent state
        tool_context.state["raw_content"] = result["content"]
        tool_context.state["metadata"] = result["metadata"]
        tool_context.state["source_type"] = result["source_type"]

        return {
            "status": "success",
            "data": result
        }

    except Exception as e:
        return {
            "status": "failed",
            "reason": str(e)
        }
# def fetch_content(tool_context: ToolContext):
#     link = tool_context.state.get("link", "")
#     description = tool_context.state.get("description", "")

#     content = f"{description} from {link}"
#     tool_context.state["raw_content"] = content

#     return {"content": content}

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
    query_text = tool_context.state.get("query", "").lower()
    memories = []

    # Basic keyword filter on type field
    type_keywords = {
        "recipe": "recipe", "cook": "recipe", "food": "recipe",
        "travel": "travel", "trip": "travel", "visit": "travel",
        "cafe": "cafe", "coffee": "cafe",
        "reel": "reel", "video": "reel", "idea": "reel",
        "life hacks":"hack","hacks":"hack","diy":"hack"
    }

    matched_type = None
    for keyword, mem_type in type_keywords.items():
        if keyword in query_text:
            matched_type = mem_type
            break

    if matched_type:
        docs = collection.where("type", "==", matched_type).stream()
    else:
        docs = collection.stream()   # fallback to all

    memories = [doc.to_dict() for doc in docs]
    tool_context.state["memories"] = memories
    return {"memories": memories}

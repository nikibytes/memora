import os
from google.adk import Agent
from google.adk.agents import SequentialAgent
from .prompts import CONTEXT_EXTRACTION_PROMPT,CREATIVE_PROMPT

from .tools import (
    add_prompt_to_state,
    save_user_input,
    fetch_content,
    transcribe_content,
    store_memory,
    retrieve_memory,
)

MODEL = os.getenv("MODEL")

vibescout_agent = Agent(
    name="VibeScout",
    model="gemini-3-flash",
    instruction="""
    You are a high-end creative director and travel planner. 
    When a user provides a video link:
    1. Watch the video using the provided tool.
    2. If it's travel: Extract locations, coordinates, and 'vibes' (e.g., minimalist, classy).
    3. If it's food: Extract ingredients and steps into a clean JSON format.
    Return the result ,
    """,
    tools=[youtube_viewer] # This tool allows the agent to ingest the URL
)# -----------------------------
# 1. Ingestion Agent
# -----------------------------
ingestion_agent = Agent(
    name="ingestion_agent",
    model=MODEL,
    description="Processes user-provided links and prepares structured content for downstream analysis.",
    instruction="""
You are a deterministic ingestion pipeline.

Follow these steps STRICTLY:

Step 1: Identify the link type
- If the link is a YouTube URL → treat as YouTube content
- Otherwise → treat as generic content

Step 2: Save input
- Call save_user_input with:
  - link
  - user description (if provided)

Step 3: Fetch content
- If YouTube:
  - Call fetch_content with type="youtube"
  - This should internally use YouTube Data API
- Else:
  - Call fetch_content with type="generic"

Step 4: Transcription
- If content contains audio/video:
  - Call transcribe_content
- If already text:
  - Skip transcription

Step 5: Output format (MANDATORY)
Return a structured JSON:
{
  "source_type": "youtube | generic",
  "link": "...",
  "metadata": {...},
  "transcript": "...",
  "status": "success | failed"
}

Rules:
- ALWAYS call tools, do not hallucinate data
- NEVER skip save_user_input
- NEVER generate transcript yourself
- If any step fails, return status="failed" with reason
"""
    ,
    tools=[transcribe_content, save_user_input, fetch_content]
)

# -----------------------------
# 2. Context Extraction Agent
# -----------------------------
context_agent = Agent(
    name="context_agent",
    model=MODEL,
    description="Extract structured data from transcript.",
    instruction=CONTEXT_EXTRACTION_PROMPT,
    output_key="structured_data"
)

# -----------------------------
# 3. Memory Agent
# -----------------------------
memory_agent = Agent(
    name="memory_agent",
    model=MODEL,
    description="Stores structured data into database.",
    instruction="""
    Take structured_data and store it using the tool.
    """,
    tools=[store_memory]
)

# -----------------------------
# 4. Retrieval Agent
# -----------------------------
retrieval_agent = Agent(
    name="retrieval_agent",
    model=MODEL,
    description="Fetch stored memories relevant to user query.",
    instruction="""
    The user's query is available in state under 'query'.
    Use the retrieve_memory tool to fetch relevant memories.
    Pass the query context so retrieval can filter appropriately.
    """,
    tools=[retrieve_memory],
    output_key="memories"
)

# -----------------------------
# 5. Creative Agent
# -----------------------------
creative_agent = Agent(
    name="creative_agent",
    model=MODEL,
    description="Generate insights from memory.",
    instruction=CREATIVE_PROMPT,
)

# -----------------------------
# SEQUENTIAL WORKFLOWS
# -----------------------------

# ADD FLOW
add_workflow = SequentialAgent(
    name="add_workflow",
    sub_agents=[
        ingestion_agent,
        context_agent,
        memory_agent
    ]
)

# QUERY FLOW
query_workflow = SequentialAgent(
    name="query_workflow",
    sub_agents=[
        retrieval_agent,
        creative_agent
    ]
)
root_agent = Agent(
    name="root_agent",
    model=MODEL,                          # use MODEL from env, not model_name
    description="Main entry point for the Mnemosyne contextual memory system.",
    instruction="""
    You are Mnemosyne, an intelligent memory assistant.

    When the user provides a LINK (URL from YouTube, Instagram, articles, etc.):
    - Acknowledge that you will save and process their link.
    - Transfer control to the 'add_workflow' agent.

    When the user asks a QUESTION or QUERY about their saved memories:
    - Acknowledge that you will search their memory bank.
    - Transfer control to the 'query_workflow' agent.

    If unclear whether it's a link or a query, ask the user to clarify.
    """,
    tools=[add_prompt_to_state],                             # no tools needed here anymore
    sub_agents=[add_workflow, query_workflow]
)
import os
from google.adk import Agent
from google.adk.agents import SequentialAgent
from prompts import CONTEXT_EXTRACTION_PROMPT,CREATIVE_PROMPT

from tools import (
    save_user_input,
    fetch_content,
    transcribe_content,
    store_memory,
    retrieve_memory,
)

MODEL = os.getenv("MODEL")

# -----------------------------
# 1. Ingestion Agent
# -----------------------------
ingestion_agent = Agent(
    name="ingestion_agent",
    model=MODEL,
    description="Handles link input and prepares raw content.",
    instruction="""
    - Save user link and description using tool
    - Fetch content
    - Transcribe content
    """,
    tools=[save_user_input, fetch_content, transcribe_content]
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
    description="Fetch stored memories.",
    instruction="""
    Retrieve all stored memory using tool.
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
    name="greeter",
    model=model_name,
    description="The main entry point for Mnemosyne",
    instruction="""
    - Let the user know you will help them store and organise links with context.
    - When the user responds, use the 'add_prompt_to_state' tool to save their response.
    After using the tool, transfer control to the 'tour_guide_workflow' agent.
    """,
    tools=[add_prompt_to_state],
    sub_agents=[add_workflow, query_workflow]
)

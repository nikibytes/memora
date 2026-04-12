import os
from dotenv import load_dotenv
import logging
import google.cloud.logging
from fastapi import FastAPI
from .agents import root_agent
# from google.adk.runners import Runner
from fastapi.responses import FileResponse
from pydantic import BaseModel
# Configure logging
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
cloud_logging_client = google.cloud.logging.Client()
cloud_logging_client.setup_logging()

load_dotenv()
app = FastAPI()

# add_runner = Runner(agent=add_workflow)
# query_runner = Runner(agent=query_workflow)

class PromptRequest(BaseModel):
    prompt: str

@app.post("/invoke")
def invoke_agent(request: PromptRequest):
    # This is a simplified way to run the agent.
    # In a real-world scenario, you would have a more robust way to manage state.
    initial_state = {"PROMPT": request.prompt}
    result = root_agent.run(initial_state)
    return {"response": result}

@app.post("/add")
def add(data: dict):
    logging.info(f"Received request for /add with data: {data}")  
    input_data={
            "link": data.get("link"),
            "description": data.get("description", "")
        }
    result = root_agent.run(input_data)
    return result


@app.post("/query")
def query(data: dict):
    logging.info(f"Received request for /query with data: {data}")
    result = root_agent.run({"query":data.get("query")})
    return result

# @app.get("/")
# async def root():
#     return FileResponse("index.html")
    
if __name__ == "__main__":
    import uvicorn
    logging.info("Starting uvicorn server.")
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
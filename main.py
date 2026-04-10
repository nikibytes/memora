import os
from dotenv import load_dotenv
import logging
from fastapi import FastAPI
from agents import add_workflow, query_workflow
from google.adk.runners import Runner
from fastapi.responses import FileResponse
from pydantic import BaseModel
# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

load_dotenv()
app = FastAPI()

add_runner = Runner(agent=add_workflow)
query_runner = Runner(agent=query_workflow)

class PromptRequest(BaseModel):
    prompt: str

@app.post("/add")
async def add(data: dict):
    logging.info(f"Received request for /add with data: {data}")
    result = await add_runner.run(
        input_data={
            "link": data.get("link"),
            "description": data.get("description", "")
        }
    )
    return result


@app.post("/query")
async def query(data: dict):
    logging.info(f"Received request for /query with data: {data}")
    result = await query_runner.run(
        input_data={
            "query": data.get("query")
        }
    )
    return result

# @app.get("/")
# async def root():
#     return FileResponse("index.html")
    
if __name__ == "__main__":
    import uvicorn
    logging.info("Starting uvicorn server.")
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
import os
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

# Erlaubt deinem Browser den Zugriff
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

class AnalysisRequest(BaseModel):
    text: str

@app.post("/api/analyze")
async def analyze_logic(req: AnalysisRequest):
    # Der "Master-Prompt" für Alexandr Wang Level Analysen
    prompt = f"""Analyze the following argument for logical fallacies. 
    Then, create a 'Synthetic Twin': a version of the argument that is logically perfect, 
    stripping away all rhetoric and flaws while keeping the core intent.
    
    Return ONLY a JSON object:
    {{
        "score": (0-5),
        "analysis": "Brief deep dive into flaws",
        "synthetic_twin": "The perfect logical version",
        "improvement_steps": ["Step 1", "Step 2", "Step 3"]
    }}
    
    Argument: {req.text}"""

    response = client.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}]
    )
    
    # Extrahiert das JSON aus der Antwort
    res_data = json.loads(response.content[0].text)
    return res_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)#
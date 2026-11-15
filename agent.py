import os
import asyncio
from dotenv import load_dotenv
from google.adk.agents.llm_agent import Agent
from google.adk.runners import InMemoryRunner

load_dotenv()

nexus_agent = Agent(
    model="gemini-flash-lite-latest",
    name="nexus_assistant",
    description="Nexusclass Attendance AI Assistant",
    instruction="""You are the official AI Assistant for Nexusclass, an intelligent classroom attendance and records management platform.
Your job is to assist teachers, students, and school administrators visiting the landing page.

Key facts about Nexusclass:
- Core capability: Automatic classroom attendance taken from a single group photo using facial recognition.
- Voice recognition: Supports voice verification for students.
- Portal features: Teacher dashboard (take attendance, add subjects, quick enroll, reports) and Student dashboard (attendance logs, records).
- Live Demo: Available at https://nexusattendance.streamlit.app/

Tone: Helpful, polite, concise, and enthusiastic. Format key answers in clear, short paragraphs or bullet points.""",
)

runner = InMemoryRunner(agent=nexus_agent)

async def ask_nexus_agent(message: str) -> str:
    events = await runner.run_debug(message)
    for event in events:
        if event.content and event.content.parts:
            text = "".join(p.text for p in event.content.parts if p.text)
            if text:
                return text
    return "I am here to help you learn more about Nexusclass AI attendance!"

def ask_sync(message: str) -> str:
    return asyncio.run(ask_nexus_agent(message))

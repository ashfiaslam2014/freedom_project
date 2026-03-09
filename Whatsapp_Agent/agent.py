import os
from langchain_community.utilities import SQLDatabase
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.agent_toolkits import create_sql_agent

def get_agent_executor():
    # Make sure to set GOOGLE_API_KEY in your environment
    if not os.getenv("GOOGLE_API_KEY"):
        raise ValueError("Google API key not found. Please set GOOGLE_API_KEY environment variable.")
    
    # Connect to the SQLite database
    db = SQLDatabase.from_uri("sqlite:///invoices.db")
    
    # Initialize the LLM (Using Google Gemini)
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0)
    
    # Create the SQL Agent
    # verbose=True helps debug the queries the agent is constructing
    agent_executor = create_sql_agent(llm, db=db, verbose=True)
    
    return agent_executor

def process_message(message: str) -> str:
    try:
        agent_executor = get_agent_executor()
        response = agent_executor.invoke({"input": message})
        return response.get("output", "I could not find an answer.")
    except Exception as e:
        return f"Error processing your request: {str(e)}"

if __name__ == '__main__':
    # Quick test to see if agent works locally
    # Will fail if GOOGLE_API_KEY is not set or invoices.db doesn't exist
    print(process_message("How many invoices are pending?"))

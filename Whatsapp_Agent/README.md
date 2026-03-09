# WhatsApp Invoice AI Agent Prototype

This project is a prototype for an AI agent that works on WhatsApp. It tracks and retrieves invoice information from a SQLite database using a LangChain SQL Agent powered by Google Gemini, and uses Twilio to interface with WhatsApp.

## Prerequisites
- Python 3.8+
- [ngrok](https://ngrok.com/) (to expose local server)
- A Twilio account (using Twilio Sandbox for WhatsApp)
- Google Gemini API Key

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set API Key
Set your Google Gemini API Key in your environment variables:
```bash
export GOOGLE_API_KEY='your-gemini-api-key'
```

### 3. Initialize Database
Run the database script to create `invoices.db` and populate it with dummy data:
```bash
python database.py
```

### 4. Start the Application Server
Run the Flask application:
```bash
python app.py
```
The server will start locally on `http://127.0.0.1:5000`.

### 5. Expose Server with ngrok
In a new terminal, run:
```bash
ngrok http 5000
```
This will generate a secure public URL (e.g., `https://<id>.ngrok-free.app`).

### 6. Configure Twilio WhatsApp Sandbox
1. Go to your Twilio Console -> Messaging -> Try it out -> Send a WhatsApp message.
2. Join your Sandbox by sending the required code (e.g., "join <word>") to the Twilio number.
3. In Twilio Console, go to Sandbox settings.
4. Set the "When a message comes in" Webhook URL to your ngrok URL with the `/webhook` path:
   `https://<id>.ngrok-free.app/webhook`
5. Save the settings.

### 7. Test It Out!
Send a WhatsApp message to your Sandbox number asking about the invoices:
- "What is the total amount of pending invoices?"
- "Which clients have overdue invoices?"
- "How much does Acme Corp owe us?"

import os
from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse
from agent import process_message

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    # Get the incoming message from WhatsApp via Twilio
    incoming_msg = request.values.get('Body', '').strip()
    sender = request.values.get('From', '')
    
    print(f"Received message from {sender}: {incoming_msg}")
    
    # Process the message using our LangChain Agent
    if incoming_msg:
        ai_response = process_message(incoming_msg)
    else:
        ai_response = "I didn't receive a valid message. What would you like to know about the invoices?"
        
    print(f"Agent response: {ai_response}")
    
    # Create Twilio response to send back to WhatsApp
    resp = MessagingResponse()
    resp.message(ai_response)
    
    return str(resp)

if __name__ == '__main__':
    # Run the app locally on port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)

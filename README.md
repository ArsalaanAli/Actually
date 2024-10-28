# Eavesdrop / Actually

![image](https://github.com/user-attachments/assets/ceeb9aed-ff50-4308-93fa-a48ab647ccde)

## Inspiration
Staying well-informed is difficult, especially in a world that demands our attention in a myriad of complex and pressing issues like pandemics, climate change, and AI—each demanding a nuanced understanding to make a truly representative decision. It doesn't help that we not only have to seek the truth but discard what's false.

## What it does
_Actually_ helps you stay informed by fact checking your content in real time. Give it a video or livestream of a debate, and _Actually_ will transcribe what's being said, then use AI to provide more context on the topic, verify how true the statements being made are, and list supporting citations.


## How we built it

_Actually_ uses Gemini 1.5 Pro to fact check and provide context on audio transcriptions created with Azure Speech Services. The UI was built using Tailwind, React, and Vite, and the backend is made using Python Flask.

## Challenges we ran into
- Streaming data using sockets
- Live transcription of audio
- Optimizing LLM response speeds
- Consistently getting LLM outputs in a defined schema 
- Getting citations from LLM responses

## Accomplishments that we're proud of
- Integrating multiple technologies: socket-io, audio capture/streaming, live transcription using Azure, prompt engineering with Gemini
- Making lots of friends at Hack the North!
- Exploring lots of different possibilities 

## What we learned
- How to use socketio
- Prompt engineering
- Using streams to make tools like Azure Speech Services to handle live data

## What's next for Actually
- Expand possible inputs: Youtube, Twitch, TV, etc.
- Build a RAG model to prevent hallucinations

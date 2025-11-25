## EvoNote – AI Project Ideation Assistant 🚀  

**EvoNote** is a full-stack web application designed to help developers transform raw, messy project ideas into clear, structured, and executable plans.  

Instead of jumping between scattered notes and half-baked concepts, EvoNote acts as an **AI-powered project assistant** that understands your idea, refines it, and helps you shape it into a solid project scope.

---

### 🎯 Core Idea

EvoNote takes your initial project idea and helps you:

- Clarify the project vision  
- Break down the idea into structured features  
- Suggest possible tech stack and architecture directions  
- Prepare a more realistic and actionable plan for implementation  

---

### 🧩 Tech Stack

- ⚛️ **Front-End:** React.js + Vite  
- 🐍 **Back-End:** Flask (Python)  
- 🌐 **API Layer:** Custom REST APIs connecting front-end and back-end  
- 🤖 **AI Provider:** Google Gemini  
- 🔐 **Authentication:** Login & Register system  
- 📦 **Config & Secrets:** Environment variables via `.env`  

---

### 🧠 Key Features

- **Streaming AI responses** – messages appear character-by-character for a smooth chat experience  
- **Simple and responsive UI** for fast interaction  
- **Clean component-based architecture** on the front-end  
- **Well-structured API integration** between React and Flask  
- **System Prompt support**:  
  You can define the AI’s role to get more focused results, for example:
  - `Project Architect`
  - `Code Reviewer`
  - `Product Manager`  
  This makes EvoNote more accurate and tailored for different project needs.

---

### 🔐 Auth & History

- Basic **authentication system** (Register / Login)  
- **Conversation history** support when running the project locally  
- Ready to be extended with a real database or multi-session support in the future  

---

### 🌱 Future Improvements

Planned ideas and possible next steps:

- Saving and managing multiple project sessions  
- Enhanced UI/UX and layout improvements  
- Simple project management features inside EvoNote  
- Support for multiple AI providers in addition to Gemini  


EvoNote is part of my learning journey in **Full-Stack Development**, combining **React, Flask, and AI APIs** into one real-world project.  
If you have any feedback, feature ideas, or want to collaborate, feel free to reach out!


## How to run (local development)

Assume a Linux environment and repository root at /home/mostafa/EvoNote.

**Backend Setup**
   - Create and activate a Python virtual environment:
     ```bash
     cd /home/mostafa/EvoNote/backend
     python3 -m venv venv
     source venv/bin/activate
     ```
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Create .env from template and edit:
     ```bash
     cp .env.example .env
     # Edit .env and populate required variables such as SECRET_KEY, database URL, and any API keys
     ```
   - Start the backend:
     ```bash
     python app.py
     # or, if configured for Flask CLI:
     export FLASK_APP=app.py
     flask run
     ```

# EvoNote
#### Video Demo: https://youtu.be/PP3ZnW6iP3E
#### Description:

EvoNote is a full-stack web application designed to solve a critical pain point for developers: the initial, often disorganized, flawed, or incomplete state of their project ideas. Acting as an AI-powered chatbot interface, EvoNote takes a developer's raw thoughts and instantly begins a process of refinement. Its core function is to structure, enhance, and develop these initial concepts by providing intelligent suggestions and improvements. If the input is ambiguous, EvoNote proactively engages the user with a series of clarifying questions, ensuring the complete picture emerges. Ultimately, EvoNote serves as a catalyst, transforming vague, scattered ideas into clear, well-defined blueprints ready for implementation.

EvoNote pairs a Flask backend with a modern React (Vite) frontend to demonstrate an authenticated, session-backed single page application. The project is organized into two clear subprojects — backend/ and frontend/ — with a focus on a straightforward registration/login flow, a primary Home interface, and a reusable ChatBox component intended for conversational interactions with an AI assistant. EvoNote was developed as a learning-oriented project that illustrates integration patterns between a Python API and a React UI while keeping the implementation accessible for CS50 students and developers seeking to understand full-stack architecture.

At a conceptual level, EvoNote addresses the common need for a minimal, interactive web application that manages user sessions on the server and exposes API endpoints for a frontend SPA to consume. The intended users are developers or students who want a practical example of client/server separation, session management with Flask-Session, and a component-driven React frontend built with Vite. Main user-facing features include account registration and authentication, a secure login flow, a Home page that hosts the ChatBox UI for real-time conversation with an AI assistant, header navigation with user account information, and visual components such as a Loader to improve UX during asynchronous operations. The ChatBox component enables users to input project ideas or questions, receive intelligent AI-driven responses via streaming, and iteratively refine their concepts through conversation.

This README documents the project structure, the technologies used, how frontend and backend communicate, key design decisions and their tradeoffs, step-by-step instructions to run the project locally, typical user workflows, and implementation details specific to EvoNote's architecture.

## Technologies

- Backend: Python 3, Flask
- Database: SQLite with SQLAlchemy ORM for persistent user and conversation storage
- Session management: Flask-Session (file-backed session store used during development)
- Frontend: JavaScript, React (JSX), Vite (dev server and bundler)
- UI Framework: Bootstrap for responsive, professional component styling
- Packaging & tooling: pip for Python, npm for frontend dependencies
- Styling: Bootstrap CSS framework plus custom CSS Modules (.module.css) for component-scoped overrides
- Configuration: .env / .env.example for backend environment values
- AI Integration: Streaming API responses for real-time message delivery
- Project layout: Separate backend and frontend directories for independent development and deployment

## Project structure

**Backend (/home/mostafa/EvoNote/backend/)**

- app.py — The Flask application entry point and core backend logic. This file defines all route handlers, session setup, database initialization, and API endpoints consumed by the frontend. It manages user registration, login, session persistence, database queries, and the connection to AI services. The app implements streaming responses for the ChatBox, sending AI replies incrementally to the frontend as tokens are generated. The backend also manages system prompts and AI personality configuration, ensuring the model understands its role as EvoNote and maintains context about its name and purpose throughout conversations.
- requirements.txt — Specifies all Python dependencies required to run the backend, including Flask, Flask-Session, SQLAlchemy, and any additional libraries for AI integration, database management, or data validation.
- .env & .env.example — Configuration management files. The .env.example template documents required environment variables (e.g., SECRET_KEY for session encryption, database URL, API keys for external AI services). Users copy this to .env and populate their own values for local development.
- flask_session/ — Directory containing file-backed session storage. Flask-Session persists server-side session state to individual files in this directory, allowing session data (user authentication, conversation context) to persist across server restarts during development.
- SQLite database (created at runtime) — Stores persistent user accounts, conversation history, individual messages, and metadata. The database schema includes tables for users and conversations, enabling long-term storage and retrieval of past interactions.
- README.md — Backend-specific documentation.

**Frontend (/home/mostafa/EvoNote/frontend/)**

- index.html — The Vite entry HTML file served by the development server or production build. This is the root HTML document where React mounts the application.
- package.json — Declares frontend dependencies (React, React Router, Bootstrap, axios/fetch libraries, Vite dev dependencies) and scripts (dev, build, preview). This file is essential for npm to manage the frontend environment.
- vite.config.js — Configuration file for Vite, defining the development server behavior, build output settings, and plugin setup.
- src/main.jsx — React bootstrap entry point. This file imports and renders the root App component, initializes client-side routing, and mounts the React tree into the DOM.
- src/App.jsx and App.css — The root application component and global styles. App.jsx typically handles main routing logic (conditionally rendering login, register, or Home pages based on authentication state). App.css provides baseline styling applied across the entire application, often integrating with Bootstrap.
- src/Home.jsx — The protected main page rendered after successful user authentication. This page serves as the primary interface where authenticated users interact with the ChatBox component, access their project history, and receive AI-driven feedback on their ideas.
- src/NotFound.jsx — A fallback UI component shown when the user navigates to an unmatched route, improving UX by providing clear feedback rather than blank screens.
- src/pages/
  - login/login.jsx and login.module.css — The login page component and its scoped styles, leveraging Bootstrap for responsive layout and form elements. This page collects user credentials and sends them to the backend login endpoint. On success, it redirects to Home; on failure, it displays error messages.
  - register/register.jsx and register.module.css — The registration page component and styles, styled with Bootstrap for consistency. It validates user input, sends registration data to the backend, and handles success/error responses. This page allows new users to create accounts.
- src/components/
  - ChatBox/Chatbox.jsx and Chatbox.module.css — The core interactive component for conversing with the AI assistant. It displays a message history, provides an input field for user messages, handles message submission to the backend AI endpoint, renders loading states during network requests using streaming responses, and displays AI replies as they arrive. The streaming feature enables real-time, progressive message delivery, creating a more responsive and engaging user experience. This component is the heart of EvoNote's user experience.
  - header/header.jsx and header.css — The top navigation component shown on authenticated pages. Built with Bootstrap's navbar component, it displays the logged-in user's name or email, provides a logout button, and includes branding and navigation links.
  - Loader/Loader.jsx and Loader.module.css — A reusable loading spinner component displayed during asynchronous operations (API calls, form submissions), signaling to the user that a request is in progress.
- src/config/api.js — Centralized API configuration file defining the backend base URL (e.g., http://127.0.0.1:5000). All frontend API calls reference this configuration, making it easy to switch endpoints between development and production.
- public/ and src/assets/ — Directories for static assets (images, icons, fonts) served by the frontend.

## How the frontend and backend interact

The frontend issues HTTP requests to API endpoints defined by the Flask backend. The base API URL is configured in frontend/src/config/api.js so that all fetch or axios calls point to the backend server (e.g., http://127.0.0.1:5000). Authentication state is managed using server-side sessions (Flask-Session): after successful login, the backend sets a secure session cookie that the browser automatically includes in subsequent requests. This design eliminates the need for client-side token management.

When a user sends a message via the ChatBox component, the frontend POSTs the message to a backend endpoint (e.g., /api/chat). The backend receives the message, retrieves system prompts and EvoNote's personality configuration, queries the external AI service with proper context, and streams the response back to the frontend. The streaming mechanism sends response chunks as they are generated, allowing the ChatBox to render the AI's reply incrementally rather than waiting for the entire response. This creates a natural, conversational feel. The frontend parses each streamed chunk and appends it to the conversation thread in real-time. This request/response cycle repeats for each user message, and all interactions are persisted to the SQLite database for conversation history.

## Database & persistence

EvoNote uses SQLite as its persistent database, managed by SQLAlchemy ORM. The database stores user accounts (email, username, password hash), conversation records (conversation ID, user ID, creation timestamp), and individual messages (message content, sender type, timestamp). This design enables users to maintain conversation history across sessions, allowing them to review past interactions and track the evolution of their project ideas over time. The database is initialized automatically on first run and can be reset or migrated using standard SQLAlchemy patterns. Conversation data is retrieved on demand and displayed in the ChatBox, creating a seamless experience where users can pick up where they left off.

## Design decisions and tradeoffs

**Backend choices:** Flask and Flask-Session were chosen for simplicity and clarity in an educational context. SQLite provides a lightweight, file-based database that requires no external server setup, ideal for development and small-scale deployments. For production use at larger scales, migration to PostgreSQL is straightforward. File-backed server sessions eliminate the need for complex JWT-based token management but are less suitable for distributed deployments. If EvoNote scales to multiple servers, sessions should be migrated to Redis or a similar centralized store.

**AI streaming and system prompts:** The implementation uses streaming responses to deliver AI-generated content incrementally, improving perceived performance and responsiveness. System prompts are configured in the backend to establish EvoNote's personality, role, capabilities, and conversational style. These prompts ensure the AI model understands it is EvoNote, knows its purpose (helping developers refine project ideas), and maintains context-aware, high-quality responses. Metadata such as the assistant's name is embedded in the prompt engineering strategy, allowing consistent behavior across conversations.

**Frontend architecture:** React with Vite and Bootstrap provides a fast developer experience (Hot Module Replacement, rapid builds) and a professional, responsive UI. Bootstrap's pre-built components (navbar, forms, modals) accelerate development while CSS Modules provide component-scoped styling for customizations. Vite's speed is particularly valuable during iterative development. Bootstrap ensures consistent, accessible styling across browsers and devices.

**Separation of concerns:** The clear separation of backend and frontend into independent directories allows each to be developed, tested, and deployed independently. This separation also supports different technology stacks and deployment strategies (e.g., backend on Heroku, frontend on Vercel).

**Tradeoffs and limitations:** SQLite is suitable for development but may need optimization or migration to PostgreSQL under heavy concurrent load. File-based sessions do not scale horizontally and should be replaced for production. There are also important security concerns to address before public deployment, including CSRF protection, secure cookie flags (HttpOnly, Secure, SameSite), proper password hashing, rate limiting on login endpoints, and comprehensive input validation. The current implementation prioritizes clarity and learning over production-grade security.

## How to run (local development)

Assume a Linux environment and repository root at /home/mostafa/EvoNote.

**1. Backend Setup**
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
   - Initialize the database (if not automatic):
     ```bash
     python app.py
     # The database will be created on first run
     ```
   - Start the backend:
     ```bash
     python app.py
     # or, if configured for Flask CLI:
     export FLASK_APP=app.py
     flask run
     ```
   - Flask typically runs at http://127.0.0.1:5000 unless configured otherwise.

**2. Frontend Setup**
   - Install npm dependencies and run the dev server:
     ```bash
     cd /home/mostafa/EvoNote/frontend
     npm install
     npm run dev
     ```
   - Verify frontend/src/config/api.js points to the backend address (e.g., http://127.0.0.1:5000). Vite typically serves on http://localhost:5173.

**3. Important notes**
   - Both backend and frontend should run simultaneously for full functionality. Open two terminal windows or use a process manager.
   - If serving frontend and backend from different origins, ensure CORS is properly configured on the backend and that fetch requests include `credentials: 'include'` to send session cookies.
   - The frontend will communicate with the backend API; verify both servers are running before testing authentication and ChatBox functionality.
   - SQLite database files are stored in the backend directory (typically as `app.db` or similar); ensure the backend has write permissions.

## Usage and user flows

**Registration and authentication:** New users navigate to the register page, providing an email, username, and password. The frontend sends this data to the backend registration endpoint. On success, the user is redirected to the login page; on failure, validation errors are displayed. The login page collects credentials and sends them to the backend login endpoint. Successful login sets a server-side session and redirects to Home.

**Main workflow with ChatBox:** Authenticated users land on the Home page, which displays the ChatBox component. Users type their project idea, question, or raw concept into the ChatBox input field and press send. The ChatBox submits the message to the backend AI endpoint (e.g., /api/chat). The backend processes the message using the configured system prompt to ensure the AI understands it is EvoNote and its purpose. The AI service generates a response, which is streamed back to the frontend in real-time. The ChatBox renders the response incrementally as chunks arrive, creating a responsive, natural conversation. Users can continue iterating, asking follow-up questions, requesting clarifications, or refining their ideas through multiple exchanges. The Loader component indicates when requests are in flight. All messages and conversation data are persisted to the SQLite database.

**Session management:** Server-side sessions are persisted to backend/flask_session/ and remain valid until expiration (typically after a period of inactivity or explicit logout). Users can return to the Home page and their session context is maintained. Conversation history is retrieved from the SQLite database, allowing users to see past interactions and continue previous conversations.

## Implementation highlights

**Streaming responses:** The ChatBox leverages server-sent events or chunked transfer encoding to stream AI responses from the backend. This allows users to see the AI's reply appear progressively, improving perceived performance and engagement compared to waiting for a complete response.

**System prompts and personality:** The backend configures system prompts that instruct the AI model to act as EvoNote, a specialized assistant for refining developer project ideas. These prompts establish the assistant's name, role, capabilities, and conversational style. By embedding this context in the prompt, EvoNote maintains consistent, purpose-driven behavior across all conversations.

**Persistent storage:** All user interactions are saved to the SQLite database, enabling conversation history, user profile retention, and data analytics. The database schema supports efficient retrieval and display of past conversations in the ChatBox.

**Bootstrap integration:** The UI leverages Bootstrap's responsive grid system, form components, and utility classes, ensuring EvoNote is accessible, professional, and works seamlessly across devices. Custom CSS Modules extend Bootstrap styling where needed for component-specific customization.

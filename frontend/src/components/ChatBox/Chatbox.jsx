import styles from './Chatbox.module.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import Markdown from 'react-markdown';
import TextareaAutosize from 'react-textarea-autosize';

function Chatbox() {
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const textareaRef = useRef(null);
    const divToEndOfChat = useRef(null);

    const API_URL = 'http://localhost:5002/api/chat';
    const HISTORY_URL = 'http://localhost:5002/api/history';

    const WELCOME_MESSAGE = {
        role: 'evo',
        content: 'Hello, I am Evo !! Lets Start Summarize Your Ideas...',
    };

    // Load history on mount if user is logged in
    useEffect(() => {
        async function loadHistory() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setIsAuthLoading(false);
                    return;
                }

                const response = await fetch(HISTORY_URL, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    const formattedHistory = data.history.map((msg) => ({
                        role: msg.sender,
                        content: msg.message,
                        timestamp: msg.timestamp,
                    }));
                    setMessages(formattedHistory);
                }
            } catch (error) {
                console.error("Error loading history:", error);
            } finally {
                setIsAuthLoading(false);
            }
        }

        loadHistory();
    }, []);

    // Focus textarea on mount
    useEffect(() => {
        if (textareaRef?.current) {
            textareaRef.current.focus();
        }
    }, []);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.role === 'user') {
            divToEndOfChat.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const appendChunkToLastMessage = useCallback((chunk) => {
        setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];

            if (lastMessage && lastMessage.role === 'evo') {
                return [
                    ...prevMessages.slice(0, -1),
                    {
                        ...lastMessage,
                        content: lastMessage.content + chunk,
                    },
                ];
            }
            return prevMessages;
        });
    }, []);

    async function handleSend() {
        const userMessageContent = content.trim();

        if (userMessageContent.length === 0 || isLoading) return;

        setMessages((prevMessages) => [
            ...prevMessages,
            { content: userMessageContent, role: 'user' },
            { content: '', role: 'evo' },
        ]);

        setContent('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(API_URL, {
                method: 'POST',
                headers,
                body: JSON.stringify({ message: userMessageContent }),
            });

            if (!response.body) {
                // non-streaming fallback: try to parse JSON
                const data = await response.json().catch(() => null);
                if (data && data.reply) {
                    setMessages((prev) => [...prev, { role: 'evo', content: data.reply }]);
                } else {
                    throw new Error("Response body is not available for streaming.");
                }
                return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            while (true) {
                const { value, done } = await reader.read();

                if (done) {
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                console.log("Received chunk:", chunk);
                appendChunkToLastMessage(chunk);
                divToEndOfChat.current?.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error("Streaming Error:", error);
            setMessages((prev) => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage && lastMessage.role === 'evo') {
                    return [
                        ...prev.slice(0, -1),
                        {
                            ...lastMessage,
                            content:
                                (lastMessage.content || "Sorry, ") +
                                "An error occurred while streaming the response. Check the console.",
                        },
                    ];
                }
                return [
                    ...prev,
                    {
                        role: 'evo',
                        content: 'Sorry, an error occurred. Please try again.',
                    },
                ];
            });
        } finally {
            setIsLoading(false);
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    }

    if (isAuthLoading) {
        return (
            <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>Loading...</p>
            </main>
        );
    }

    return (
        <main className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                <h1 className={styles.headlogo}>Evo Note</h1>
                <p className={styles.slogan}>Where Your Ideas Evolve</p>
            </div>

            <div className={styles.ChatBox}>        
                {[WELCOME_MESSAGE, ...messages].map(({ role, content }, index) => (
                    <div
                        key={index}
                        data-role={role}
                        className={styles.Message}
                    >
                        <Markdown>{content}</Markdown>
                    </div>
                ))}

                <div ref={divToEndOfChat}></div>
            </div>

            <div className={styles.chatInput}>
                <TextareaAutosize
                    placeholder="Summarize Your Ideas"
                    className={styles.TextArea}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    minRows={1}
                    maxRows={4}
                    ref={textareaRef}
                />
                <button
                    className={styles.SendBtn}
                    onClick={handleSend}
                    disabled={isLoading}
                >
                              <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#5f6368"
        >
        <path d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z" />
      </svg>
                </button>
            </div>
        </main>
    );
}

export default Chatbox;
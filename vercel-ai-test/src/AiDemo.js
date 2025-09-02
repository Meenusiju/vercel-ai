import { useState } from 'react';
import { useChat } from '@ai-sdk/react';

const styles = {
  container: {
    maxWidth: 480,
    margin: '40px auto',
    padding: 24,
    borderRadius: 12,
    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
    background: '#fff',
    fontFamily: 'Segoe UI, Arial, sans-serif',
  },
  chat: { minHeight: 240, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 },
  bubbleUser: { alignSelf: 'flex-end', background: '#e0f7fa', color: '#00796b', padding: '10px 16px', borderRadius: '16px 16px 0 16px', maxWidth: '80%', wordBreak: 'break-word' },
  bubbleAssistant: { alignSelf: 'flex-start', background: '#f1f8e9', color: '#33691e', padding: '10px 16px', borderRadius: '16px 16px 16px 0', maxWidth: '80%', wordBreak: 'break-word' },
  form: { display: 'flex', gap: 8 },
  input: { flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 16 },
  button: { padding: '0 24px', borderRadius: 8, border: 'none', background: '#00796b', color: '#fff', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' },
  status: { fontSize: 14, color: '#888', marginBottom: 8 }
};

export default function AiDemo() {
  const { messages, status, sendMessage } = useChat({
    api: 'http://localhost:3001/api/chat', // full URL to backend
  });
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.status}>
        {status !== 'ready' && <>Status: {status}</>}
      </div>
      <div style={styles.chat}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={msg.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant}
          >
            {msg.parts.map((part, idx) =>
              part.type === 'text' ? <span key={idx}>{part.text}</span> : null
            )}
          </div>
        ))}
      </div>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          style={styles.input}
          value={input}
          placeholder="Type a message…"
          onChange={(e) => setInput(e.target.value)}
          disabled={status !== 'ready'}
        />
        <button style={styles.button} type="submit" disabled={status !== 'ready'}>
          Send
        </button>
      </form>
    </div>
  );
}

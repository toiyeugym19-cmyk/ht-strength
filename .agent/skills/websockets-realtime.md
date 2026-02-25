---
name: WebSockets & Real-time
description: WebSocket patterns for real-time features, chat, notifications
---

# WebSockets & Real-time

## WebSocket Server

```typescript
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (data) => {
    console.log('Received:', data);
    ws.send(`Echo: ${data}`);
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
```

## Socket.IO

```typescript
// Server
import { Server } from 'socket.io';

const io = new Server(3000);

io.on('connection', (socket) => {
  socket.on('member:create', (data) => {
    io.emit('member:created', data);
  });
});

// Client
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('member:created', (member) => {
  console.log('New member:', member);
});

socket.emit('member:create', { name: 'John' });
```

## React Hook

```typescript
function useWebSocket(url: string) {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const ws = new WebSocket(url);
    
    ws.onmessage = (event) => {
      setMessages(prev => [...prev, event.data]);
    };
    
    return () => ws.close();
  }, [url]);
  
  return messages;
}
```

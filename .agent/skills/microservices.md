---
name: Microservices Architecture
description: Microservices patterns, service communication, and best practices
---

# Microservices

## Service Structure

```
/services
  /member-service
    /src
      /api
      /domain
      /infra
    package.json
  /workout-service
  /notification-service
  /api-gateway
```

## API Gateway

```typescript
// api-gateway/src/index.ts
import express from 'express';
import proxy from 'express-http-proxy';

const app = express();

app.use('/members', proxy('http://member-service:3001'));
app.use('/workouts', proxy('http://workout-service:3002'));
app.use('/notifications', proxy('http://notification-service:3003'));

app.listen(3000);
```

## Service Communication

```typescript
// HTTP REST
const response = await fetch('http://member-service/api/members/123');
const member = await response.json();

// Message Queue (RabbitMQ)
import amqp from 'amqplib';

const connection = await amqp.connect('amqp://localhost');
const channel = await connection.createChannel();

// Publish event
channel.publish('events', 'member.created', Buffer.from(JSON.stringify(member)));

// Subscribe
channel.consume('member.created', (msg) => {
  const member = JSON.parse(msg.content.toString());
  console.log('Member created:', member);
});
```

## Best Practices

✅ Single responsibility per service  
✅ Independent deployments  
✅ Database per service  
✅ Async communication (events)  
✅ Circuit breakers  
✅ Service discovery

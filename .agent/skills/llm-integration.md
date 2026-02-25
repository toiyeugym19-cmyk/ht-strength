---
name: LLM Integration
description: Best practices for integrating Large Language Models into applications
---

# LLM Integration Skill

## Popular LLM APIs

### 1. **OpenAI GPT**
```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const completion = await client.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "system", content: "You are a fitness coach" },
    { role: "user", content: "Create a workout plan" }
  ],
  temperature: 0.7,
  max_tokens: 1000
});
```

### 2. **Anthropic Claude**
```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await client.messages.create({
  model: 'claude-3-opus-20240229',
  max_tokens: 1024,
  messages: [
    { role: 'user', content: 'Hello, Claude' }
  ],
});
```

## Streaming Responses

```typescript
const stream = await client.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Tell me a story' }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  process.stdout.write(content);
}
```

## Function Calling

```typescript
const functions = [{
  name: 'get_member_info',
  description: 'Get information about a gym member',
  parameters: {
    type: 'object',
    properties: {
      member_id: {
        type: 'string',
        description: 'The ID of the member'
      }
    },
    required: ['member_id']
  }
}];

const response = await client.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Show me John Doe' }],
  functions,
  function_call: 'auto'
});
```

## Cost Optimization

1. **Use appropriate models**:
   - gpt-3.5-turbo: Cheap, fast
   - gpt-4: Expensive, best quality
   - claude-haiku: Fast, cheap

2. **Limit tokens**:
   ```typescript
   max_tokens: 500  // Don't over-allocate
   ```

3. **Cache prompts** for repeated queries

4. **Batch requests** when possible

## Error Handling

```typescript
try {
  const response = await client.chat.completions.create({...});
} catch (error) {
  if (error.status === 429) {
    // Rate limit - retry with backoff
    await delay(1000);
  } else if (error.status === 500) {
    // Server error - retry
  } else {
    // Other errors
    throw error;
  }
}
```

## Best Practices

✅ **Do's**:
- Store API keys in environment variables
- Implement rate limiting
- Log usage for cost tracking
- Handle errors gracefully
- Use streaming for long responses

❌ **Don'ts**:
- Hardcode API keys
- Ignore rate limits
- Blindly trust outputs
- Skip input validation

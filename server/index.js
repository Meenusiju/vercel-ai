import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { streamText, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', 'https://vercel.com/meenusijus-projects/vercel-ai-i4jw/Fra3VL24H7DzNdfAEa8FwrfPckAX' }));

app.post('/api/chat', async (req, res) => {
  try {
    let { messages } = req.body;

    // Convert messages from UIMessage[] to ModelMessage[]
    messages = convertToModelMessages(messages);

    const result = await streamText({
      model: openai('gpt-4o'),
      messages,
    });

    // Stream the result using the latest SDK method
    // Some SDK versions have result.textStream
    if (result.textStream) {
      res.setHeader('Content-Type', 'text/event-stream');
      for await (const chunk of result.textStream) {
        res.write(`data: ${chunk.text}\n\n`);
      }
      res.end();
    } else {
      res.json({ text: await result.text() });
    }
  } catch (err) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log('Server listening on http://localhost:3001');
});

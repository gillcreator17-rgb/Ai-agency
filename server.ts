import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON with ample limit for base64 image data
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Lazy/safe initialization for GoogleGenAI
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not defined. AI requests will return fallback or error.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Multi-turn Chat Endpoint with system instructions
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, systemInstruction, model } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const ai = getGenAI();
    const targetModel = model || 'gemini-3.8-flash';

    const formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content || '' }],
    }));

    const defaultInstruction =
      'You are AI Chatbot Agency Consultant, the expert representative of AI Chatbot Agency — a high-end AI Agency specializing in custom AI chatbot models, autonomous customer agents, intelligent lead-qualification bots, and modern digital website engineering. You provide actionable, visionary, and technically sound advice on chatbot integration, pricing tiers, technology stacks, and website transformations. Be professional, engaging, structured, and helpful.';

    const response = await ai.models.generateContent({
      model: targetModel,
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction || defaultInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Thank you for reaching out to AI Chatbot Agency. How can we elevate your digital presence today?';
    res.json({ reply });
  } catch (error: any) {
    console.error('Chat API error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to process chat message with AI Chatbot Agency engine.',
    });
  }
});

// AI Project Proposal & Scope Generator
app.post('/api/generate-proposal', async (req: Request, res: Response) => {
  try {
    const { projectTitle, serviceType, description, budgetRange, timeline } = req.body;

    const ai = getGenAI();

    const prompt = `You are the Lead Solutions Architect at AI Chatbot Agency.
Analyze this client request and generate a structured, comprehensive, and persuasive Project Proposal & Architecture Plan.

Client Request Details:
- Project Title: ${projectTitle || 'Digital Transformation Project'}
- Service Focus: ${serviceType || 'AI Chatbot & Modern Web Development'}
- Requirements / Idea: ${description || 'Build an intelligent chatbot and high-converting web platform'}
- Estimated Budget Tier: ${budgetRange || 'Flexible'}
- Target Timeline: ${timeline || '4-8 weeks'}

Respond in clean, formatted Markdown including:
1. Executive Summary & Value Proposition
2. Recommended AI Model Architecture (e.g., Specialized RAG, fine-tuned agent workflows, latency guarantees)
3. Web Stack & Digital Architecture (e.g., React 19, Tailwind CSS, Cloud Infrastructure, Real-time APIs)
4. Key Deliverables & Milestones (Phase 1 to Launch)
5. Estimated ROI & Performance Metrics (e.g., 24/7 engagement, 40%+ lead capture increase)
6. AI Chatbot Agency Guarantee & Support SLA`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an elite AI Solutions Architect for AI Chatbot Agency. Deliver detailed, compelling, and realistic proposals in crisp Markdown.',
        temperature: 0.7,
      },
    });

    res.json({ proposal: response.text });
  } catch (error: any) {
    console.error('Proposal generation error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate proposal.' });
  }
});

// AI Image Generation Endpoint (for Chatbot Avatars, Web Hero Mockups, Brand Assets)
app.post('/api/generate-image', async (req: Request, res: Response) => {
  try {
    const { prompt, aspectRatio, imageSize } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt string is required.' });
    }

    const ai = getGenAI();

    // Prefer gemini-3.1-flash-image or fallback to gemini-3.1-flash-lite-image
    const model = 'gemini-3.1-flash-image';

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || '1:1',
          imageSize: imageSize || '1K',
        },
      },
    });

    let imageUrl: string | null = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'No image data returned by the model.' });
    }

    res.json({ imageUrl });
  } catch (error: any) {
    console.error('Generate image error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate image.' });
  }
});

// AI Image Edit Endpoint (Create/Edit Images Feature Block)
app.post('/api/edit-image', async (req: Request, res: Response) => {
  try {
    const { prompt, imageBase64, mimeType } = req.body;

    if (!prompt || !imageBase64) {
      return res.status(400).json({ error: 'Both prompt and imageBase64 are required.' });
    }

    const ai = getGenAI();

    // Clean base64 string if it contains prefix
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType || 'image/png',
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    let imageUrl: string | null = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'No edited image returned.' });
    }

    res.json({ imageUrl });
  } catch (error: any) {
    console.error('Edit image error:', error);
    res.status(500).json({ error: error?.message || 'Failed to edit image.' });
  }
});

// Start Server with Vite or Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Chatbot Agency Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start AI Chatbot Agency server:', err);
});

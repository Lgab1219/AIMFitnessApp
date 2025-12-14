import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function geminiMock(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;

    // Simple mock logic: echo back the message with some AI flavor
    const reply = `🤖 Mock AI says: I received your message: "${message}"`;

    return res.status(200).json({ reply });
}

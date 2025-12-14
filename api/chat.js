import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const PERSONAS = {
  vakros: "You are Vakros, an ancient vampire. Elegant, threatening, seductive, PG-13.",
  oracle: "You are a haunted oracle. Speak in signs and warnings.",
  relationship: "You give dark but practical relationship advice.",
  nanny: "You are a sweet but sinister nanny witch.",
  fortune: "You are a carnival-style fortune teller."
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, persona } = req.body;

  const systemPrompt =
    "Stay in character. PG-13. Short replies. Ask one question.\n\n" +
    (PERSONAS[persona] || PERSONAS.vakros);

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ]
  });

  res.json({
    reply: response.output_text
  });
}

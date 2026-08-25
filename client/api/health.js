export default function handler(req, res) {
  res.status(200).json({ status: 'ok', geminiKeyLoaded: Boolean(process.env.GEMINI_API_KEY) });
}

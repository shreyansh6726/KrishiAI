const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const googleTTS = require('google-tts-api'); // Free TTS

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/voice-to-voice', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send('No voice recording found.');

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 1. Voice-to-Text: Get Audio and send to Gemini
        const audioResponse = await fetch(req.file.path);
        const audioBuffer = await audioResponse.arrayBuffer();

        const result = await model.generateContent([
            "You are KrishiAI. Transcribe the spoken audio. Then, provide a short, helpful answer to the farmer's question in the SAME native language they used.",
            {
                inlineData: {
                    data: Buffer.from(audioBuffer).toString("base64"),
                    mimeType: req.file.mimetype 
                }
            }
        ]);

        const aiTextResponse = result.response.text();

        // 2. Text-to-Speech: Convert AI's text back to voice
        // Note: 'hi' for Hindi, 'mr' for Marathi, etc. Gemini can detect this, 
        // but we'll use 'hi' as a default for KrishiAI or pass it from frontend.
        const lang = req.body.language || 'hi'; 
        const ttsUrl = googleTTS.getAudioUrl(aiTextResponse.substring(0, 200), {
            lang: lang,
            slow: false,
            host: 'https://translate.google.com',
        });

        res.json({
            farmerQuestionUrl: req.file.path, // Cloudinary link to original voice
            aiText: aiTextResponse,         // Text version for the screen
            aiVoiceUrl: ttsUrl              // Voice link for the farmer to hear
        });

    } catch (err) {
        console.error("Voice Processing Error:", err);
        res.status(500).json({ error: "KrishiAI could not process the voice input." });
    }
});

module.exports = router;
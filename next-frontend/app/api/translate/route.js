import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Missing text to translate" }, { status: 400 });
    }

    const apiKey = process.env.SARVAM_API_KEY;

    if (!apiKey) {
      console.warn("SARVAM_API_KEY is not configured. Falling back to mock translation.");
      
      // Simple mock translator for testing without API keys
      let translated = text;
      if (text.toLowerCase().includes("toot")) {
        translated = "The fan was already broken.";
      } else if (text.toLowerCase().includes("theek")) {
        translated = "Everything is fine.";
      } else {
        translated = `[Mock Translated] ${text}`;
      }

      return NextResponse.json({
        translated_text: translated,
        source_language_code: "auto",
        mock: true
      });
    }

    const response = await fetch("https://api.sarvam.ai/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey
      },
      body: JSON.stringify({
        input: text,
        source_language_code: "auto",
        target_language_code: "en-IN"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sarvam API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json({
      translated_text: data.translated_text,
      source_language_code: data.source_language_code || "auto"
    });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to translate statement" },
      { status: 500 }
    );
  }
}

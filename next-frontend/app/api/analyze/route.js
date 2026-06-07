import { NextResponse } from "next/server";

async function fetchImageBase64(url) {
  if (url.startsWith("data:")) {
    const matches = url.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-\.\+]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      return {
        mimeType: matches[1],
        data: matches[2]
      };
    }
  }

  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return {
      mimeType: response.headers.get("content-type") || "image/jpeg",
      data: buffer.toString("base64"),
    };
  } catch (error) {
    console.error(`Error fetching image ${url}:`, error);
    return null;
  }
}

export async function POST(request) {
  try {
    const { moveInImages, moveOutImages } = await request.json();

    if (!moveInImages || !moveOutImages) {
      return NextResponse.json(
        { error: "Missing moveInImages or moveOutImages" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn(
        "GEMINI_API_KEY is not configured. Falling back to mock comparison result.",
      );
      return NextResponse.json({
        damageFound: true,
        damageDescription: "Broken ceiling fan",
        estimatedRepairCost: 1200,
        mock: true,
      });
    }

    console.log("Downloading move-in and move-out images...");
    const moveInParts = await Promise.all(
      moveInImages.map((img) => fetchImageBase64(img.url || img)),
    );
    const moveOutParts = await Promise.all(
      moveOutImages.map((img) => fetchImageBase64(img.url || img)),
    );

    // Filter out any failed image downloads
    const validMoveInParts = moveInParts.filter(Boolean);
    const validMoveOutParts = moveOutParts.filter(Boolean);

    if (validMoveInParts.length === 0 && validMoveOutParts.length === 0) {
      console.warn(
        "Could not download any images. Falling back to mock comparison.",
      );
      return NextResponse.json({
        damageFound: true,
        damageDescription: "Broken ceiling fan",
        estimatedRepairCost: 1200,
        mock: true,
      });
    }

    const parts = [
      {
        text: `You are a rental property inspector.
Compare the move-in evidence (first set of photos) and the move-out evidence (second set of photos).
Identify if there are any new damages, broken fixtures, or missing items in the move-out evidence that were not present in the move-in evidence.
Ignore lighting changes, camera angle changes, image quality changes, and normal wear and tear.

Return structured JSON specifying:
- damageFound (boolean)
- damageDescription (string describing the damage or "No new damage found")
- estimatedRepairCost (integer representing cost in Rupees, e.g. 1200, or 0 if none)

Respond ONLY with the JSON object.`,
      },
    ];

    // Add Move-in images labeled
    parts.push({ text: "--- MOVE-IN EVIDENCE ---" });
    validMoveInParts.forEach((p) => {
      parts.push({
        inlineData: {
          mimeType: p.mimeType,
          data: p.data,
        },
      });
    });

    // Add Move-out images labeled
    parts.push({ text: "--- MOVE-OUT EVIDENCE ---" });
    validMoveOutParts.forEach((p) => {
      parts.push({
        inlineData: {
          mimeType: p.mimeType,
          data: p.data,
        },
      });
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: parts,
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                damageFound: { type: "BOOLEAN" },
                damageDescription: { type: "STRING" },
                estimatedRepairCost: { type: "INTEGER" },
              },
              required: [
                "damageFound",
                "damageDescription",
                "estimatedRepairCost",
              ],
            },
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    const result = JSON.parse(resultText.trim());

    return NextResponse.json(result);
  } catch (error) {
    console.error("Gemini Vision analysis error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to analyze evidence with Gemini Vision",
      },
      { status: 500 },
    );
  }
}

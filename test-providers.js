// test-providers.js
const fs = require('fs');

async function testProviders() {
  console.log("Testing Transcribe Route (Groq)...");
  
  try {
    const transcribeRes = await fetch("http://localhost:3000/api/transcribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lectureId: "test-lecture-123",
        audioPath: "public/mock-audio/sample.mp3",
        provider: "groq"
      })
    });
    
    const transcribeData = await transcribeRes.json();
    console.log("Transcribe Data:", JSON.stringify(transcribeData, null, 2));

    if (!transcribeData.success || !transcribeData.data?.transcript) {
        console.error("Transcription failed.");
        return;
    }

    console.log("\n-----------------------------------\n");
    console.log("Testing Transform Route (Groq LLM)...");

    const transformRes = await fetch("http://localhost:3000/api/transform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lectureId: "test-lecture-123",
        transcript: transcribeData.data.transcript,
        provider: "groq" // Switch to Groq
      })
    });

    const transformData = await transformRes.json();
    console.log("Transform Data:", JSON.stringify(transformData, null, 2));

  } catch(e) {
      console.error("Test Error:", e);
  }
}

testProviders();

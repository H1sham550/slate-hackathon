const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function testApi() {
  console.log("Testing GitHub Models Transformation Endpoint...");
  try {
    const res = await fetch("http://localhost:3000/api/transform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        transcript: "This lecture introduces key neural network concepts such as backpropagation and gradient descent. We use these methods to optimize our error functions, ensuring our network accurately learns from the training data by minimizing the loss."
      })
    });
    
    if (!res.ok) {
      console.error("API Error Response:", await res.text());
      return;
    }
    
    const data = await res.json();
    console.log("Success! Received transformed data:");
    console.log("- Summary snippet:", data.summary.substring(0, 50) + "...");
    console.log("- Has Notes:", !!data.notes);
    console.log("- Has Diagram:", !!data.mermaidCode);
    console.log("- Quizzes returned:", data.quiz.length);
    
    // Save output to verify later
    fs.writeFileSync("test-output.json", JSON.stringify(data, null, 2));
    console.log("Full output saved to test-output.json");
    
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

testApi();

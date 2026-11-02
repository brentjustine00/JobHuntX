// Background service worker for JobHuntX AI (MV3) - Powered by Groq (Qwen 2.5)

// Configure side panel to open on clicking the extension toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error("Error setting panel behavior:", error));

// Log activation
console.log("JobHuntX AI Background Worker Initialized (Groq / Qwen).");

// Listener for messages from sidepanel.js or content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GENERATE_TAILORED_ASSETS") {
    // Retrieve the stored API key from chrome.storage.local
    chrome.storage.local.get(["groqApiKey", "geminiApiKey"], (result) => {
      const apiKey = result.groqApiKey || result.geminiApiKey;
      if (!apiKey) {
        sendResponse({
          success: false,
          error: "Groq API Key is missing. Please save your API key (from console.groq.com/keys) in the 'Configuration' tab of the JobHuntX AI side panel."
        });
        return;
      }

      // Execute the async HTTP request to Groq API with Qwen 2.5
      fetchGroqAPI(request.prompt, apiKey)
        .then((data) => {
          sendResponse({ success: true, data: data });
        })
        .catch((error) => {
          console.error("Groq API call failed:", error);
          sendResponse({ success: false, error: formatGroqError(error.message) });
        });
    });
    return true; // Keep message channel open for async response
  }
});

/**
 * Execute Groq Chat Completions API with Qwen models and fallbacks.
 * Uses Groq LPU inference for blazing fast (<1s) JSON generation.
 */
async function fetchGroqAPI(compiledPrompt, apiKey) {
  const models = [
    "qwen-2.5-32b",
    "qwen-2.5-coder-32b",
    "llama-3.3-70b-versatile"
  ];

  let lastError = null;

  for (const model of models) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "system",
              content: "You are an elite Tech Recruiter and Senior Software Engineer. You output responses strictly in valid JSON format."
            },
            {
              role: "user",
              content: compiledPrompt
            }
          ],
          temperature: 0.2,
          response_format: { type: "json_object" }
        })
      });

      if (response.ok) {
        const json = await response.json();
        if (json.choices && json.choices[0] && json.choices[0].message && json.choices[0].message.content) {
          const content = json.choices[0].message.content.trim();
          if (content.length > 0) {
            return content;
          }
        }
      }

      const errorText = await response.text();
      lastError = new Error(`Groq API Error (${response.status} with ${model}): ${errorText || response.statusText}`);

      // If invalid authentication, don't waste time on fallbacks
      if (response.status === 401) {
        throw new Error("Invalid Groq API Key. Please verify your key at https://console.groq.com/keys and re-enter it in the Configuration tab.");
      }

      // If rate limit (429) or model temporarily unavailable (404/503), try next fallback model
      if (response.status === 429 || response.status === 404 || response.status === 503) {
        continue;
      }
    } catch (err) {
      lastError = err;
      if (err.message && err.message.includes("Invalid Groq API Key")) {
        throw err;
      }
    }
  }

  throw lastError || new Error("Failed to receive a valid response from Groq API.");
}

/**
 * Format raw API errors with actionable human-friendly troubleshooting advice.
 */
function formatGroqError(rawErrorMessage) {
  if (rawErrorMessage.includes("429") || rawErrorMessage.includes("rate_limit")) {
    return `Groq Rate Limit Reached (HTTP 429).
Groq has generous free tier limits, but you may have exceeded requests/tokens per minute. Please wait 10-20 seconds and click Generate again.`;
  }

  if (rawErrorMessage.includes("401") || rawErrorMessage.includes("Invalid Groq API Key")) {
    return `Invalid Groq API Key (HTTP 401).
Please get your free API key from https://console.groq.com/keys and paste it in the 'Configuration' tab.`;
  }

  return rawErrorMessage;
}

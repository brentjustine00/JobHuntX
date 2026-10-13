// Background service worker for JobHuntX AI (MV3)

// Configure side panel to open on clicking the extension toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error("Error setting panel behavior:", error));

// Log activation
console.log("JobHuntX AI Background Worker Initialized.");

// Listener for messages from sidepanel.js or content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GENERATE_TAILORED_ASSETS") {
    // Retrieve the stored API key from chrome.storage.local
    chrome.storage.local.get(["geminiApiKey"], (result) => {
      const apiKey = result.geminiApiKey;
      if (!apiKey) {
        sendResponse({
          success: false,
          error: "Gemini API Key is missing. Please save your API key in the 'Configuration' tab of the JobHuntX AI side panel."
        });
        return;
      }

      // Execute the async HTTP request to Gemini API
      fetchGeminiAPIWithFallbacks(request.prompt, apiKey)
        .then((data) => {
          sendResponse({ success: true, data: data });
        })
        .catch((error) => {
          console.error("Gemini API call failed:", error);
          sendResponse({ success: false, error: formatGeminiError(error.message) });
        });
    });
    return true; // Keep message channel open for async response
  }
});

/**
 * Execute Gemini API with multi-endpoint and multi-model fallbacks.
 * Handles rate limits, quota exhaustions, and deprecated/unsupported model names seamlessly.
 */
async function fetchGeminiAPIWithFallbacks(compiledPrompt, apiKey) {
  const attempts = [
    // 1. Interactions endpoint (gemini-2.5-flash / gemini-1.5-flash)
    {
      type: "interaction",
      model: "gemini-2.5-flash",
      url: "https://generativelanguage.googleapis.com/v1beta/interactions"
    },
    {
      type: "interaction",
      model: "gemini-1.5-flash",
      url: "https://generativelanguage.googleapis.com/v1beta/interactions"
    },
    {
      type: "interaction",
      model: "gemini-3.5-flash",
      url: "https://generativelanguage.googleapis.com/v1beta/interactions"
    },
    // 2. Standard generateContent endpoints (widest free tier support across all regions)
    {
      type: "generateContent",
      model: "gemini-2.5-flash",
      url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
    },
    {
      type: "generateContent",
      model: "gemini-1.5-flash",
      url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
    },
    {
      type: "generateContent",
      model: "gemini-2.0-flash",
      url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    }
  ];

  let lastError = null;

  for (const attempt of attempts) {
    try {
      let response;
      if (attempt.type === "interaction") {
        response = await fetch(attempt.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey
          },
          body: JSON.stringify({
            model: attempt.model,
            input: compiledPrompt
          })
        });
      } else {
        response = await fetch(attempt.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: compiledPrompt }]
              }
            ]
          })
        });
      }

      if (response.ok) {
        const jsonResponse = await response.json();
        const parsed = parseGeminiResponse(jsonResponse);
        if (parsed && typeof parsed === "string" && parsed.trim().length > 0) {
          return parsed;
        }
      }

      const errorText = await response.text();
      lastError = new Error(`HTTP ${response.status} (${attempt.model} on ${attempt.type}): ${errorText || response.statusText}`);

      // If it's a 400 Bad Request or 404 Not Found (e.g., model name unsupported), continue immediately to fallback
      // If it's 429 Quota Exceeded, try next model/endpoint because standard generateContent often has independent quota
      if (response.status === 404 || response.status === 400 || response.status === 429) {
        continue;
      }

      // For other client errors like 401/403 (Invalid API key), throw immediately without wasteful retries
      if (response.status === 401 || response.status === 403) {
        throw lastError;
      }
    } catch (err) {
      lastError = err;
      if (err.message && (err.message.includes("401") || err.message.includes("403"))) {
        throw err;
      }
    }
  }

  throw lastError || new Error("All Gemini API model attempts failed.");
}

/**
 * Format raw API errors with actionable human-friendly troubleshooting advice.
 */
function formatGeminiError(rawErrorMessage) {
  if (rawErrorMessage.includes("429") || rawErrorMessage.includes("RESOURCE_EXHAUSTED")) {
    return `Rate limit / Quota reached (HTTP 429).

Why this happens even with a fresh key:
1. Google AI Studio "Limit: 0" Quota: When creating a key in aistudio.google.com, Google sometimes defaults new projects to 0 requests/min if unverified.
   Fix: Go to https://aistudio.google.com/app/apikey, click "Create API key", and select "Create API key in NEW project".
2. Unsaved API Key: Ensure you pasted the key into the "Configuration" tab and clicked "Save Configuration".
3. Free Tier Cooldown: The free tier enforces a strict 15 requests/minute burst ceiling. Wait 30 seconds and try again.`;
  }

  if (rawErrorMessage.includes("400") || rawErrorMessage.includes("INVALID_ARGUMENT")) {
    return `Gemini API Request Error (HTTP 400): The job description prompt payload could not be processed. Details: ${rawErrorMessage.substring(0, 200)}`;
  }

  if (rawErrorMessage.includes("401") || rawErrorMessage.includes("403") || rawErrorMessage.includes("PERMISSION_DENIED")) {
    return `Invalid or Unauthorized API Key (HTTP 403): Please check that your key from https://aistudio.google.com is active and saved correctly in the 'Configuration' tab.`;
  }

  return rawErrorMessage;
}

/**
 * Robust parsing of Gemini API response formats.
 * Handles both the interactions endpoint format and standard generateContent candidates format.
 */
function parseGeminiResponse(responseJson) {
  // 1. Check custom Google AI Studio interactions endpoint response format
  if (responseJson.steps && Array.isArray(responseJson.steps)) {
    const modelStep = responseJson.steps.find(step => step.type === "model_output");
    if (modelStep && modelStep.content && Array.isArray(modelStep.content)) {
      const textContent = modelStep.content.find(c => c.type === "text" && c.text);
      if (textContent && textContent.text) {
        return textContent.text;
      }
    }
  }

  // 2. Standard generateContent endpoint candidates structure
  if (
    responseJson.candidates &&
    responseJson.candidates[0] &&
    responseJson.candidates[0].content &&
    responseJson.candidates[0].content.parts &&
    responseJson.candidates[0].content.parts[0]
  ) {
    return responseJson.candidates[0].content.parts[0].text;
  }

  // 3. Direct output string or message
  if (responseJson.output) {
    return typeof responseJson.output === "string" ? responseJson.output : JSON.stringify(responseJson.output);
  }

  if (responseJson.text) {
    return responseJson.text;
  }

  if (responseJson.response) {
    return responseJson.response;
  }

  // If raw string
  if (typeof responseJson === "string") {
    return responseJson;
  }

  return JSON.stringify(responseJson);
}

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
      fetchGeminiAPI(request.prompt, apiKey)
        .then((data) => {
          sendResponse({ success: true, data: data });
        })
        .catch((error) => {
          console.error("Gemini API call failed:", error);
          sendResponse({ success: false, error: error.message });
        });
    });
    return true; // Keep message channel open for async response
  }
});

/**
 * Perform HTTPS POST request to Google AI Studio Gemini API Interactions endpoint.
 * URL: https://generativelanguage.googleapis.com/v1beta/interactions
 * Headers: x-goog-api-key
 */
async function fetchGeminiAPI(compiledPrompt, apiKey) {
  const url = "https://generativelanguage.googleapis.com/v1beta/interactions";
  
  const payload = {
    model: "gemini-3.5-flash",
    input: compiledPrompt
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (HTTP ${response.status}): ${errorText || response.statusText}`);
  }

  const jsonResponse = await response.json();
  return parseGeminiResponse(jsonResponse);
}

/**
 * Robust parsing of Gemini API response formats.
 * Handles the custom interaction endpoint response as well as standard candidates/output fallback shapes.
 */
function parseGeminiResponse(responseJson) {
  // Check custom Google AI Studio interactions endpoint response format
  if (responseJson.steps && Array.isArray(responseJson.steps)) {
    const modelStep = responseJson.steps.find(step => step.type === "model_output");
    if (modelStep && modelStep.content && Array.isArray(modelStep.content)) {
      const textContent = modelStep.content.find(c => c.type === "text" && c.text);
      if (textContent && textContent.text) {
        return textContent.text;
      }
    }
  }

  // Standard format might return: { "output": "..." } or similar structure.
  if (responseJson.output) {
    return responseJson.output;
  }
  
  // Check typical Google AI Studio structure just in case
  if (
    responseJson.candidates &&
    responseJson.candidates[0] &&
    responseJson.candidates[0].content &&
    responseJson.candidates[0].content.parts &&
    responseJson.candidates[0].content.parts[0]
  ) {
    return responseJson.candidates[0].content.parts[0].text;
  }

  // Check generic text or response fields
  if (responseJson.text) {
    return responseJson.text;
  }

  if (responseJson.response) {
    return responseJson.response;
  }

  // If it's a raw string in some format, or has another nested structure
  if (typeof responseJson === "string") {
    return responseJson;
  }

  // Fallback to JSON stringification if format is entirely unknown
  return JSON.stringify(responseJson);
}

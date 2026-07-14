import { resumeTemplate } from "./resumeTemplate.template.js";

// Default Master Developer Profile Context (populated from Brent's complete resume)
const defaultProfileContext = `[YOUR NAME]
Location: [YOUR LOCATION]
Email: [YOUR EMAIL ADDRESS]
Phone: [YOUR PHONE NUMBER]
GitHub: github.com/[YOUR_GITHUB_USERNAME]
LinkedIn: https://www.linkedin.com/in/[YOUR_LINKEDIN_USERNAME]/

TECHNICAL SKILLS:
- Languages: Python, JavaScript, TypeScript, HTML5, CSS3, SQL
- Backend and Automation: Asyncio, FastAPI, Node.js, REST APIs, Webhooks, Data Pipelines, Web Scraping
- Frontend and Mobile: React, Next.js, React Native, Tailwind CSS, Vercel
- Cloud and Databases: Supabase, OAuth 2.0, GraphQL, SQLite, PostgreSQL
- Tools and Protocols: Git, GitHub, Manifest V3, WebSockets, DOM Manipulation, JSON Parsing, Ngrok

PROJECTS:
1. JobHuntX AI: Automated AI Recruitment and ATS Resume Engine (JavaScript, Chrome Extensions API (Manifest V3), Google Gemini API (Gemini 3.5 Flash), Google Apps Script, html2pdf.js, Chrome SidePanel API, DOM Manipulation):
   - Engineered a Manifest V3 Chrome Extension utilizing an ephemeral background service worker and the Chrome SidePanel API to construct a persistent split-screen workspace for job application workflows.
   - Developed a resilient DOM scraping engine that extracts unstructured HTML job descriptions in real-time from active job boards including LinkedIn, Wellfound, Greenhouse, and Lever.
   - Integrated the Google Gemini 3.5 Flash API to parse target job descriptions and dynamically tailor resumes by selecting the top 3–4 most relevant projects while hiding the rest to fit single-page limits.
   - Built a Google Drive auto-upload sync that compiles resumes client-side using html2pdf.js, uploads the PDF via a Google Apps Script proxy, and dynamically inserts the live shareable links into tailored cover letters.
2. Real-Time OSINT Data Pipeline and Algorithmic Trading Bot (Python, Telethon, Pyrogram (Telegram API), TradeLocker API, WebSockets, Asyncio, Logging):
   - Architected a real-time Open Source Intelligence (OSINT) data pipeline that scrapes, sanitizes, and structure-parses raw text trading signals from dynamic Telegram channels.
   - Built an asynchronous execution engine using Python's asyncio to monitor incoming streams, extract trade parameters including entry price, stop-loss, and take-profit boundaries, and instantaneously convert them into valid JSON payloads.
   - Integrated directly with the TradeLocker API to automate real-time order placement, position management, and execution with sub-second latency.
   - Engineered a comprehensive state-management and error-handling framework to manage network dropouts, API rate limits, and market volatility safeguards, ensuring zero silent failures.
3. Gamified GitHub Analytics Platform and Dynamic Portfolio Builder (React, Next.js, GitHub REST API, GitHub GraphQL API, Supabase, OAuth 2.0, Tailwind CSS):
   - Designed an AI-powered developer insights platform that securely authenticates users via GitHub OAuth 2.0 to access public and private repository metadata.
   - Programmed complex pipeline workers to aggregate repository data footprints, tracking language distributions, commit velocities, complexity trends, and documentation standards.
   - Processed raw repository data through an LLM orchestration layer to generate personalized, gamified career pathways complete with automated achievement badges and milestone metrics.
   - Created a dynamic database schema in Supabase supporting a customizable public portfolio builder, allowing users to host, edit, and render public-facing developer profiles.
4. Distributed Event-Driven Dropshipping Platform with Embedded AI Support (React, Next.js, FastAPI, Supabase (Auth and Database), OpenAI API, CJ Dropshipping Webhooks, Ngrok):
   - Developed a robust, full-stack e-commerce architecture utilizing FastAPI for a high-performance, asynchronous backend paired with Next.js for a responsive frontend.
   - Built a secure webhook receiver infrastructure utilizing Ngrok during development to capture and verify real-time, asynchronous inventory and shipping event payloads from the CJ Dropshipping API.
   - Integrated a production-ready authentication and relational database layer using Supabase, deploying optimized SQL indexing and row-level security (RLS) policies.
   - Implemented an embedded, stateful AI customer support agent and live chat system powered by LLM API streams, utilizing prompt engineering and system-context constraints to handle customer inquiries dynamically.
5. Offline-First EdTech Mobile Application (NPE Board Reviewer) (React Native, Local Caching (SQLite, AsyncStorage), Supabase Sync, Adaptive Testing Algorithms):
   - Designed and published a high-performance mobile application dedicated to NPE Board Exam preparation, featuring an offline-first architecture to ensure seamless functionality in low-connectivity areas.
   - Programmed a custom multi-tiered question generation engine that samples a pool of over 500 questions, organizing them into unique 100-question tier structures with randomized sampling logic.
   - Engineered an offline data-synchronization protocol that caches local progress, quiz scores, and telemetry on the device, silently resolving conflicts and syncing with Supabase once network connectivity is restored.
   - Integrated an AI tutoring module that provides real-time, personalized critique, conceptual feedback, and adaptive learning suggestions based on a user’s weak testing domains.
6. High-Conversion, Core-Web-Vitals Optimized Digital Assets (HTML5, CSS3, Next.js, React, Tailwind CSS, Lighthouse Auditing, Web Performance Optimization):
   - Developed 3 high-fidelity, highly responsive landing pages focusing on semantic HTML, modern CSS practices, and responsive design layouts.
   - Achieved top-tier Google Lighthouse scores approaching 100/100 across Performance, Accessibility, Best Practices, and SEO metrics.
   - Implemented intensive frontend performance optimizations, including strict asset compression, next-gen image formats, code-splitting, lazy loading of non-critical elements, and the elimination of render-blocking resources.
7. Private 1-on-1 WebRTC Video Call Application (React, Vite, WebRTC APIs, Supabase Realtime, Tailwind CSS, CSS Animations):
   - Designed and built a React (Vite) application integrated with Supabase Realtime to host private 1-on-1 video calls utilizing a single shared-password login system.
   - Engineered robust WebRTC peer-to-peer connections with Google STUN servers for seamless ICE candidate negotiation and NAT traversal.
   - Developed custom signaling state layer in Supabase for ICE candidate negotiation and exchange.
   - Implemented auto-reconnect fallback logic (ICE restart and PeerConnection rebuilds) alongside a mobile-first dashboard containing mute, camera toggle, and draggable local preview controls.

WORK EXPERIENCE:
1. [YOUR EMPLOYER] - [YOUR JOB TITLE] ([START DATE] - Present):
   - Manage complex client ticketing workflows via text communication with high efficiency.
   - Optimize standard response cycles by keeping internal communication logs structured and accurate.
2. [YOUR PREVIOUS EMPLOYER] - [YOUR PREVIOUS JOB TITLE] ([START DATE] - [END DATE]):
   - Processed massive visual and physical records arrays into institutional digital tracking databases.
   - Ensured 100% data integrity and input accuracy metrics under rapid processing schedules.

EDUCATION:
- [YOUR DEGREE] - [YOUR STATUS], [YOUR UNIVERSITY] ([EXPECTED GRADUATION])
- Graduated Senior High School, [YOUR HIGH SCHOOL] (2020 - 2022)
- Completed Junior High School, [YOUR JUNIOR HIGH SCHOOL] (2016 - 2020)
- Graduated Elementary, [YOUR ELEMENTARY SCHOOL] (2010 - 2016)`;

// State variables
let currentJobData = {
  title: "No job scanned yet",
  company: "Click scan below to extract details",
  description: "",
  url: ""
};
let tailoredResumeHtml = "";

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  loadConfiguration();
  registerEventListeners();
});

/**
 * Handle Tab Navigation and transitions
 */
function initTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs & panels
      tabs.forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));

      // Set current tab & panel active
      tab.classList.add("active");
      const targetPanel = document.getElementById(tab.dataset.target);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });
}

/**
 * Load saved API key and profile settings from chrome.storage.local
 */
function loadConfiguration() {
  chrome.storage.local.get(["geminiApiKey", "developerProfile", "gdriveUrl"], (result) => {
    if (result.geminiApiKey) {
      document.getElementById("input-api-key").value = result.geminiApiKey;
    }
    if (result.gdriveUrl) {
      document.getElementById("input-gdrive-url").value = result.gdriveUrl;
    }
    
    // Set developer profile (use default if not saved yet)
    let profileText = result.developerProfile || defaultProfileContext;
    
    // Automatically migrate old default profile details to the new details if they are present
    let needsUpdate = false;
    if (profileText && (profileText.includes("Lico De Bay") || profileText.includes("JobHuntX AI: Automated Resume & Cover Letter Tailoring Suite"))) {
      if (profileText.includes("Scraped, parsed and sanitized text trading signals from Telegram.")) {
        // Safe to replace the entire profile text since they are using the old default set of projects
        profileText = defaultProfileContext;
      } else {
        // Surgical updates
        profileText = profileText
          .replace("JobHuntX AI: Automated Resume & Cover Letter Tailoring Suite (JavaScript, Manifest V3, Gemini API, Google Apps Script, Chrome Extension APIs, DOM Manipulation):", "JobHuntX AI: Automated AI Recruitment and ATS Resume Engine (JavaScript, Chrome Extensions API (Manifest V3), Google Gemini API (Gemini 3.5 Flash), Google Apps Script, html2pdf.js, Chrome SidePanel API, DOM Manipulation):")
          .replace("Built a Chrome extension that scrapes and parses unstructured HTML of active job listings directly from LinkedIn and Wellfound.", "Engineered a Manifest V3 Chrome Extension utilizing an ephemeral background service worker and the Chrome SidePanel API to construct a persistent split-screen workspace for job application workflows.")
          .replace("Engineered a dynamic project-filtering and tailoring engine that maps developer profiles against job specifications to ensure single-page resume ATS compliance.", "Developed a resilient DOM scraping engine that extracts unstructured HTML job descriptions in real-time from active job boards including LinkedIn, Wellfound, Greenhouse, and Lever.")
          .replace("Orchestrated background service workers for secure Gemini API integration, generating hook-focused cover letters and tailored engineering resumes.", "Integrated the Google Gemini 3.5 Flash API to parse target job descriptions and dynamically tailor resumes by selecting the top 3–4 most relevant projects while hiding the rest to fit single-page limits.")
          .replace("Implemented Google Drive synchronization via a Google Apps Script proxy to auto-upload generated PDFs and embed live links into cover letters.", "Built a Google Drive auto-upload sync that compiles resumes client-side using html2pdf.js, uploads the PDF via a Google Apps Script proxy, and dynamically inserts the live shareable links into tailored cover letters.")
          .replace("Lico De Bay", "Liceo De Bay");
      }
      needsUpdate = true;
    }
    
    document.getElementById("profile-context-textarea").value = profileText;
    
    if (!result.developerProfile || needsUpdate) {
      chrome.storage.local.set({ developerProfile: profileText });
    }
  });

  // Render initial default resume in the preview pane
  updateResumePreview(resumeTemplate);
}

/**
 * Set up listeners for buttons and form interactions
 */
function registerEventListeners() {
  // Scraper Page Scanner trigger
  document.getElementById("btn-scan-page").addEventListener("click", scanCurrentTab);

  // Gemini Tailor execution trigger
  document.getElementById("btn-generate").addEventListener("click", generateTailoredAssets);

  // Copy cover letter to clipboard
  document.getElementById("btn-copy-cl").addEventListener("click", copyCoverLetter);

  // Save Config buttons
  document.getElementById("btn-save-config").addEventListener("click", saveApiKey);
  document.getElementById("btn-save-gdrive").addEventListener("click", saveGDriveUrl);
  document.getElementById("btn-save-profile").addEventListener("click", saveProfileContext);

  // Download PDF compilation
  document.getElementById("btn-download-pdf").addEventListener("click", downloadPDF);
  document.getElementById("btn-download-pdf-preview").addEventListener("click", downloadPDF);
}

/**
 * Scan current active tab via the content script
 */
function scanCurrentTab() {
  showLoading("Scanning active job page...");

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || tabs.length === 0) {
      hideLoading();
      alert("No active tab found. Please navigate to a job listing page.");
      return;
    }

    const activeTab = tabs[0];
    
    // Attempt sending message to content script on active tab
    chrome.tabs.sendMessage(activeTab.id, { action: "SCAN_JOB_PAGE" }, (response) => {
      hideLoading();
      
      if (chrome.runtime.lastError) {
        console.warn("Script injection fallback required:", chrome.runtime.lastError);
        // Script might not be loaded yet; inject it manually
        injectContentScript(activeTab.id);
        return;
      }

      if (response && response.success) {
        updateJobUI(response.data);
      } else {
        alert("Failed to scan the job page. The content script might not be running on this URL.");
      }
    });
  });
}

/**
 * Backup inject content script if the page was loaded before extension initialization
 */
function injectContentScript(tabId) {
  showLoading("Initializing scanner on tab...");
  chrome.scripting.executeScript(
    {
      target: { tabId: tabId },
      files: ["content.js"]
    },
    () => {
      if (chrome.runtime.lastError) {
        hideLoading();
        alert("Cannot script this page. Browser system pages are protected.");
        return;
      }

      // Retry sending message after injection
      setTimeout(() => {
        chrome.tabs.sendMessage(tabId, { action: "SCAN_JOB_PAGE" }, (response) => {
          hideLoading();
          if (response && response.success) {
            updateJobUI(response.data);
          } else {
            alert("Scanner initialized but failed to parse page contents.");
          }
        });
      }, 300);
    }
  );
}

/**
 * Update the DOM interface with scraped job data
 */
function updateJobUI(jobData) {
  currentJobData = jobData;
  document.getElementById("scraped-title").textContent = jobData.title;
  document.getElementById("scraped-company").textContent = jobData.company;
  document.getElementById("job-description-raw").value = jobData.description;
}

/**
 * Compile prompt and coordinate with background.js to hit Gemini API
 */
async function generateTailoredAssets() {
  const jobDesc = document.getElementById("job-description-raw").value;
  if (!jobDesc.trim()) {
    alert("Please scan a job page or paste the job description first.");
    return;
  }

  // Fetch latest developer profile and API key
  chrome.storage.local.get(["geminiApiKey", "developerProfile"], async (config) => {
    if (!config.geminiApiKey) {
      alert("API Key is missing! Go to the 'Configuration' tab and input your Google AI Studio API key.");
      return;
    }

    const developerProfile = config.developerProfile || defaultProfileContext;

    showLoading("Generating tailored assets via Gemini...");

    // Build the exact requested orchestration instruction with enhanced hook cover letter requirements
    const basePrompt = `You are an elite Tech Recruiter. Analyze this Job Description [INSERT_JOB_DESC] against this Developer Profile [INSERT_PROFILE]. Generate two distinct JSON strings:
1. 'coverLetter': A 3-paragraph, punchy, high-signal cover letter focusing heavily on my real-world engineering integrations (FastAPI, Webhooks, Algorithmic Randomization, Scraping, TradeLocker API), entirely omitting generic corporate fluff. Please include a [Resume Link] placeholder in the text where my tailored resume link can be inserted. Make sure the cover letter starts with a highly engaging, custom "hook" intro that immediately captures the attention of a technical manager by addressing their core architectural pain points, followed by a metrics-driven body showing how I can solve them, and ending with a direct, confident peer-to-peer call to action.
2. 'resumeBullets': Highly optimized, ATS-targeted bullet points rewritten to echo the exact keywords and performance metrics demanded by the job posting. Choose the top 3 or 4 projects that are most relevant to this job description and assign bullets to them.`;

    // Replace the placeholders with the actual content
    let compiledPrompt = basePrompt
      .replace("[INSERT_JOB_DESC]", jobDesc)
      .replace("[INSERT_PROFILE]", developerProfile);

    // Append JSON formatting requirements to ensure reliable extraction
    compiledPrompt += `\n\nCRITICAL REQUIREMENT: Output your response ONLY as a single valid JSON object containing exactly the keys:
- 'coverLetter': A string containing the tailored hook cover letter with paragraphs separated by \\n\\n.
- 'selectedProjects': An array of exactly 3 or 4 project IDs selected from: ['project-recruitment', 'project-trading', 'project-github', 'project-dropshipping', 'project-edtech', 'project-digitalassets', 'project-webrtc'].
- 'resumeBullets': An object mapping the selected project IDs to an array of 1 or 2 tailored bullet strings for each. The total number of bullets across all selected projects must equal exactly 6.

Format:
{
  "coverLetter": "...",
  "selectedProjects": ["project-recruitment", "project-trading", "project-dropshipping"],
  "resumeBullets": {
    "project-recruitment": ["bullet 1", "bullet 2"],
    "project-trading": ["bullet 3", "bullet 4"],
    "project-dropshipping": ["bullet 5", "bullet 6"]
  }
}
Do not wrap your output in markdown formatting tags (e.g. \`\`\`json). Return the raw JSON block directly. Do not add any text before or after the JSON.`;

    // Send to background service worker
    chrome.runtime.sendMessage(
      { type: "GENERATE_TAILORED_ASSETS", prompt: compiledPrompt },
      (response) => {
        hideLoading();
        
        if (!response) {
          alert("Error: No response received from the extension background service worker.");
          return;
        }

        if (!response.success) {
          alert(`Failed: ${response.error}`);
          return;
        }

        handleAIOutput(response.data);
      }
    );
  });
}

/**
 * Handle, clean, and parse the raw LLM output text
 */
function handleAIOutput(rawText) {
  try {
    const parsedData = robustParse(rawText);
    
    // Display resume bullets in the Tailor console
    let bulletsHtml = "";
    if (typeof parsedData.resumeBullets === "object" && !Array.isArray(parsedData.resumeBullets)) {
      for (const [projId, bullets] of Object.entries(parsedData.resumeBullets)) {
        const readableTitle = projId.replace("project-", "").replace("-", " ").toUpperCase();
        bulletsHtml += `<h4 style="margin-top: 8px; color: var(--accent-color); font-size: 0.8rem;">${readableTitle}</h4>`;
        bulletsHtml += bullets.map(b => `<p style="margin-bottom: 4px; margin-left: 8px;">• ${b}</p>`).join("");
      }
    } else if (Array.isArray(parsedData.resumeBullets)) {
      bulletsHtml = parsedData.resumeBullets
        .map((b, idx) => `<p style="margin-bottom: 6px;"><strong>Bullet ${idx + 1}:</strong> ${b}</p>`)
        .join("");
    }
    document.getElementById("output-resume-bullets").innerHTML = bulletsHtml;

    // Apply tailors directly into the HTML resume template
    tailorResumeTemplate(parsedData.resumeBullets, parsedData.selectedProjects);

    // Show result cards
    document.getElementById("results-section").style.display = "flex";
    
    // Enable PDF download buttons
    document.getElementById("btn-download-pdf-preview").removeAttribute("disabled");

    // Fetch Google Drive URL settings
    chrome.storage.local.get(["gdriveUrl"], (res) => {
      const gdriveUrl = res.gdriveUrl;
      if (gdriveUrl && gdriveUrl.trim()) {
        // Automatically compile PDF blob and upload to Google Drive!
        autoCompileAndUploadToDrive(parsedData.coverLetter, gdriveUrl);
      } else {
        // Display cover letter directly (with normal placeholder)
        displayCoverLetter(parsedData.coverLetter);
        alert("Tailored Cover Letter and Resume Bullets Generated Successfully!");
      }
    });

  } catch (error) {
    console.error("Parsing failed. Raw output: ", rawText);
    alert(`Failed to parse AI output: ${error.message}\n\nRaw output received (first 400 chars):\n${(rawText || '').substring(0, 400)}`);
  }
}

/**
 * Robust parsing of Gemini output to handle double JSON, markdown wrappers, or raw text fallbacks.
 */
function robustParse(rawText) {
  let text = rawText.trim();
  
  // Clean markdown wrappers
  if (text.startsWith("```json")) {
    text = text.substring(7);
  } else if (text.startsWith("```")) {
    text = text.substring(3);
  }
  if (text.endsWith("```")) {
    text = text.slice(0, -3);
  }
  text = text.trim();

  // 1. Try parsing directly
  try {
    const parsed = JSON.parse(text);
    if (parsed.coverLetter && (parsed.resumeBullets || parsed.selectedProjects)) {
      return {
        coverLetter: parsed.coverLetter,
        resumeBullets: parsed.resumeBullets || {},
        selectedProjects: parsed.selectedProjects || []
      };
    }
  } catch (e) {
    console.warn("Direct JSON.parse failed. Attempting fallback parse.");
  }

  // 2. Try parsing separate JSON blocks (e.g. if the model outputted multiple JSON arrays/objects)
  const jsonObjects = [];
  const objRegex = /\{[\s\S]*?\}/g;
  let match;
  while ((match = objRegex.exec(text)) !== null) {
    try {
      const parsedObj = JSON.parse(match[0]);
      jsonObjects.push(parsedObj);
    } catch (err) {
      // Skip partial invalid brackets
    }
  }

  let coverLetter = "";
  let resumeBullets = {};
  let selectedProjects = [];

  for (const obj of jsonObjects) {
    if (obj.coverLetter) coverLetter = obj.coverLetter;
    if (obj.selectedProjects && Array.isArray(obj.selectedProjects)) {
      selectedProjects = obj.selectedProjects;
    }
    if (obj.resumeBullets) {
      resumeBullets = obj.resumeBullets;
    }
  }

  // 3. Regex Fallbacks if JSON elements are still missing
  if (!coverLetter) {
    const clMatch = text.match(/"coverLetter"\s*:\s*"([\s\S]*?)"(?=\s*,\s*"|\s*})/i);
    if (clMatch) {
      coverLetter = clMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
    } else {
      // Find the three longest text paragraphs as cover letter
      const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 80);
      if (paragraphs.length >= 3) {
        coverLetter = paragraphs.slice(0, 3).join("\n\n");
      }
    }
  }

  // If resumeBullets is empty/array fallback
  if (Object.keys(resumeBullets).length === 0) {
    // Check if there is a flat list of bullets instead
    const bulletsMatch = text.match(/"resumeBullets"\s*:\s*\[([\s\S]*?)\]/i);
    if (bulletsMatch) {
      const arrContent = bulletsMatch[1];
      const strRegex = /"([\s\S]*?)"/g;
      let m;
      const list = [];
      while ((m = strRegex.exec(arrContent)) !== null) {
        list.push(m[1].replace(/\\"/g, '"').replace(/\\n/g, "\n"));
      }
      resumeBullets = list;
    }
  }

  return {
    coverLetter: coverLetter || "Could not tailor cover letter text automatically. Please verify console logs.",
    resumeBullets: resumeBullets,
    selectedProjects: selectedProjects
  };
}

/**
 * Render the cover letter into the UI
 */
function displayCoverLetter(clText) {
  document.getElementById("output-cover-letter").textContent = clText;
}

/**
 * Automate PDF compilation into a Blob and POST it to Google Apps Script
 */
function autoCompileAndUploadToDrive(coverLetterText, webAppUrl) {
  showLoading("Uploading tailored PDF to Google Drive...");

  const htmlToCompile = tailoredResumeHtml || resumeTemplate;
  const sandbox = document.getElementById("hidden-resume-sandbox");
  sandbox.innerHTML = htmlToCompile;

  const targetElement = sandbox.querySelector(".resume-container") || sandbox;
  const companyNameClean = (currentJobData.company || "Company").trim().replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `Brent_Barbadillo_Resume_${companyNameClean}.pdf`;

  const options = {
    margin: [0.35, 0.4, 0.35, 0.4],
    filename: filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2.5, useCORS: true, letterRendering: true },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
  };

  // output('blob') renders the compilation directly into memory
  html2pdf()
    .set(options)
    .from(targetElement)
    .output("blob")
    .then((pdfBlob) => {
      sandbox.innerHTML = ""; // Clear sandbox
      
      // Convert PDF Blob to Base64 string for JSON transit
      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        
        // POST to Google Apps Script proxy
        fetch(webAppUrl, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify({
            base64: base64String,
            filename: filename
          })
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`);
          }
          return response.json();
        })
        .then((result) => {
          hideLoading();
          if (result.success) {
            console.log("Auto-upload completed! Google Drive Link: ", result.url);
            
            // Search and replace placeholder link in the cover letter
            const mergedLetter = mergeDriveLinkIntoCoverLetter(coverLetterText, result.url);
            displayCoverLetter(mergedLetter);
            
            alert("Success! Tailored resume uploaded to Google Drive. Link automatically merged into your Cover Letter!");
          } else {
            console.error("Apps Script reported error:", result.error);
            alert(`Drive Upload error: ${result.error}. Cover letter generated with default placeholder.`);
            displayCoverLetter(coverLetterText);
          }
        })
        .catch((error) => {
          hideLoading();
          console.error("Sync fetch error:", error);
          alert(`Google Drive Upload failed. Please check your Web App URL, deployment settings, and console logs. Cover letter generated with default placeholder.`);
          displayCoverLetter(coverLetterText);
        });
      };
    })
    .catch((pdfErr) => {
      hideLoading();
      sandbox.innerHTML = "";
      console.error("PDF Blob generation failed:", pdfErr);
      alert("Resume compiled but PDF generation failed. Cover letter generated with default placeholder.");
      displayCoverLetter(coverLetterText);
    });
}

/**
 * Merge the Google Drive shareable link into the cover letter body
 */
function mergeDriveLinkIntoCoverLetter(coverLetter, driveLink) {
  // Common placeholders LLMs generate
  const placeholders = [
    /\[\s*Insert\s+Resume\s+Link\s*\]/gi,
    /\[\s*Resume\s+Link\s*\]/gi,
    /\[\s*link\s*\]/gi,
    /\[\s*your\s+resume\s+link\s*\]/gi,
    /\[\s*portfolio\/resume\s+link\s*\]/gi,
    /\[\s*insert\s+link\s+here\s*\]/gi
  ];

  let replaced = false;
  let resultText = coverLetter;

  for (const regex of placeholders) {
    if (regex.test(resultText)) {
      resultText = resultText.replace(regex, driveLink);
      replaced = true;
    }
  }

  // If no placeholder matched, prepend/append it at the bottom of the letter
  if (!replaced) {
    resultText += `\n\nTailored Resume: ${driveLink}`;
  }
  return resultText;
}

/**
 * Inject the tailored bullet points into the resumeTemplate variables
 */
function tailorResumeTemplate(bullets, selectedProjects) {
  // Create a document element from the resume template string
  const parser = new DOMParser();
  const doc = parser.parseFromString(resumeTemplate, "text/html");

  const allProjectIds = [
    "project-recruitment",
    "project-trading",
    "project-github",
    "project-dropshipping",
    "project-edtech",
    "project-digitalassets",
    "project-webrtc"
  ];

  // If selectedProjects is provided and has items, hide the others and inject bullets
  if (selectedProjects && Array.isArray(selectedProjects) && selectedProjects.length > 0) {
    allProjectIds.forEach((projId) => {
      const projEl = doc.getElementById(projId);
      if (projEl) {
        if (selectedProjects.includes(projId)) {
          // Show project
          projEl.style.display = "block";
          
          // Inject custom bullets if provided
          const projectBullets = bullets[projId];
          if (projectBullets && Array.isArray(projectBullets)) {
            const bulletContainer = projEl.querySelector(".bullets");
            if (bulletContainer) {
              bulletContainer.innerHTML = projectBullets
                .map(b => `<li>${b}</li>`)
                .join("");
            }
          }
        } else {
          // Hide project to keep resume single-paged and highly focused
          projEl.style.display = "none";
        }
      }
    });
  } else {
    // Fallback: If AI returned flat array or select failed, show default projects and inject flat list
    const flatBullets = Array.isArray(bullets) ? bullets : Object.values(bullets).flat();
    
    // Show top 4 projects, hide others
    const defaultVisible = ["project-recruitment", "project-trading", "project-dropshipping", "project-edtech"];
    allProjectIds.forEach((projId) => {
      const projEl = doc.getElementById(projId);
      if (projEl) {
        if (defaultVisible.includes(projId)) {
          projEl.style.display = "block";
        } else {
          projEl.style.display = "none";
        }
      }
    });

    // Distribute flat bullets to visible projects
    const b1 = flatBullets[0] || "Built a zero-input browser extension scraper for Wellfound & LinkedIn.";
    const b2 = flatBullets[1] || "Architected a real-time OSINT data pipeline scraping signals from Telegram.";
    const b3 = flatBullets[2] || "Designed an AI-powered developer insights platform authenticating via GitHub OAuth.";
    const b4 = flatBullets[3] || "Developed robust e-commerce architecture utilizing FastAPI backend.";
    const b5 = flatBullets[4] || "Published Board Exam prep mobile app with offline-first caching.";
    const b6 = flatBullets[5] || "Developed 3 responsive landing pages focusing on semantic HTML layouts.";

    const elB1 = doc.getElementById("bullet-project1");
    const elB2 = doc.getElementById("bullet-project2");
    const elB3 = doc.getElementById("bullet-project3");
    const elB4 = doc.getElementById("bullet-project4");
    const elB5 = doc.getElementById("bullet-project5");
    const elB6 = doc.getElementById("bullet-project6");

    if (elB1) elB1.textContent = b1;
    if (elB2) elB2.textContent = b2;
    if (elB3) elB3.textContent = b3;
    if (elB4) elB4.textContent = b4;
    if (elB5) elB5.textContent = b5;
    if (elB6) elB6.textContent = b6;
  }

  // Serialize back to HTML string
  tailoredResumeHtml = doc.documentElement.outerHTML;

  // Update preview panel frame
  updateResumePreview(tailoredResumeHtml);
}

/**
 * Render HTML content inside the preview iframe safely
 */
function updateResumePreview(htmlString) {
  const iframe = document.getElementById("resume-preview-frame");
  if (iframe) {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(htmlString);
    doc.close();
  }
}

/**
 * Copy cover letter text block to clipboard
 */
function copyCoverLetter() {
  const text = document.getElementById("output-cover-letter").textContent;
  navigator.clipboard.writeText(text).then(() => {
    const status = document.getElementById("cl-copy-status");
    status.style.display = "inline";
    setTimeout(() => {
      status.style.display = "none";
    }, 2000);
  });
}

/**
 * Trigger html2pdf compilation and download to disk
 */
function downloadPDF() {
  const htmlToCompile = tailoredResumeHtml || resumeTemplate;
  const sandbox = document.getElementById("hidden-resume-sandbox");
  sandbox.innerHTML = htmlToCompile;

  const targetElement = sandbox.querySelector(".resume-container") || sandbox;
  const companyNameClean = (currentJobData.company || "Company").trim().replace(/[^a-zA-Z0-9]/g, "_");
  
  const options = {
    margin: [0.35, 0.4, 0.35, 0.4], // [top, left, bottom, right] margins in inches
    filename: `Brent_Barbadillo_Resume_${companyNameClean}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2.5, useCORS: true, letterRendering: true },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
  };

  showLoading("Compiling PDF Resume...");

  // Execute html2pdf bundle compilation
  html2pdf()
    .set(options)
    .from(targetElement)
    .save()
    .then(() => {
      hideLoading();
      sandbox.innerHTML = ""; // Clear sandbox
    })
    .catch((err) => {
      hideLoading();
      console.error("PDF Compilation error:", err);
      alert(`PDF Compilation failed: ${err.message}`);
    });
}

/**
 * Save Google AI Studio API Key
 */
function saveApiKey() {
  const apiKey = document.getElementById("input-api-key").value.trim();
  if (!apiKey) {
    alert("Please enter a valid API key.");
    return;
  }
  chrome.storage.local.set({ geminiApiKey: apiKey }, () => {
    alert("Gemini API Settings saved successfully!");
  });
}

/**
 * Save Google Drive Apps Script URL
 */
function saveGDriveUrl() {
  const url = document.getElementById("input-gdrive-url").value.trim();
  chrome.storage.local.set({ gdriveUrl: url }, () => {
    alert("Google Drive settings saved successfully!");
  });
}

/**
 * Save Developer Profile Prompt Context
 */
function saveProfileContext() {
  const profileText = document.getElementById("profile-context-textarea").value.trim();
  if (!profileText) {
    alert("Developer profile content cannot be empty.");
    return;
  }
  chrome.storage.local.set({ developerProfile: profileText }, () => {
    alert("Master Developer Profile context updated successfully!");
  });
}

// UI Loader Helpers
function showLoading(text) {
  const overlay = document.getElementById("loading-overlay");
  const loadingText = document.getElementById("loading-text");
  loadingText.textContent = text;
  overlay.style.display = "flex";
}

function hideLoading() {
  document.getElementById("loading-overlay").style.display = "none";
}

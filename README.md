# JobHuntX AI - Chrome Extension

**JobHuntX AI** is a high-performance, modern Manifest V3 Chrome Extension designed as an automated, real-time Cover Letter Generator and ATS-Friendly Resume Tailoring Suite. 

By analyzing active job descriptions directly from platforms like LinkedIn, Wellfound, Greenhouse, and Lever, the extension maps your master developer profile against job requirements. It leverages the **Google Gemini 3.5 Flash** model to generate a custom, hook-focused cover letter and tailors your resume dynamically—focusing on the most relevant technical projects and compiling them into a downloadable, single-page ATS-compliant PDF.

---

## Key Features

- **Manifest V3 Service Worker**: Engineered using an ephemeral background service worker (`background.js`) and leverages the `chrome.sidePanel` API to provide a persistent, split-screen UI workflow.
- **Dynamic Project Focusing**: Automatically selects the top 3–4 most relevant projects matching the target job description and hides the remaining projects. This guarantees a highly targeted, high-signal, single-page tailored resume.
- **High-Hook Cover Letter Generation**: Generates a 3-paragraph, peer-to-peer engineering cover letter starting with an attention-grabbing hook detailing your integrations (FastAPI, Webhooks, Algorithmic Randomization, Scraping, TradeLocker API).
- **Google Drive Auto-Upload Sync**: Automatically compiles your tailored resume into a PDF blob, uploads it to your Google Drive via a lightweight Google Apps Script proxy, and dynamically swaps out the `[Resume Link]` placeholder in your cover letter with the live, shareable Drive link.
- **Real-Time HTML Preview**: Provides an interactive preview tab that displays your tailored resume in real-time before downloading.

---

## File Structure

```text
JobHuntX/
├── manifest.json            # Extension configuration (MV3 permissions, scripts)
├── background.js           # Ephemeral service worker managing Gemini API interactions
├── content.js              # Resilient DOM scraping engine for job descriptions
├── sidepanel.html          # Split-screen neon-dark layout dashboard
├── sidepanel.js            # Main controller for state, API, and PDF downloads
├── resumeTemplate.js       # ATS-optimized HTML/CSS resume template literal
├── html2pdf.bundle.min.js  # Bundled library for client-side PDF compilation
└── icon.png                # Extension logo asset
```

---

## Installation Guide

To load the extension on your Google Chrome browser:

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** using the toggle switch in the top-right corner.
3. Click the **Load unpacked** button in the top-left corner.
4. Select your local `JobHuntX` project folder:
   `c:\Users\brent justine\Documents\Projects\JobHuntX`
5. Open your Chrome extensions menu (puzzle icon in the toolbar) and pin **JobHuntX AI** for quick access.

---

## Configuration & Setup

### 1. Google AI Studio Settings
1. Click the pinned **JobHuntX AI** icon to launch the side panel.
2. Navigate to the **Configuration** tab.
3. Paste your Gemini API Key in the **Gemini API Key** field and click **Save Settings**.

### 2. Google Drive Auto-Upload Settings (Optional)
To have the extension automatically compile your resume, upload it to Google Drive, and insert the link into your cover letter:
1. Open the **Configuration** tab in the side panel.
2. Under **Google Drive Auto-Upload**, click **Show Apps Script Code** and copy the code snippet.
3. Go to [script.google.com](https://script.google.com/) and create a new project.
4. Paste the copied snippet into `Code.gs` and save.
5. Click **Deploy** > **New deployment**. Select **Web app** as the type.
6. Configure the deployment details:
   - **Execute as:** `Me (your email)`
   - **Who has access:** `Anyone`
7. Click **Deploy**, authorize permissions, and copy the generated **Web App URL**.
8. Paste the Web App URL into the **Apps Script Web App URL** input field in the side panel's Configuration tab and click **Save Drive Settings**.

---

## How to Use

1. Navigate to any active job listing on **LinkedIn**, **Wellfound**, **Greenhouse**, or **Lever**.
2. Click the **JobHuntX AI** icon in your toolbar to open the side panel.
3. Click the **Scan Job Page** button. The job title, company, and raw description text will automatically populate.
4. Click **Tailor Resume & Cover Letter**.
5. Once tailoring is complete:
   - Your tailored cover letter with the integrated Google Drive resume link will appear in the **Tailored Cover Letter** box. Click **Copy to Clipboard** to copy it.
   - The selected projects and their tailored bullets will be listed in the side panel.
   - Switch to the **Preview Resume** tab to view your tailored resume, or click **Download Tailored ATS PDF** to download it directly to your machine.

// ATS-Optimized HTML/CSS Resume Template for data-binding and PDF compilation
// Pre-populated with clean, anonymized placeholders for GitHub showcase

export const resumeTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>[YOUR NAME] - Technical Resume</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #1a1a1a;
      line-height: 1.4;
      margin: 0;
      padding: 0;
      font-size: 9.5pt;
    }
    .resume-container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      padding: 30px 40px;
      box-sizing: border-box;
    }
    
    /* Header Section */
    .header {
      text-align: center;
      margin-bottom: 12px;
    }
    .header h1 {
      margin: 0 0 4px 0;
      font-size: 22pt;
      color: #0f2d59; /* Classic deep blue */
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: bold;
    }
    .header-links {
      font-size: 9pt;
      color: #333333;
      margin: 3px 0;
    }
    .header-links span {
      margin: 0 5px;
    }
    .header-links a {
      color: #0f2d59;
      text-decoration: none;
    }
    .header-links a:hover {
      text-decoration: underline;
    }
    
    /* Section Headings */
    .section-title {
      font-size: 11.5pt;
      font-weight: bold;
      color: #0f2d59;
      border-bottom: 2px solid #0f2d59;
      text-transform: uppercase;
      margin-top: 16px;
      margin-bottom: 8px;
      padding-bottom: 2px;
      letter-spacing: 0.5px;
    }
    
    /* Skills */
    .skills-grid {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 8px;
    }
    .skills-line {
      font-size: 9.5pt;
    }
    .skills-line strong {
      color: #1a1a1a;
    }
    
    /* Projects/Experience Grouping */
    .project-item {
      margin-bottom: 12px;
      page-break-inside: avoid; /* Avoid splitting a single project across pages */
    }
    .project-header {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      font-size: 10pt;
      color: #1a1a1a;
      margin-bottom: 1px;
    }
    .project-tech {
      font-style: italic;
      color: #555555;
      font-size: 8.5pt;
      margin-bottom: 4px;
    }
    .bullets {
      margin: 0;
      padding-left: 20px;
      font-size: 9pt;
      color: #2b2b2b;
    }
    .bullets li {
      margin-bottom: 3px;
    }
    
    /* Work Experience */
    .work-item {
      margin-bottom: 8px;
      page-break-inside: avoid;
    }
    .work-header {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      font-size: 10pt;
      color: #1a1a1a;
      margin-bottom: 2px;
    }
    .work-date {
      font-style: italic;
      font-weight: normal;
      color: #555555;
      font-size: 9pt;
    }
    
    /* Education */
    .education-item {
      display: flex;
      justify-content: space-between;
      font-size: 9.5pt;
      margin-bottom: 4px;
    }
    .education-sub {
      font-style: italic;
      color: #555555;
      font-size: 8.5pt;
      margin-top: -3px;
      margin-bottom: 6px;
    }

    /* Page-break helpers */
    .page-break {
      page-break-before: always;
    }
    
    @media print {
      body {
        color: #000;
        font-size: 9pt;
      }
      .resume-container {
        padding: 0;
        max-width: 100%;
      }
      a {
        color: #000;
        text-decoration: none;
      }
    }
  </style>
</head>
<body>
  <div class="resume-container" id="resume-content">
    
    <!-- Page 1 Header -->
    <div class="header">
      <h1>[YOUR NAME]</h1>
      <div class="header-links">
        <span>[YOUR LOCATION]</span>
        <span>|</span>
        <span>[YOUR PHONE NUMBER]</span>
        <span>|</span>
        <span><a href="mailto:[YOUR_EMAIL_ADDRESS]">[YOUR EMAIL ADDRESS]</a></span>
      </div>
      <div class="header-links">
        <span>GitHub: <a href="https://github.com/[YOUR_GITHUB_USERNAME]" target="_blank">github.com/[YOUR_GITHUB_USERNAME]</a></span>
        <span>|</span>
        <span>LinkedIn: <a href="https://www.linkedin.com/in/[YOUR_LINKEDIN_USERNAME]/" target="_blank">linkedin.com/in/[YOUR_LINKEDIN_USERNAME]/</a></span>
      </div>
    </div>

    <!-- Technical Skills Section -->
    <div class="section-title">Technical Skills</div>
    <div class="skills-grid">
      <div class="skills-line">
        <strong>Languages:</strong> Python, JavaScript, TypeScript, HTML5, CSS3, SQL
      </div>
      <div class="skills-line">
        <strong>Backend and Automation:</strong> Asyncio, FastAPI, Node.js, REST APIs, Webhooks, Data Pipelines, Web Scraping
      </div>
      <div class="skills-line">
        <strong>Frontend and Mobile:</strong> React, Next.js, React Native, Tailwind CSS, Vercel
      </div>
      <div class="skills-line">
        <strong>Cloud and Databases:</strong> Supabase, OAuth 2.0, GraphQL, SQLite, PostgreSQL
      </div>
      <div class="skills-line">
        <strong>Tools and Protocols:</strong> Git, GitHub, Manifest V3, WebSockets, DOM Manipulation, JSON Parsing, Ngrok
      </div>
    </div>

    <!-- Technical Projects Section -->
    <div class="section-title">Technical Projects</div>

    <!-- Project 1: JobHuntX AI -->
    <div class="project-item" id="project-recruitment">
      <div class="project-header">
        <span>JobHuntX AI: Automated AI Recruitment and ATS Resume Engine</span>
      </div>
      <div class="project-tech">
        Technologies used: JavaScript, Chrome Extensions API (Manifest V3), Google Gemini API (Gemini 3.5 Flash), Google Apps Script, html2pdf.js, Chrome SidePanel API, DOM Manipulation
      </div>
      <ul class="bullets">
        <li id="bullet-project1">Engineered a Manifest V3 Chrome Extension utilizing an ephemeral background service worker and the Chrome SidePanel API to construct a persistent split-screen workspace for job application workflows.</li>
        <li>Developed a resilient DOM scraping engine that extracts unstructured HTML job descriptions in real-time from active job boards including LinkedIn, Wellfound, Greenhouse, and Lever.</li>
        <li>Integrated the Google Gemini 3.5 Flash API to parse target job descriptions and dynamically tailor resumes by selecting the top 3–4 most relevant projects while hiding the rest to fit single-page limits.</li>
        <li>Built a Google Drive auto-upload sync that compiles resumes client-side using html2pdf.js, uploads the PDF via a Google Apps Script proxy, and dynamically inserts the live shareable links into tailored cover letters.</li>
      </ul>
    </div>

    <!-- Project 2: OSINT Trading Bot -->
    <div class="project-item" id="project-trading">
      <div class="project-header">
        <span>Real-Time OSINT Data Pipeline and Algorithmic Trading Bot</span>
      </div>
      <div class="project-tech">
        Technologies used: Python, Telethon, Pyrogram (Telegram API), TradeLocker API, WebSockets, Asyncio, Logging
      </div>
      <ul class="bullets">
        <li id="bullet-project2">Architected a real-time Open Source Intelligence (OSINT) data pipeline that scrapes, sanitizes, and structure-parses raw text trading signals from dynamic Telegram channels.</li>
        <li>Built an asynchronous execution engine using Python's asyncio to monitor incoming streams, extract trade parameters including entry price, stop-loss, and take-profit boundaries, and instantaneously convert them into valid JSON payloads.</li>
        <li>Integrated directly with the TradeLocker API to automate real-time order placement, position management, and execution with sub-second latency.</li>
        <li>Engineered a comprehensive state-management and error-handling framework to manage network dropouts, API rate limits, and market volatility safeguards, ensuring zero silent failures.</li>
      </ul>
    </div>

    <!-- Project 3: Gamified GitHub Analytics -->
    <div class="project-item" id="project-github">
      <div class="project-header">
        <span>Gamified GitHub Analytics Platform and Dynamic Portfolio Builder</span>
      </div>
      <div class="project-tech">
        Technologies used: React, Next.js, GitHub REST API, GitHub GraphQL API, Supabase, OAuth 2.0, Tailwind CSS
      </div>
      <ul class="bullets">
        <li id="bullet-project3">Designed an AI-powered developer insights platform that securely authenticates users via GitHub OAuth 2.0 to access public and private repository metadata.</li>
        <li>Programmed complex pipeline workers to aggregate repository data footprints, tracking language distributions, commit velocities, complexity trends, and documentation standards.</li>
        <li>Processed raw repository data through an LLM orchestration layer to generate personalized, gamified career pathways complete with automated achievement badges and milestone metrics.</li>
        <li>Created a dynamic database schema in Supabase supporting a customizable public portfolio builder, allowing users to host, edit, and render public-facing developer profiles.</li>
      </ul>
    </div>

    <!-- Project 4: Distributed Dropshipping Platform -->
    <div class="project-item" id="project-dropshipping">
      <div class="project-header">
        <span>Distributed Event-Driven Dropshipping Platform with Embedded AI Support</span>
      </div>
      <div class="project-tech">
        Technologies used: React, Next.js, FastAPI, Supabase (Auth and Database), OpenAI API, CJ Dropshipping Webhooks, Ngrok
      </div>
      <ul class="bullets">
        <li id="bullet-project4">Developed a robust, full-stack e-commerce architecture utilizing FastAPI for a high-performance, asynchronous backend paired with Next.js for a responsive frontend.</li>
        <li>Built a secure webhook receiver infrastructure utilizing Ngrok during development to capture and verify real-time, asynchronous inventory and shipping event payloads from the CJ Dropshipping API.</li>
        <li>Integrated a production-ready authentication and relational database layer using Supabase, deploying optimized SQL indexing and row-level security (RLS) policies.</li>
        <li>Implemented an embedded, stateful AI customer support agent and live chat system powered by LLM API streams, utilizing prompt engineering and system-context constraints to handle customer inquiries dynamically.</li>
      </ul>
    </div>

    <!-- Project 5: EdTech Mobile App -->
    <div class="project-item" id="project-edtech">
      <div class="project-header">
        <span>Offline-First EdTech Mobile Application (NPE Board Reviewer)</span>
      </div>
      <div class="project-tech">
        Technologies used: React Native, Local Caching (SQLite, AsyncStorage), Supabase Sync, Adaptive Testing Algorithms
      </div>
      <ul class="bullets">
        <li id="bullet-project5">Designed and published a high-performance mobile application dedicated to NPE Board Exam preparation, featuring an offline-first architecture to ensure seamless functionality in low-connectivity areas.</li>
        <li>Programmed a custom multi-tiered question generation engine that samples a pool of over 500 questions, organizing them into unique 100-question tier structures with randomized sampling logic.</li>
        <li>Engineered an offline data-synchronization protocol that caches local progress, quiz scores, and telemetry on the device, silently resolving conflicts and syncing with Supabase once network connectivity is restored.</li>
        <li>Integrated an AI tutoring module that provides real-time, personalized critique, conceptual feedback, and adaptive learning suggestions based on a user’s weak testing domains.</li>
      </ul>
    </div>

    <!-- Project 6: Optimized Digital Assets -->
    <div class="project-item" id="project-digitalassets">
      <div class="project-header">
        <span>High-Conversion, Core-Web-Vitals Optimized Digital Assets</span>
      </div>
      <div class="project-tech">
        Technologies used: HTML5, CSS3, Next.js, React, Tailwind CSS, Lighthouse Auditing, Web Performance Optimization
      </div>
      <ul class="bullets">
        <li id="bullet-project6">Developed 3 high-fidelity, highly responsive landing pages focusing on semantic HTML, modern CSS practices, and responsive design layouts.</li>
        <li>Achieved top-tier Google Lighthouse scores approaching 100/100 across Performance, Accessibility, Best Practices, and SEO metrics.</li>
        <li>Implemented intensive frontend performance optimizations, including strict asset compression, next-gen image formats, code-splitting, lazy loading of non-critical elements, and the elimination of render-blocking resources.</li>
      </ul>
    </div>

    <!-- Project 7: WebRTC Video Call App -->
    <div class="project-item" id="project-webrtc">
      <div class="project-header">
        <span>Private 1-on-1 WebRTC Video Call Application</span>
      </div>
      <div class="project-tech">
        Technologies used: React, Vite, WebRTC APIs, Supabase Realtime, Tailwind CSS, CSS Animations
      </div>
      <ul class="bullets">
        <li>Designed and built a React (Vite) application integrated with Supabase Realtime to host private 1-on-1 video calls utilizing a single shared-password login system.</li>
        <li>Engineered robust WebRTC peer-to-peer connections with Google STUN servers for seamless ICE candidate negotiation and NAT traversal.</li>
        <li>Developed a custom signaling and state layer in Supabase to synchronize WebRTC offer, answer, and ICE candidate exchanges dynamically.</li>
        <li>Implemented auto-reconnect fallback logic (ICE restart and PeerConnection rebuilds) alongside a mobile-first dashboard containing mute, camera toggle, and draggable local preview controls.</li>
      </ul>
    </div>

    <!-- Work Experience Section -->
    <div class="section-title">Work Experience</div>
    
    <div class="work-item">
      <div class="work-header">
        <span>[YOUR EMPLOYER] — [YOUR JOB TITLE]</span>
        <span class="work-date">[START DATE] to Present</span>
      </div>
      <ul class="bullets">
        <li>Manage complex client ticketing workflows via text communication, resolving user operations issues with high efficiency.</li>
        <li>Optimize standard response cycles by keeping internal communication logs structured and accurate.</li>
      </ul>
    </div>

    <div class="work-item">
      <div class="work-header">
        <span>[YOUR PREVIOUS EMPLOYER] — [YOUR PREVIOUS JOB TITLE]</span>
        <span class="work-date">[START DATE] to [END DATE]</span>
      </div>
      <ul class="bullets">
        <li>Processed massive visual and physical records arrays into institutional digital tracking databases.</li>
        <li>Ensured 100% data integrity and input accuracy metrics under rapid processing schedules.</li>
      </ul>
    </div>

    <!-- Education Section -->
    <div class="section-title">Education</div>
    <div class="education-item">
      <span><strong>[YOUR UNIVERSITY]</strong></span>
      <span>[GRADUATION YEAR]</span>
    </div>
    <div class="education-sub">
      [YOUR DEGREE] - [YOUR YEAR / STATUS]
    </div>
    
    <div class="education-item">
      <span><strong>[YOUR HIGH SCHOOL]</strong> - Graduated Senior High School</span>
      <span>2020 - 2022</span>
    </div>
    
    <div class="education-item">
      <span><strong>[YOUR JUNIOR HIGH SCHOOL]</strong> - Completed Junior High School</span>
      <span>2016 - 2020</span>
    </div>

    <div class="education-item">
      <span><strong>[YOUR ELEMENTARY SCHOOL]</strong> - Graduated Elementary</span>
      <span>2010 - 2016</span>
    </div>

  </div>
</body>
</html>
`;

// Content script to scan job descriptions on active tabs

console.log("JobHuntX AI Content Script Active.");

// Listen for messages from the side panel to scrape job details
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "SCAN_JOB_PAGE") {
    try {
      const jobDetails = scanJobPage();
      sendResponse({ success: true, data: jobDetails });
    } catch (error) {
      console.error("Scanning failed:", error);
      sendResponse({ success: false, error: error.message });
    }
  }
  return true; // Keep response channel open
});

/**
 * Scans the current page DOM using site-specific selectors and fallbacks
 */
function scanJobPage() {
  const url = window.location.href;
  let company = "";
  let title = "";
  let description = "";

  // Check if we are on a known platform and find the details container
  let pane = null;
  if (url.includes("linkedin.com")) {
    const detailsPaneSelectors = [
      ".jobs-search-two-pane__details",
      ".jobs-details",
      "[class*='jobs-search-two-pane__details']",
      "[class*='jobs-details']",
      "main"
    ];
    for (const selector of detailsPaneSelectors) {
      const el = document.querySelector(selector);
      if (el && el.textContent && el.textContent.length > 500) {
        pane = el;
        break;
      }
    }
  }

  const root = pane || document;

  if (url.includes("linkedin.com")) {
    ({ company, title, description } = scanLinkedIn(root));
  } else if (url.includes("wellfound.com") || url.includes("angel.co")) {
    ({ company, title, description } = scanWellfound());
  } else if (url.includes("greenhouse.io")) {
    ({ company, title, description } = scanGreenhouse());
  } else if (url.includes("lever.co")) {
    ({ company, title, description } = scanLever());
  }

  // Fallback for job description if not found
  if (!description) {
    description = scanJobPageByKeywords(root);
  }

  const isKnownPlatform = url.includes("linkedin.com") || 
                          url.includes("wellfound.com") || url.includes("angel.co") || 
                          url.includes("greenhouse.io") || 
                          url.includes("lever.co");

  let debugInfo = "";
  if (!description) {
    const debugElements = Array.from(document.querySelectorAll("*"));
    const matches = [];
    const headerMatches = [];
    
    for (const el of debugElements) {
      if (["HTML", "BODY", "MAIN", "SCRIPT", "STYLE"].includes(el.tagName)) continue;
      
      const text = el.textContent ? el.textContent.replace(/\s+/g, " ").trim() : "";
      const textLower = text.toLowerCase();
      
      // Search for the description container (leaf level)
      if (text.includes("Discover your 100%") && text.length < 3000) {
        matches.push({
          tag: el.tagName,
          class: el.className,
          id: el.id,
          parent: el.parentElement ? `${el.parentElement.tagName}.${el.parentElement.className}` : "None",
          textLen: text.length
        });
      }
      
      // Search for headings
      if (textLower === "about the job" || textLower === "job description") {
        headerMatches.push({
          tag: el.tagName,
          class: el.className,
          id: el.id,
          parent: el.parentElement ? `${el.parentElement.tagName}.${el.parentElement.className}` : "None"
        });
      }
    }
    
    debugInfo = "\n\n=== DEBUG INFO ===\n" + JSON.stringify({
      descriptionElements: matches,
      headingElements: headerMatches
    }, null, 2);

    if (isKnownPlatform) {
      title = "No active job selected";
      company = url.includes("linkedin.com") ? "LinkedIn" : 
                (url.includes("wellfound.com") || url.includes("angel.co") ? "Wellfound" : 
                (url.includes("greenhouse.io") ? "Greenhouse" : "Lever"));
      description = "No active job description detected. Please open a specific job listing page or details pane before scanning.";
    } else {
      description = detectDescriptionFallback();
    }
  }

  // Fallback for company name if not found
  if (!company && description && !description.startsWith("No active job description detected")) {
    company = detectCompanyFallback();
  }

  // Fallback for job title if not found
  if (!title && description && !description.startsWith("No active job description detected")) {
    title = detectTitleFallback();
  }

  // Final cleanup
  return {
    company: company ? company.trim() : "Unknown Company",
    title: title ? title.trim() : "Job Position",
    description: (description ? cleanText(description) : "") + debugInfo,
    url: url
  };
}

/**
 * LinkedIn Specific Selector Scraping
 */
function scanLinkedIn(root = document) {
  // Selectors for Company Name
  const companySelectors = [
    ".job-details-jobs-unified-top-card__company-name",
    ".jobs-unified-top-card__company-name a",
    ".jobs-unified-top-card__company-name",
    ".jobs-details-top-card__company-url",
    ".topcard__org-name-link",
    "[class*='company-name']",
    "a[href*='/company/']"
  ];

  // Selectors for Job Title
  const titleSelectors = [
    ".job-details-jobs-unified-top-card__job-title",
    ".jobs-unified-top-card__job-title",
    "h1.t-24",
    "h1.top-card-layout__title",
    ".topcard__title",
    "[class*='job-title']"
  ];

  // Selectors for Job Description
  const descriptionSelectors = [
    ".jobs-description__content",
    ".jobs-description-content__text",
    "#job-details",
    ".show-more-less-html__markup",
    ".jobs-box__html-content",
    ".jobs-description",
    "[class*='jobs-description']"
  ];

  return {
    company: querySelectorAcrossFrames(root, companySelectors),
    title: querySelectorAcrossFrames(root, titleSelectors),
    description: querySelectorAcrossFrames(root, descriptionSelectors, true)
  };
}

/**
 * Wellfound Specific Selector Scraping
 */
function scanWellfound() {
  const companySelectors = [
    ".styles_companyName__Yy8v1",
    "header h2",
    "h1.styles_jobTitle__",
    ".styles_companyName__",
    "[class*='companyName']",
    "[class*='companyHeader'] h1"
  ];

  const titleSelectors = [
    ".styles_title__1B94T",
    "h1.styles_jobTitle__",
    ".styles_jobTitle__",
    "[class*='jobTitle']",
    "h1"
  ];

  const descriptionSelectors = [
    ".styles_jobDescription__2e0C_",
    ".styles_jobDescription__",
    "[class*='jobDescription']",
    "[class*='description_']",
    ".styles_description__"
  ];

  let company = queryFirstSelector(companySelectors);
  // Extract only company name if matches title pattern e.g., "Company Name hiring..."
  if (company && company.toLowerCase().includes(" hiring ")) {
    company = company.split(/ hiring /i)[0];
  }

  return {
    company,
    title: queryFirstSelector(titleSelectors),
    description: queryFirstSelector(descriptionSelectors, true)
  };
}

/**
 * Greenhouse Specific Selector Scraping
 */
function scanGreenhouse() {
  const companySelectors = [
    ".company-name",
    ".header-header",
    ".logo-container + h1",
    "meta[property='og:title']"
  ];

  const titleSelectors = [
    "h1.app-title",
    ".title",
    "h1"
  ];

  const descriptionSelectors = [
    "#content",
    "#details",
    ".job-body",
    "#main"
  ];

  let company = queryFirstSelector(companySelectors);
  if (company && company.includes(" at ")) {
    // If og:title is e.g. "Software Engineer at Google"
    company = company.split(" at ")[1];
  }

  return {
    company,
    title: queryFirstSelector(titleSelectors),
    description: queryFirstSelector(descriptionSelectors, true)
  };
}

/**
 * Lever Specific Selector Scraping
 */
function scanLever() {
  const companySelectors = [
    ".page-header-logo + h2",
    ".posting-header h2",
    "title"
  ];

  const titleSelectors = [
    "h2",
    ".posting-header h1",
    ".posting-title h2"
  ];

  const descriptionSelectors = [
    ".section-wrapper .posting-description",
    ".section.page-centered",
    ".jobs-container"
  ];

  let company = queryFirstSelector(companySelectors);
  if (company && company.toLowerCase().includes(" job description")) {
    company = company.split(/ job description/i)[0];
  }

  return {
    company,
    title: queryFirstSelector(titleSelectors),
    description: queryFirstSelector(descriptionSelectors, true)
  };
}

/**
 * Fallback detection patterns if site-specific scraping fails
 */
function detectCompanyFallback() {
  // Try og:site_name meta tag
  const ogSiteName = document.querySelector("meta[property='og:site_name']");
  if (ogSiteName && ogSiteName.content) return ogSiteName.content;

  const ogTitle = document.querySelector("meta[property='og:title']");
  if (ogTitle && ogTitle.content && ogTitle.content.includes(" at ")) {
    return ogTitle.content.split(" at ")[1];
  }

  // Try parsing title tag: e.g. "Software Engineer - Google Careers"
  const titleText = document.title;
  if (titleText.includes("-")) {
    return titleText.split("-")[1].trim();
  }
  if (titleText.includes("|")) {
    return titleText.split("|")[1].trim();
  }
  if (titleText.includes(" at ")) {
    return titleText.split(" at ")[1].trim();
  }

  return "";
}

function detectTitleFallback() {
  const ogTitle = document.querySelector("meta[property='og:title']");
  if (ogTitle && ogTitle.content) {
    if (ogTitle.content.includes(" at ")) {
      return ogTitle.content.split(" at ")[0];
    }
    return ogTitle.content;
  }

  const h1 = document.querySelector("h1");
  if (h1 && h1.textContent) return h1.textContent;

  return "";
}

function scanJobPageByKeywords(root = document) {
  const elements = querySelectorAllAcrossFrames("h1, h2, h3, h4, h5, h6, span, p, div, strong, b", root);
  const targetKeywords = ["about the job", "job description", "about the role", "role description", "responsibilities", "key responsibilities"];
  
  for (const el of elements) {
    const text = el.textContent ? el.textContent.replace(/\s+/g, " ").trim().toLowerCase() : "";
    if (text.length > 0 && text.length < 60) {
      const matches = targetKeywords.some(kw => text.includes(kw));
      if (matches) {
        const descriptionText = extractDescriptionFromHeader(el);
        if (descriptionText && descriptionText.replace(/\s+/g, " ").trim().length > 150) {
          return descriptionText;
        }
      }
    }
  }
  return "";
}

function extractDescriptionFromHeader(headerNode) {
  let current = headerNode;
  
  // Go up the DOM tree to find a container with siblings (e.g. to avoid being stuck inside <h2><span>)
  while (current && !current.nextElementSibling && current.parentElement && current.parentElement !== document.body) {
    current = current.parentElement;
  }
  
  if (!current) return "";
  
  let sibling = current.nextElementSibling;
  let textContent = "";
  let siblingCount = 0;
  
  while (sibling && siblingCount < 12) { // Limit sibling traversal to avoid runaways
    const tag = sibling.tagName.toUpperCase();
    if (["FOOTER", "NAV", "HEADER"].includes(tag)) {
      break;
    }
    
    // Stop if we hit a sibling that is another H1, H2, or H3 heading
    if (tag.startsWith("H") && !isNaN(tag.substring(1))) {
      const headingLevel = parseInt(tag.substring(1), 10);
      if (headingLevel <= 3) {
        break; 
      }
    }
    
    textContent += sibling.textContent + "\n";
    sibling = sibling.nextElementSibling;
    siblingCount++;
  }
  
  return textContent.trim();
}

function detectDescriptionFallback() {
  // Target containers with largest length of text contents
  const commonContainers = [
    "article",
    "main",
    ".content",
    ".body",
    "#main",
    "#content"
  ];

  let maxText = "";
  let longestContainer = null;

  for (const sel of commonContainers) {
    const el = document.querySelector(sel);
    if (el && el.textContent.length > maxText.length) {
      maxText = el.textContent;
      longestContainer = el;
    }
  }

  if (maxText.length > 300) {
    return longestContainer.innerHTML;
  }

  // If no common container is large, extract whole body text
  return document.body.textContent;
}

/**
 * Helper to query multiple selectors and return first match within a root node
 */
function querySelectorAllAcrossFrames(selector, root = document) {
  let elements = Array.from(root.querySelectorAll(selector));
  const iframes = root.querySelectorAll("iframe");
  for (const iframe of iframes) {
    try {
      if (iframe.contentDocument) {
        elements = elements.concat(querySelectorAllAcrossFrames(selector, iframe.contentDocument));
      }
    } catch (e) {
      // ignore security errors
    }
  }
  return elements;
}

function querySelectorAcrossFrames(root, selectors, returnHtml = false) {
  for (const selector of selectors) {
    const element = root.querySelector(selector);
    if (element) {
      const val = returnHtml ? element.innerHTML : element.textContent;
      if (val && val.replace(/\s+/g, " ").trim().length > 100) {
        return val;
      }
    }
  }

  // Check sub-frames
  const iframes = root.querySelectorAll("iframe");
  for (const iframe of iframes) {
    try {
      if (iframe.contentDocument) {
        const val = querySelectorAcrossFrames(iframe.contentDocument, selectors, returnHtml);
        if (val) return val;
      }
    } catch (e) {}
  }
  
  return "";
}

function querySelectorWithin(root, selectors, returnHtml = false) {
  return querySelectorAcrossFrames(root, selectors, returnHtml);
}

function queryFirstSelector(selectors, returnHtml = false) {
  return querySelectorAcrossFrames(document, selectors, returnHtml);
}

/**
 * Clean up HTML formatting tags and duplicate whitespaces
 */
function cleanText(htmlOrText) {
  // If it's HTML, convert common list items and paragraphs to line breaks
  let text = htmlOrText
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, ""); // Strip other tags

  // Unescape HTML entities
  const txtNode = document.createElement("textarea");
  txtNode.innerHTML = text;
  text = txtNode.value;

  // Clean double spaces/newlines
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");
}

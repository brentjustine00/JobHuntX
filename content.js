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

  if (url.includes("linkedin.com")) {
    ({ company, title, description } = scanLinkedIn());
  } else if (url.includes("wellfound.com") || url.includes("angel.co")) {
    ({ company, title, description } = scanWellfound());
  } else if (url.includes("greenhouse.io")) {
    ({ company, title, description } = scanGreenhouse());
  } else if (url.includes("lever.co")) {
    ({ company, title, description } = scanLever());
  }

  // Fallback for company name if not found
  if (!company) {
    company = detectCompanyFallback();
  }

  // Fallback for job title if not found
  if (!title) {
    title = detectTitleFallback();
  }

  // Fallback for job description if not found
  if (!description) {
    description = detectDescriptionFallback();
  }

  // Final cleanup
  return {
    company: company ? company.trim() : "Unknown Company",
    title: title ? title.trim() : "Job Position",
    description: description ? cleanText(description) : "",
    url: url
  };
}

/**
 * LinkedIn Specific Selector Scraping
 */
function scanLinkedIn() {
  // Selectors for Company Name
  const companySelectors = [
    ".job-details-jobs-unified-top-card__company-name",
    ".jobs-unified-top-card__company-name a",
    ".jobs-unified-top-card__company-name",
    ".jobs-details-top-card__company-url",
    ".topcard__org-name-link",
    "a[href*='/company/']"
  ];

  // Selectors for Job Title
  const titleSelectors = [
    ".job-details-jobs-unified-top-card__job-title",
    ".jobs-unified-top-card__job-title",
    "h1.t-24",
    "h1.top-card-layout__title",
    ".topcard__title"
  ];

  // Selectors for Job Description
  const descriptionSelectors = [
    ".jobs-description__content",
    ".jobs-description-content__text",
    "#job-details",
    ".show-more-less-html__markup",
    ".jobs-box__html-content"
  ];

  return {
    company: queryFirstSelector(companySelectors),
    title: queryFirstSelector(titleSelectors),
    description: queryFirstSelector(descriptionSelectors, true)
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
  if (h1 && h1.innerText) return h1.innerText;

  return "";
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
    if (el && el.innerText.length > maxText.length) {
      maxText = el.innerText;
      longestContainer = el;
    }
  }

  if (maxText.length > 300) {
    return longestContainer.innerHTML;
  }

  // If no common container is large, extract whole body text
  return document.body.innerText;
}

/**
 * Helper to query multiple selectors and return first match
 */
function queryFirstSelector(selectors, returnHtml = false) {
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      // Use textContent or innerHTML based on needs
      return returnHtml ? element.innerHTML : element.innerText;
    }
  }
  return "";
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

import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Adjust if your FastAPI runs on a different host/port
interface Source {
  title: string;
  url: string;
  website: string;
}

interface SummaryResponse {
  summary: string;
  sources: Source[];
}
const API_DELAY = 1000; // Simulated delay for API calls
export const generateAudio = async (text: string, voiceId: string): Promise<string> => {
  return "mock-audio-url";
};

export const downloadSummary = async (
  text: string,
  title: string,
  format: "txt" | "pdf" | "docx"
): Promise<void> => {
  console.log(`Downloading ${title} as ${format}`);
};
export const getArticleSummary = async ({
  websites,
  topic,
}: {
  websites: string[];
  topic: string;
}): Promise<SummaryResponse> => {
  try {
    // Validate websites
    if (!Array.isArray(websites)) {
      console.error("Invalid websites parameter:", websites);
      throw new Error("Websites must be an array");
    }

    const sites = websites.length > 0 ? websites.join(",") : "medium,wix,devto";
    console.log("Sending API request:", { keyword: topic, sites });

    const response = await axios.get(`${API_BASE_URL}/scrape-and-summarize`, {
      params: {
        keyword: topic,
        sites,
      },
    });

    console.log("API response:", response.data);
    const data = response.data.results;
    if (!data || typeof data !== "object") {
      console.error("Invalid response format:", response.data);
      throw new Error("Invalid response format: 'results' missing or not an object");
    }

    let combinedSummary = "";
    let combinedSources: Source[] = [];

    for (const website of websites) {
      if (data[website] && !data[website].error) {
        const { summary, sources } = data[website];
        combinedSummary += (combinedSummary ? "\n\n" : "") + (summary || `No summary available for ${website}.`);
        combinedSources = [...combinedSources, ...(Array.isArray(sources) ? sources : [])];
      } else {
        console.warn(`No data for website: ${website}`, data[website]);
        combinedSummary += (combinedSummary ? "\n\n" : "") + `No summary available for ${website}.`;
      }
    }

    if (!combinedSummary) {
      throw new Error("No summaries available for selected websites");
    }

    return {
      summary: combinedSummary,
      sources: combinedSources,
    };
  } catch (error: any) {
    console.error("API Error Details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config,
      request: error.request,
    });
    throw new Error(error.message || "Failed to fetch summary");
  }
};
// Simulated API call to generate audio from text

// Simulated API call to download summary in different formats

// Interface for the summary history item
export interface SummaryHistoryItem {
  id: string;
  topic: string;
  website: string;
  summary: string;
  sources: Source[];
  createdAt: string;
}

// Simulated API call to fetch user's summary history
export const getSummaryHistory = async (): Promise<SummaryHistoryItem[]> => {
  console.log("Fetching summary history");
  
  // In a real implementation, this would fetch from a database
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          topic: "Artificial Intelligence",
          website: "medium",
          summary: "Artificial Intelligence is transforming industries through machine learning and neural networks...",
          sources: [
            {
              title: "The Rise of AI",
              url: "https://medium.com/blog/rise-of-ai",
              website: "medium",
            },
            {
              title: "Machine Learning Explained",
              url: "https://medium.com/blog/machine-learning",
              website: "medium",
            },
          ],
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          topic: "Climate Change",
          website: "wordpress",
          summary: "Climate change is accelerating with notable effects on global temperatures and sea levels...",
          sources: [
            {
              title: "Global Warming Trends",
              url: "https://wordpress.com/blog/warming-trends",
              website: "wordpress",
            },
            {
              title: "Sustainable Solutions",
              url: "https://wordpress.com/blog/sustainable-solutions",
              website: "wordpress",
            },
          ],
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);
    }, API_DELAY);
  });
};

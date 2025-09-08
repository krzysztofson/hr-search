# HR Search - AI-Powered Candidate Finder

An intelligent candidate search application that uses Google Search API and OpenAI to find and analyze potential job candidates based on job briefs.

## Features

- **Smart Job Brief Input**: Enter job requirements, location, and description
- **Google Search Integration**: Automatically searches for candidates across professional platforms
- **AI-Powered Analysis**: Uses OpenAI to analyze search results and extract candidate information
- **Candidate Scoring**: Provides match scores (0-100%) based on job requirements
- **Professional Display**: Clean, organized candidate list with skills, experience, and contact information

## How It Works

1. **Input Job Brief**: Enter the job title, location, requirements, and description
2. **Automated Search**: The app generates optimized search queries and searches Google (focusing on LinkedIn profiles)
3. **AI Analysis**: OpenAI analyzes the search results to extract candidate information and calculate match scores
4. **Results Display**: View organized candidate list with scores, skills, and professional details

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env` and configure the following:

```bash
# OpenAI API Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_MODEL=gpt-4o-mini

# Google Search API Configuration
VITE_GOOGLE_API_KEY=your_google_api_key_here
VITE_GOOGLE_SEARCH_ENGINE_ID=your_google_search_engine_id_here
```

### 2. Google Search API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the "Custom Search API"
3. Create API credentials and get your API key
4. Go to [Google Custom Search Engine](https://cse.google.com/)
5. Create a new search engine
6. Configure it to search the entire web
7. Copy the Search Engine ID

### 3. OpenAI API Setup

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your `.env` file

### 4. Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- **Vue.js 3** - Frontend framework
- **Pinia** - State management
- **Vue Router** - Routing
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Google Custom Search API** - Candidate search
- **OpenAI API** - Content analysis

## Demo Mode

If API keys are not configured, the app will run in demo mode with mock candidate data to showcase the interface and functionality.

## Candidate Information Extracted

- Full name and current job title
- Current company and location
- Years of experience
- Key skills and technologies
- Match score (0-100%)
- LinkedIn profile URL
- Brief summary of candidate fit

## Usage Tips

- Be specific in job briefs for better search results
- Include location, required skills, and experience level
- The AI works best with clear, structured job requirements
- Results are limited to publicly available information

## License

This project is open source and available under the MIT License.

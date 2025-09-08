# HR Search - AI-Powered Candidate Finder

An intelligent candidate search application that uses Google Search API and OpenAI to find and analyze potential job candidates based on job briefs. The application searches across multiple professional platforms and provides comprehensive candidate analysis in Polish language.

## ✨ Features

- **Smart Job Brief Input**: Enter job requirements, location, and description in Polish
- **Multi-Platform Search**: Automatically searches across 8+ professional platforms
- **AI-Powered Analysis**: Uses OpenAI to analyze search results and extract candidate information
- **Comprehensive Candidate Scoring**: Provides match scores (0-100%) based on job requirements
- **Professional Display**: Clean, organized candidate list with skills, experience, and contact information
- **Polish Language Support**: Full Polish language interface and responses
- **Extended Results**: Up to 20 search results per query for better candidate coverage
- **Demo Mode**: Works without API keys using realistic mock data

## 🔍 Supported Platforms

The application searches across multiple professional platforms:

- **LinkedIn** - Global professional network
- **GoldenLine** - Polish professional network
- **Pracuj.pl** - Leading Polish job board
- **Indeed** - International job search engine
- **Glassdoor** - Company reviews and salaries
- **Xing** - European professional network
- **Behance** - Creative professionals portfolio
- **Dribbble** - Design community

## 🚀 How It Works

1. **Input Job Brief**: Enter the job title, location, requirements, and description in Polish
2. **Automated Multi-Platform Search**: The app generates optimized search queries targeting multiple professional platforms
3. **AI Analysis**: OpenAI analyzes up to 20 search results to extract candidate information and calculate match scores
4. **Comprehensive Results**: View 5-8+ organized candidates with scores, skills, and professional details

## 📊 Candidate Information Extracted

- **Personal**: Full name and current job title
- **Professional**: Current company and location
- **Experience**: Years of experience in the field
- **Skills**: Key technologies and competencies
- **Scoring**: Match score (0-100%) with visual indicators
- **Contact**: Original profile URL from the source platform
- **Source**: Platform where the candidate was found
- **Summary**: AI-generated summary of candidate fit (in Polish)

## ⚙️ Setup Instructions

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
2. Enable the "Custom Search JSON API"
3. Create API credentials and get your API key
4. Go to [Google Custom Search Engine](https://cse.google.com/)
5. Create a new search engine with these settings:
   - **Sites to search**: `linkedin.com/*` (or enable "Search the entire web")
   - **Name**: "HR Candidate Search" (or any name you prefer)
6. Copy the Search Engine ID (looks like: `017576662512468239146:omuauf_lfve`)
7. **Important**: Configure API key restrictions:
   - Go to Google Cloud Console > APIs & Services > Credentials
   - Edit your API key and add these HTTP referrers:
     ```
     http://localhost:*
     https://localhost:*
     http://127.0.0.1:*
     https://127.0.0.1:*
     ```

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

## 🛠️ Tech Stack

- **Vue.js 3** - Frontend framework with Composition API
- **Pinia** - State management for candidate data
- **Vue Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool and dev server
- **Google Custom Search API** - Multi-platform candidate search
- **OpenAI API (GPT-4o-mini)** - Content analysis and extraction

## 🎯 Demo Mode

If API keys are not configured, the app will run in demo mode with 6 realistic mock candidates showcasing:

- Different Polish cities (Warszawa, Kraków, Gdańsk, Wrocław, Poznań)
- Various professional platforms (LinkedIn, GoldenLine, Pracuj.pl, Behance, Indeed)
- Diverse skill sets and experience levels
- Polish language content

## 💡 Usage Tips

### For Best Search Results:

- **Be specific** in job briefs - include required skills and experience level
- **Use Polish terms** when applicable (the system recognizes both Polish and English)
- **Include location** for geographically relevant results
- **Mention specific technologies** or tools required
- **Specify experience level** (junior, senior, etc.)

### Example Job Brief:

```
Stanowisko: Frontend Developer
Lokalizacja: Warszawa, Polska
Wymagania:
- Minimum 3 lata doświadczenia w React/Vue.js
- Znajomość JavaScript ES6+
- Doświadczenie z REST API
- Znajomość języka angielskiego
- Umiejętność pracy w zespole

Opis: Poszukujemy doświadczonego frontend developera do pracy nad nowoczesnymi aplikacjami webowymi.
```

## 🚨 API Limits & Considerations

- **Google Custom Search**: 100 free queries per day
- **OpenAI API**: Pay-per-use (GPT-4o-mini is cost-effective)
- **Search Results**: Up to 20 results per search (2 API calls)
- **Candidate Extraction**: 5-8+ candidates per search when available
- **Languages**: Results and analysis in Polish

## 🔒 Privacy & Data

- No candidate data is stored permanently
- Search results are processed in real-time
- API calls are made directly from the browser
- All data processing happens on OpenAI servers (see their privacy policy)

## 📄 License

This project is open source and available under the MIT License.

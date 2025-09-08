import { defineStore } from 'pinia'

export const useHRSearchStore = defineStore('hrSearch', {
  state: () => ({
    brief: '',
    candidates: [],
    loading: false,
    error: null
  }),
  actions: {
    setBrief(text) {
      this.brief = text
    },
    setCandidates(candidates) {
      this.candidates = candidates || []
    },
    clear() {
      this.candidates = []
      this.error = null
    },
    async searchCandidates() {
      const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY
      const googleSearchEngineId = import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID
      const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY
      const configuredModel = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini'

      this.loading = true
      this.error = null

      // If no API keys, fall back to mock data for demo purposes
      if (!googleApiKey || !openaiApiKey) {
        const mockCandidates = [
          {
            name: 'John Smith',
            title: 'Senior AI Marketing Specialist',
            company: 'Tech Corp',
            location: 'Warsaw, Poland',
            experience: '5+ years',
            skills: ['AI Tools', 'Content Creation', 'Marketing Strategy'],
            score: 95,
            summary:
              'Experienced AI marketing specialist with strong background in creative content generation.',
            linkedinUrl: 'https://linkedin.com/in/johnsmith',
            source: 'Demo Data'
          },
          {
            name: 'Anna Kowalski',
            title: 'Creative AI Designer',
            company: 'Design Studio',
            location: 'Warsaw, Poland',
            experience: '3+ years',
            skills: ['AI Design Tools', 'Multimedia Production', 'Creative Strategy'],
            score: 88,
            summary:
              'Creative professional specializing in AI-powered design and multimedia content.',
            linkedinUrl: 'https://linkedin.com/in/annakowalski',
            source: 'Demo Data'
          }
        ]
        this.setCandidates(mockCandidates)
        this.loading = false
        return mockCandidates
      }

      try {
        // Step 1: Search Google for candidates
        const searchQuery = this.generateSearchQuery()
        const googleResults = await this.searchGoogle(
          searchQuery,
          googleApiKey,
          googleSearchEngineId
        )

        // Step 2: Use OpenAI to analyze and extract candidate information
        const candidates = await this.analyzeWithOpenAI(
          googleResults,
          openaiApiKey,
          configuredModel
        )

        this.setCandidates(candidates)
        return candidates
      } catch (err) {
        console.error('Search error:', err)
        this.error = err?.message || 'Failed to search for candidates'
        return []
      } finally {
        this.loading = false
      }
    },

    generateSearchQuery() {
      // Extract key terms from the brief to create a focused search query
      const briefLower = this.brief.toLowerCase()
      let query = ''

      // Extract job title/role
      if (briefLower.includes('stanowisko:')) {
        const titleMatch = this.brief.match(/stanowisko:\s*([^.]+)/i)
        if (titleMatch) {
          query += titleMatch[1].trim()
        }
      }

      // Add location if specified
      if (briefLower.includes('warszawa') || briefLower.includes('warsaw')) {
        query += ' Warsaw Poland'
      }

      // Add site:linkedin.com to focus on LinkedIn profiles
      query += ' site:linkedin.com'

      return query.trim() || 'marketing specialist AI linkedin'
    },

    async searchGoogle(query, apiKey, searchEngineId) {
      const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=10`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Google Search API error: ${response.status}`)
      }

      const data = await response.json()
      return data.items || []
    },

    async analyzeWithOpenAI(googleResults, apiKey, model) {
      const prompt = `You are an HR assistant analyzing search results to find potential job candidates. 

Job Brief:
${this.brief}

Search Results:
${googleResults
  .map(
    (item, index) => `
${index + 1}. Title: ${item.title}
   URL: ${item.link}
   Snippet: ${item.snippet}
`
  )
  .join('\n')}

Please analyze these search results and extract candidate information. Return ONLY a JSON array of candidates with this exact structure:

[
  {
    "name": "Full Name",
    "title": "Current Job Title",
    "company": "Current Company",
    "location": "City, Country", 
    "experience": "Years of experience",
    "skills": ["skill1", "skill2", "skill3"],
    "score": 85,
    "summary": "Brief 1-2 sentence summary of candidate fit",
    "linkedinUrl": "LinkedIn profile URL",
    "source": "Source of information"
  }
]

Score candidates 0-100 based on how well they match the job requirements. Only include candidates with clear professional profiles. If no good matches, return empty array [].`

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          temperature: 0.3,
          messages: [
            { role: 'system', content: 'Return strictly valid JSON array. No commentary.' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' }
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `OpenAI API error: ${response.status} - ${errorData?.error?.message || 'Unknown error'}`
        )
      }

      const data = await response.json()
      const content = data?.choices?.[0]?.message?.content || '{"candidates": []}'

      let parsed
      try {
        parsed = JSON.parse(content)
        // Handle if the response is wrapped in an object with a candidates key
        if (parsed.candidates && Array.isArray(parsed.candidates)) {
          return parsed.candidates
        }
        // Handle if the response is directly an array
        if (Array.isArray(parsed)) {
          return parsed
        }
        return []
      } catch (e) {
        console.error('Failed to parse OpenAI response:', e)
        return []
      }
    }
  }
})

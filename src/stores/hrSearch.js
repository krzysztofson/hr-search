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
            name: 'Jan Kowalski',
            title: 'Starszy Specjalista AI Marketing',
            company: 'TechCorp Polska',
            location: 'Warszawa, Polska',
            experience: '5+ lat',
            skills: ['Narzędzia AI', 'Tworzenie treści', 'Strategia marketingowa'],
            score: 95,
            summary:
              'Doświadczony specjalista marketingu AI z silnym zapleczem w kreatywnym tworzeniu treści.',
            linkedinUrl: 'https://linkedin.com/in/jankowalski',
            source: 'Dane demo'
          },
          {
            name: 'Anna Nowak',
            title: 'Kreatywny Designer AI',
            company: 'Studio Design',
            location: 'Warszawa, Polska',
            experience: '3+ lata',
            skills: ['Narzędzia AI Design', 'Produkcja multimedialna', 'Strategia kreatywna'],
            score: 88,
            summary:
              'Profesjonalista kreatywny specjalizujący się w projektowaniu wspomaganym AI i treściach multimedialnych.',
            linkedinUrl: 'https://linkedin.com/in/annanowak',
            source: 'Dane demo'
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
        console.error('Błąd wyszukiwania:', err)
        this.error = err?.message || 'Nie udało się wyszukać kandydatów'
        return []
      } finally {
        this.loading = false
      }
    },

    generateSearchQuery() {
      // Extract key terms from the brief to create a focused search query
      const briefLower = this.brief.toLowerCase()
      let queryParts = []

      // Extract job title/role - clean up the extracted text
      if (briefLower.includes('stanowisko:')) {
        const titleMatch = this.brief.match(/stanowisko:\s*([^\n\r]+)/i)
        if (titleMatch) {
          let title = titleMatch[1].trim()
          // Clean up the title - remove extra punctuation and split on common separators
          title = title.replace(/[\.;]+$/, '') // Remove trailing punctuation
          const titleParts = title.split(/[\/,]+/).map((part) => part.trim())
          // Take the first meaningful part or combine shorter parts
          if (titleParts.length > 0) {
            queryParts.push(titleParts[0])
          }
        }
      }

      // Add location if specified
      if (briefLower.includes('warszawa') || briefLower.includes('warsaw')) {
        queryParts.push('Warszawa')
      }
      if (briefLower.includes('kraków') || briefLower.includes('krakow')) {
        queryParts.push('Kraków')
      }
      if (briefLower.includes('gdańsk') || briefLower.includes('gdansk')) {
        queryParts.push('Gdańsk')
      }

      // Add key skills from requirements if available
      if (
        briefLower.includes('ai') ||
        briefLower.includes('artificial intelligence') ||
        briefLower.includes('sztuczna inteligencja')
      ) {
        queryParts.push('AI')
      }
      if (briefLower.includes('marketing')) {
        queryParts.push('marketing')
      }
      if (briefLower.includes('programist') || briefLower.includes('developer')) {
        queryParts.push('developer')
      }

      // Create clean search query
      let query = queryParts.join(' ')

      // Add site:linkedin.com to focus on LinkedIn profiles
      query += ' site:linkedin.com'

      // Fallback if no query parts found
      return query.trim() || 'marketing specialist AI site:linkedin.com'
    },

    async searchGoogle(query, apiKey, searchEngineId) {
      console.log('Search query:', query) // Debug log
      const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=10`
      console.log('Search URL:', url) // Debug log

      const response = await fetch(url)
      if (!response.ok) {
        let errorDetails = ''
        try {
          const errorData = await response.json()
          errorDetails = errorData?.error?.message || JSON.stringify(errorData)
        } catch (e) {
          // Failed to parse error response
        }
        throw new Error(
          `Błąd Google Search API: ${response.status}${errorDetails ? ` - ${errorDetails}` : ''}`
        )
      }

      const data = await response.json()
      return data.items || []
    },

    async analyzeWithOpenAI(googleResults, apiKey, model) {
      const prompt = `Jesteś asystentem HR analizującym wyniki wyszukiwania w celu znalezienia potencjalnych kandydatów na stanowisko pracy.

Brief stanowiska:
${this.brief}

Wyniki wyszukiwania:
${googleResults
  .map(
    (item, index) => `
${index + 1}. Tytuł: ${item.title}
   URL: ${item.link}
   Opis: ${item.snippet}
`
  )
  .join('\n')}

Przeanalizuj te wyniki wyszukiwania i wyodrębnij informacje o kandydatach. Zwróć TYLKO tablicę JSON kandydatów o dokładnie tej strukturze:

[
  {
    "name": "Imię i nazwisko",
    "title": "Obecne stanowisko",
    "company": "Obecna firma",
    "location": "Miasto, Kraj", 
    "experience": "Lata doświadczenia",
    "skills": ["umiejętność1", "umiejętność2", "umiejętność3"],
    "score": 85,
    "summary": "Krótkie 1-2 zdaniowe podsumowanie dopasowania kandydata",
    "linkedinUrl": "URL profilu LinkedIn",
    "source": "Źródło informacji"
  }
]

Oceń kandydatów w skali 0-100 na podstawie tego, jak dobrze pasują do wymagań stanowiska. Uwzględnij tylko kandydatów z jasnymi profilami zawodowymi. Jeśli nie ma dobrych dopasowań, zwróć pustą tablicę [].

Odpowiadaj w języku polskim. Wszystkie opisy i podsumowania powinny być po polsku.`

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
            {
              role: 'system',
              content:
                'Zwróć wyłącznie poprawną tablicę JSON. Bez komentarzy. Odpowiadaj w języku polskim.'
            },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' }
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `Błąd OpenAI API: ${response.status} - ${errorData?.error?.message || 'Nieznany błąd'}`
        )
      }

      const data = await response.json()
      const content = data?.choices?.[0]?.message?.content || '[]'

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
        // If it's an object but not an array, try to extract array values
        if (typeof parsed === 'object' && parsed !== null) {
          const values = Object.values(parsed)
          const arrayValue = values.find((v) => Array.isArray(v))
          if (arrayValue) return arrayValue
        }
        return []
      } catch (e) {
        console.error('Nie udało się sparsować odpowiedzi OpenAI:', e)
        return []
      }
    }
  }
})

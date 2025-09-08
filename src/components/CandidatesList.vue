<script setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useHRSearchStore } from '@/stores/hrSearch'

const router = useRouter()
const hrSearch = useHRSearchStore()
const { candidates, loading, error } = storeToRefs(hrSearch)

const goBack = () => {
  router.push('/')
}

const getScoreColor = (score) => {
  if (score >= 90) return 'text-green-400'
  if (score >= 75) return 'text-yellow-400'
  if (score >= 60) return 'text-orange-400'
  return 'text-red-400'
}

const getScoreBackground = (score) => {
  if (score >= 90) return 'bg-green-400'
  if (score >= 75) return 'bg-yellow-400'
  if (score >= 60) return 'bg-orange-400'
  return 'bg-red-400'
}
</script>

<template>
  <div class="container px-4 mx-auto py-24">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-4xl">Candidate Search Results</h2>
      <button
        @click="goBack"
        class="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
      >
        ← Back to Search
      </button>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="text-gray-400">Searching for candidates...</div>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-400 mb-4">{{ error }}</div>
      <button
        @click="goBack"
        class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
      >
        Try New Search
      </button>
    </div>

    <div v-else-if="candidates.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">No candidates found matching your criteria.</div>
      <button
        @click="goBack"
        class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
      >
        Try New Search
      </button>
    </div>

    <div v-else class="space-y-6">
      <div class="text-gray-400 mb-6">
        Found {{ candidates.length }} candidate{{ candidates.length !== 1 ? 's' : '' }}
      </div>

      <div
        v-for="candidate in candidates"
        :key="candidate.name"
        class="bg-gray-800 rounded-lg p-6 border border-gray-700"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <h3 class="text-xl font-semibold text-white mb-1">{{ candidate.name }}</h3>
            <p class="text-gray-300 mb-2">{{ candidate.title }}</p>
            <div class="flex items-center gap-4 text-sm text-gray-400">
              <span v-if="candidate.company">🏢 {{ candidate.company }}</span>
              <span v-if="candidate.location">📍 {{ candidate.location }}</span>
              <span v-if="candidate.experience">⏱️ {{ candidate.experience }}</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <div class="text-sm text-gray-400">Match Score</div>
              <div class="text-2xl font-bold" :class="getScoreColor(candidate.score)">
                {{ candidate.score }}%
              </div>
            </div>
            <div
              class="w-2 h-16 rounded-full"
              :class="getScoreBackground(candidate.score)"
              :style="{ opacity: candidate.score / 100 }"
            ></div>
          </div>
        </div>

        <p class="text-gray-300 mb-4">{{ candidate.summary }}</p>

        <div v-if="candidate.skills && candidate.skills.length > 0" class="mb-4">
          <div class="text-sm text-gray-400 mb-2">Skills:</div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="skill in candidate.skills"
              :key="skill"
              class="bg-blue-600 text-blue-100 px-2 py-1 rounded text-sm"
            >
              {{ skill }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500">Source: {{ candidate.source }}</div>
          <div class="flex gap-3">
            <a
              v-if="candidate.linkedinUrl"
              :href="candidate.linkedinUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              View LinkedIn →
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any custom styles here */
</style>

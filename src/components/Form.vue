<script setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useHRSearchStore } from '@/stores/hrSearch'

const router = useRouter()
const hrSearch = useHRSearchStore()
const { brief, loading, error } = storeToRefs(hrSearch)

defineProps({
  msg: {
    type: String,
    required: true
  }
})

hrSearch.setBrief(`Stanowisko: AI Marketing Specialist/Creative AI Designer/AI Content Creator
Lokalizacja: Warszawa, Polska
Opis stanowiska: Przygotowanie materiałów multimedialnych (filmy, grafiki, materiały POS itp.) zgodnie ze zleconym briefem oraz dobrymi praktykami marketingowymi przy użyciu narzędzi AI.
`)

const searchCandidates = async () => {
  await hrSearch.searchCandidates()
  router.push('/candidates')
}
</script>

<template>
  <div class="container px-4 mx-auto py-24">
    <h2 class="text-4xl">Job Brief</h2>
    <p class="text-gray-400 mt-2 mb-6">
      Enter the job requirements and description. We'll search for matching candidates on LinkedIn
      and other professional platforms.
    </p>
    <textarea
      class="block border border-gray-300 rounded-md p-2 w-full bg-gray-800 mt-6"
      name="brief"
      id="brief"
      rows="20"
      v-model="brief"
      :disabled="loading"
      placeholder="Enter job title, location, requirements, and description..."
    ></textarea>
    <div class="mt-2 text-sm text-red-400" v-if="error">{{ error }}</div>
    <button
      @click="searchCandidates"
      class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors disabled:opacity-60"
      :disabled="loading || !brief?.trim()"
    >
      <span v-if="loading">Searching candidates…</span>
      <span v-else>Search Candidates</span>
    </button>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>

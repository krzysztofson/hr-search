<script setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMarketingStore } from '@/stores/marketing'
import { ref, computed } from 'vue'

const router = useRouter()
const marketing = useMarketingStore()
const { title, description, cta, imageUrl } = storeToRefs(marketing)

defineProps({
  msg: {
    type: String,
    required: false
  }
})

const goBack = () => {
  router.push('/')
}

const handleGenerate = () => {
  // Placeholder for generate functionality
  console.log('Download clicked', {
    title: title.value,
    description: description.value,
    cta: cta.value,
    imageUrl: imageUrl.value
  })
}

// Customization controls
const aspectRatio = ref('square') // square | landscape | portrait | story
const showLogo = ref(true)
const imageFit = ref('cover') // cover | contain
const gradientEnabled = ref(true)
const gradientColor = ref('blue') // blue | purple | black
const textVPos = ref('center') // top | center | bottom

const aspectClass = computed(() => {
  const map = {
    square: 'aspect-[1/1]',
    landscape: 'aspect-[16/9]',
    portrait: 'aspect-[4/5]',
    story: 'aspect-[9/16]'
  }
  return map[aspectRatio.value] || map.square
})

const imageObjectClass = computed(() =>
  imageFit.value === 'contain' ? 'object-contain' : 'object-cover'
)

const gradientRGB = computed(() => {
  switch (gradientColor.value) {
    case 'purple':
      return '168,85,247' // purple-500
    case 'black':
      return '0,0,0'
    case 'blue':
    default:
      return '96,165,250' // blue-400
  }
})

const gradientStyle = computed(() => {
  if (!gradientEnabled.value) return { display: 'none' }
  const rgb = gradientRGB.value
  return {
    background: `linear-gradient(to right, rgba(${rgb},0.9) 0%, rgba(${rgb},0.9) 33%, rgba(${rgb},0) 100%)`
  }
})

const textPositionClass = computed(() => {
  if (textVPos.value === 'top') return 'top-4'
  if (textVPos.value === 'bottom') return 'bottom-4'
  return 'top-1/2 -translate-y-1/2'
})
</script>

<template>
  <div class="container px-4 mx-auto py-24">
    <h2 class="text-4xl">Edit Your Marketing Content</h2>
    <div class="grid lg:grid-cols-2 gap-8 mb-8">
      <div class="mt-6">
        <label class="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          class="block border border-gray-300 rounded-md p-2 w-full bg-gray-800 mb-4"
          placeholder="Title"
          v-model="title"
        />

        <label class="block text-sm font-medium mb-2">Description</label>
        <textarea
          class="block border border-gray-300 rounded-md p-2 w-full bg-gray-800 mb-4"
          rows="6"
          placeholder="Description"
          v-model="description"
        ></textarea>

        <input
          type="text"
          class="block border border-gray-300 rounded-md p-2 w-full bg-gray-800 mb-6"
          placeholder="Call to action text"
          v-model="cta"
        />
        <input
          type="text"
          class="block border border-gray-300 rounded-md p-2 w-full bg-gray-800 mb-6"
          placeholder="Image URL"
          v-model="imageUrl"
        />

        <h3 class="text-lg font-medium mt-8 mb-3">Customization</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm mb-1">Aspect ratio</label>
            <select
              v-model="aspectRatio"
              class="w-full bg-gray-800 border border-gray-300 rounded-md p-2"
            >
              <option value="square">1:1 (Square)</option>
              <option value="portrait">4:5 (Portrait)</option>
              <option value="story">9:16 (Story)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm mb-1">Image fit</label>
            <select
              v-model="imageFit"
              class="w-full bg-gray-800 border border-gray-300 rounded-md p-2"
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <input id="toggleLogo" type="checkbox" v-model="showLogo" class="h-4 w-4" />
            <label for="toggleLogo" class="text-sm">Show logo</label>
          </div>
          <div class="flex items-center gap-2">
            <input id="toggleGradient" type="checkbox" v-model="gradientEnabled" class="h-4 w-4" />
            <label for="toggleGradient" class="text-sm">Gradient overlay</label>
          </div>
          <div v-if="gradientEnabled">
            <label class="block text-sm mb-1">Gradient color</label>
            <select
              v-model="gradientColor"
              class="w-full bg-gray-800 border border-gray-300 rounded-md p-2"
            >
              <option value="blue">Blue</option>
              <option value="purple">Purple</option>
              <option value="black">Black</option>
            </select>
          </div>
          <div>
            <label class="block text-sm mb-1">Text position</label>
            <select
              v-model="textVPos"
              class="w-full bg-gray-800 border border-gray-300 rounded-md p-2"
            >
              <option value="top">Top</option>
              <option value="center">Center</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
        </div>
      </div>
      <div>
        <div :class="[aspectClass, 'bg-white relative overflow-hidden']">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            :class="[imageObjectClass, 'w-full h-full']"
            alt="preview"
          />
          <div
            class="absolute z-10 inset-0 w-full pointer-events-none"
            :style="gradientStyle"
          ></div>
          <img
            v-if="showLogo"
            src="../assets/logo.svg"
            class="w-1/2 absolute left-4 top-4 z-20"
            alt="logo"
          />
          <div class="absolute left-4 z-10 w-2/3" :class="textPositionClass">
            <h3 class="text-2xl font-semibold text-gray-900">{{ title }}</h3>
            <p class="mt-2 text-gray-800">{{ description }}</p>
            <button class="mt-4 bg-blue-600 text-white px-3 py-1 rounded">
              {{ cta || 'Call to Action' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-4">
      <button
        @click="goBack"
        class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
      >
        Back
      </button>
      <button
        @click="handleGenerate"
        class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
      >
        Download
      </button>
    </div>
  </div>
</template>

<style scoped>
h2 {
  font-weight: 500;
}

label {
  color: #e5e7eb;
}

input,
textarea {
  color: #fff;
}

input::placeholder,
textarea::placeholder {
  color: #9ca3af;
}
</style>

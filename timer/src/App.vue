<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { DateTime } from 'luxon'

const startdate = ref(DateTime.now().plus({ seconds: 2 }))
const enddate = ref(DateTime.now().plus({ seconds: 12 }))
const now = ref(DateTime.now())

const startString = ref(startdate.value.toLocaleString(DateTime.TIME_SIMPLE))
const endString = ref(enddate.value.toLocaleString(DateTime.TIME_SIMPLE))

const timername = ref('Click to name your timer')

const editingStart = ref(false)
const editingEnd = ref(false)
const editingName = ref(false)

const progress_percentage = computed(() => {
  if (now.value > enddate.value) {
    return 100
  }
  if (now.value < startdate.value) {
    return 0
  }
  return (
    (100 * (now.value.toMillis() - startdate.value.toMillis())) /
    (enddate.value.toMillis() - startdate.value.toMillis())
  )
})

const colorstate = computed(() => {
  return now.value < startdate.value
    ? ''
    : progress_percentage.value < 33
      ? 'green'
      : progress_percentage.value < 66
        ? 'yellow'
        : progress_percentage.value < 83
          ? 'orange'
          : 'red'
})

watch(colorstate, (color) => {
  document.body.classList.remove('green', 'yellow', 'orange', 'red')
  if (color != '') document.body.classList.add(color)
})

const progress_timer = computed(() => {
  const seconds =
    now.value > enddate.value
      ? 0
      : now.value < startdate.value
        ? Math.floor(enddate.value.toSeconds()) - Math.floor(startdate.value.toSeconds())
        : Math.ceil(enddate.value.toSeconds() - now.value.toSeconds())
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  const minLeft = (minutes - 60 * hours).toString().padStart(2, '0')
  const secLeft = (seconds - 60 * minutes).toString().padStart(2, '0')

  return hours + ':' + minLeft + ':' + secLeft
})

watch(progress_timer, (time: string) => {
  document.title = time
})
watch(startString, (newString) => {
  const [h, m] = newString.split(':')
  startdate.value = DateTime.now().set({ hour: parseInt(h), minute: parseInt(m), second: 0 })
})
watch(endString, (newString) => {
  const [h, m] = newString.split(':')
  enddate.value = DateTime.now().set({ hour: parseInt(h), minute: parseInt(m), second: 0 })
})

setInterval(() => {
  now.value = DateTime.now()
}, 100)
</script>

<template>
  <h3>
    Running from
    <span v-if="editingStart">
      <input
        type="time"
        name="start"
        v-model="startString"
        @blur="editingStart = false"
        @keyup.enter="editingStart = false"
    /></span>
    <span v-else @click="editingStart = true">{{
      startdate.toLocaleString(DateTime.TIME_SIMPLE)
    }}</span>
    to
    <span v-if="editingEnd">
      <input
        type="time"
        name="end"
        v-model="endString"
        @blur="editingEnd = false"
        @keyup.enter="editingEnd = false"
    /></span>
    <span v-else @click="editingEnd = true">{{
      enddate.toLocaleString(DateTime.TIME_SIMPLE)
    }}</span>
  </h3>
  <div class="progressbar">
    <div :style="{ width: progress_percentage + '%' }"></div>
  </div>
  <p class="bigtime">{{ progress_timer }}</p>
  <h4 v-if="editingName">
    <input v-model="timername" @blur="editingName = false" @keyup.enter="editingName = false" />
  </h4>
  <h4 v-else @click="editingName = true">{{ timername }}</h4>
  <footer>
    <a href="https://github.com/TacoV/punpuntimer"><img src="/img/github-mark-white.svg" /></a>
  </footer>
</template>

<style scoped>
* {
  font-family: 'Arimo', sans-serif;
  text-align: center;
}

h3 {
  font-size: 26px;
  letter-spacing: 2px;
  input {
    font-size: 26px;
    letter-spacing: 2px;
    border: 0;
  }
}

div.progressbar {
  border: 2px solid white;
  height: 26px;
  margin: 5px 0;
  padding: 0;
  div {
    background: white;
    height: 100%;
    transition: width 0.1s;
  }
}

p.bigtime {
  font-size: 205px;
  font-weight: bold;
  line-height: 1em;
}

h4 {
  font-size: 16px;
  letter-spacing: 4px;
  input {
    width: 100%;
    font-size: 16px;
    letter-spacing: 4px;
  }
}
footer {
  text-align: right;
  img {
    opacity: 0.2;
    height: 2em;
  }
}
</style>

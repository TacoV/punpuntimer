<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { DateTime } from 'luxon'

const startdate = ref(DateTime.now().plus({ seconds: 2 }))
const enddate = ref(DateTime.now().plus({ seconds: 12 }))
const now = ref(DateTime.now())

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
  return Math.floor(
    (100 * secondsBetween(startdate.value, now.value)) /
      secondsBetween(startdate.value, enddate.value),
  )
})

const colorstate = computed(() => {
  const progress = progress_percentage.value
  if (now.value < startdate.value) {
    return ''
  }
  if (progress < 33) {
    return 'green'
  }
  if (progress < 66) {
    return 'yellow'
  }
  if (progress < 83) {
    return 'orange'
  }
  return 'red'
})

watch(colorstate, (color) => {
  document.body.classList.remove('green', 'yellow', 'orange', 'red')
  if (color != '') document.body.classList.add(color)
})

const pad = (n: number): string => n.toString().padStart(2, '0')

const secondsBetween = (a: DateTime, b: DateTime): number => (b.toMillis() - a.toMillis()) / 1000

const progress_timer = computed(() => {
  const seconds =
    now.value > enddate.value
      ? 0
      : now.value < startdate.value
        ? Math.floor(secondsBetween(startdate.value, enddate.value))
        : Math.floor(secondsBetween(now.value, enddate.value)) + 1
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  const minLeft = pad(minutes - 60 * hours)
  const secLeft = pad(seconds - 60 * minutes)

  return hours + ':' + minLeft + ':' + secLeft
})

const adjustTime = (event: Event) => {
  if (!event || !event.target) {
    return
  }
  const target = event.target as HTMLInputElement

  if (target.name == 'start') {
    const [h, m] = target.value.split(':')
    startdate.value = DateTime.now().set({ hour: parseInt(h), minute: parseInt(m), second: 0 })
    editingStart.value = false
  }

  if (target.name == 'end') {
    const [h, m] = target.value.split(':')
    enddate.value = DateTime.now().set({ hour: parseInt(h), minute: parseInt(m), second: 0 })
    if (enddate.value < startdate.value) {
      enddate.value = enddate.value.plus({ day: 1 })
    }
    editingEnd.value = false
  }
}

setInterval(() => {
  now.value = DateTime.now()
}, 50)
</script>

<template>
  <h3>
    Running from
    <span v-if="editingStart">
      <input
        type="time"
        name="start"
        :value="startdate.toLocaleString(DateTime.TIME_SIMPLE)"
        @change="adjustTime"
        @blur="editingStart = false"
    /></span>
    <span v-else @click="editingStart = true">{{
      startdate.toLocaleString(DateTime.TIME_SIMPLE)
    }}</span>
    to
    <span v-if="editingEnd">
      <input
        type="time"
        name="end"
        :value="enddate.toLocaleString(DateTime.TIME_SIMPLE)"
        @change="adjustTime"
        @blur="editingEnd = false"
    /></span>
    <span v-else @click="editingEnd = true">{{
      enddate.toLocaleString(DateTime.TIME_SIMPLE)
    }}</span>
  </h3>
  <div class="progressbar">
    <div :style="{ width: progress_percentage + '%' }"></div>
  </div>
  <p class="bigtime">{{ progress_timer }}</p>
  <h4 v-if="editingName"><input v-model="timername" @blur="editingName = false" /></h4>
  <h4 v-else @click="editingName = true">{{ timername }}</h4>
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
    transition: width 0.5s;
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
</style>

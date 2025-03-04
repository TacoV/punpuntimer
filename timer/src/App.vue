<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { DateTime } from 'luxon'

const startdate = ref(DateTime.now().plus({ seconds: 2 }))
const enddate = ref(DateTime.now().plus({ seconds: 12 }))
const now = ref(DateTime.now())

const progress_percentage = computed(() => {
  if (now.value > enddate.value) {
    return 100
  }
  if (now.value < startdate.value) {
    return 0
  }
  return Math.floor((100 * secondsBetween(startdate, now)) / secondsBetween(startdate, enddate))
})

const colorstate = computed(() => {
  const progress = progress_percentage.value
  if (progress == 0) {
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
  const body = document.querySelector('body')
  body.classList.remove('green', 'yellow', 'orange', 'red')
  body.classList.add(color)
})

const pad = (n: number): string => n.toString().padStart(2, '0')

const secondsBetween = (a: DateTime, b: DateTime): number =>
  (b.value.toMillis() - a.value.toMillis()) / 1000

const progress_timer = computed(() => {
  const seconds =
    now.value > enddate.value
      ? 0
      : now.value < startdate.value
        ? Math.floor(secondsBetween(startdate, enddate))
        : Math.floor(secondsBetween(now, enddate)) + 1
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  const minLeft = pad(minutes - 60 * hours)
  const secLeft = pad(seconds - 60 * minutes)

  return hours + ':' + minLeft + ':' + secLeft
})

setInterval(() => {
  now.value = DateTime.now()
}, 50)
</script>

<template>
  <div class="timer">
    <h3>
      Running from {{ startdate.toLocaleString(DateTime.TIME_SIMPLE) }} to
      {{ enddate.toLocaleString(DateTime.TIME_SIMPLE) }}
    </h3>
    <div class="progressbar">
      <div :style="{ width: progress_percentage + '%' }"></div>
    </div>
    <p>{{ progress_timer }}</p>
    <h4>Timer test - ROUND 1}</h4>
  </div>
</template>

<style scoped>
.timer {
  width: 920px;
  height: 248px;
  display: block;
  position: absolute;
  margin-left: -460px;
  margin-top: -150x;
  top: 50%;
  left: 50%;
  text-align: center;
}
.timer h3 {
  font-size: 26px;
  letter-spacing: 4px;
  text-align: center;
  margin: 0 0 10px 0;
  padding: 0;
  font-family: 'Arimo', sans-serif;
}
.timer div.progressbar {
  border: 2px solid white;
  height: 26px;
  margin: 5px 0;
  padding: 0;
}
.timer div.progressbar div {
  background: white;
  height: 100%;
  margin: 0;
  padding: 0;
  transition: width 0.1s;
}
.timer p {
  font-family: 'Arimo', sans-serif;
  font-size: 205px;
  font-weight: bold;
  line-height: 180px;
  margin: 0;
  padding: 0;
}
.timer h4 {
  width: 100%;
  font-size: 16px;
  letter-spacing: 6px;
  text-align: center;
  padding-top: 25px;
  float: left;
  margin: 0;
  padding: 0;
  font-family: 'Arimo', sans-serif;
  text-transform: uppercase;
}
</style>

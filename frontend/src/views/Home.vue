<template>
  <h1>Home</h1>
  <button @click="gotoLogin">燈入夜面</button>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const gotoLogin = () => {
  router.push('/login')
}
</script>

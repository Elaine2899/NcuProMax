<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="login-container">
    <div class="login-left">
      <h1>NCU PRO MAX</h1>
    </div>

    <div class="login-right">
      <div class="login-form-container">
        <h1>登入</h1>
        <div class="login-form">
          <input class="input-form" type="text" placeholder="輸入學號" />
          <input class="input-form" type="password" placeholder="輸入密碼(區分大小寫)" />
          <div class="checkbox-container">
            <input type="checkbox" name="保持登入" id="keep-login" />
            <label for="keep-login">保持登入</label>
          </div>
        </div>
        <button @click="goToHome">登入</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
label {
  color: white;
  font-size: 0.8rem;
}
input[type='checkbox'] {
  cursor: pointer;
}
.input-form {
  border-radius: 5px;
  border: none;
  height: 2rem;
  padding: 0.5rem;
}
button {
  width: 60%;
  height: 2rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  background-color: rgb(159, 207, 239);
  color: rgb(17, 35, 92);
}
button:hover {
  background-color: rgb(10, 80, 120);
  transition: background-color 0.3s ease;
  color: white;
}
h1 {
  color: white;
  font-size: 2rem;
  text-align: center;
}
.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 50%;
  width: 60%;
  justify-content: space-evenly;
  background-color: rgb(81, 139, 178);
  border-radius: 20px;
  border: none;
  padding: 2rem;
}
.login-form-container {
  background-color: rgba(13, 101, 159, 0.5);
  width: 50%;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  border: none;
  gap: 1rem;
}
.login-right,
.login-left {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  background-image: url('/images/backgrounds/92382189_p0_master1200.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  filter: brightness(0.85);
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: row;
}
</style>

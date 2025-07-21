<template>
  <div class="overlay">
    <div class="modal">
      <h3>🎉 Congratulations! You made the leaderboard!</h3>
      <p>Your time: {{ time }} seconds</p>
      <form @submit.prevent="submit">
        <label for="initials">Enter your initials (3 letters max):</label>
        <input
          id="initials"
          v-model="initials"
          maxlength="3"
          pattern="[A-Za-z]{1,3}"
          required
          autofocus
        />
        <button type="submit" :disabled="!validInitials">Submit</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineEmits, defineProps } from 'vue';

const props = defineProps<{ time: number }>();
const emit = defineEmits<{ (e: 'submit', initials: string): void }>();

const initials = ref('');

const validInitials = computed(() => /^[A-Za-z]{1,3}$/.test(initials.value.trim()));

function submit() {
  if (validInitials.value) {
    emit('submit', initials.value.trim().toUpperCase());
    initials.value = '';
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 8px;
  max-width: 320px;
  text-align: center;
}
input {
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0 1rem;
  font-size: 1.1rem;
  text-transform: uppercase;
}
button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

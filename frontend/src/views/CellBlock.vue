<template>
  <div
    class="cell"
    :class="{
      revealed: cell.isRevealed,
      flagged: cell.isFlagged,
      mine: cell.isRevealed && cell.isMine,
    }"
    @click.left.prevent="handleReveal"
    @click.right.prevent="handleFlag"
  >
    <template v-if="cell.isRevealed">
      <template v-if="cell.isMine">
        💣
      </template>
      <template v-else-if="cell.adjacentMines > 0">
        {{ cell.adjacentMines }}
      </template>
    </template>
    <template v-else-if="cell.isFlagged">
      🚩
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { Cell as CellType } from '@/types';
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{ cell: CellType }>();
const emit = defineEmits<{
  (e: 'reveal', cell: CellType): void;
  (e: 'flag', cell: CellType): void;
}>();

function handleReveal() {
  emit('reveal', props.cell);
}

function handleFlag() {
  emit('flag', props.cell);
}
</script>

<style scoped>
.cell {
  width: 24px;
  height: 24px;
  border: 1px solid #777;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  background-color: #bdbdbd;
}
.cell.revealed {
  background-color: #e0e0e0;
  cursor: default;
  border-color: #999;
}
.cell.flagged {
  color: red;
}
.cell.mine {
  color: black;
  background-color: #f44336;
}
</style>

<template>
  <div class="game-container">
    <div class="status">
      Mines Left: {{ totalMines - flaggedCount }} | Time: {{ timer }}s
    </div>

    <div class="block">
      <div v-for="(row, rowIndex) in grid" :key="rowIndex" class="row">
        <CellBlock
          v-for="cell in row"
          :key="`${cell.row}-${cell.col}`"
          :cell="cell"
          @reveal="onReveal"
          @flag="onFlag"
        />
      </div>
    </div>

    <WinPrompt
      :time="timer"
      @submit="submitInitials"
    />

    <div v-if="gameOver" class="message">
      {{ gameWon ? '🎉 You won!' : '💣 You hit a mine. Game over!' }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import type  { Cell as CellType }  from '@/types';
import CellBlock from './CellBlock.vue';
import WinPrompt from './WinPrompt.vue';

const rows = 16;
const cols = 16;
const totalMines = 40;

const grid = ref<CellType[][]>([]);
const timer = ref(0);
const gameOver = ref(false);
const gameWon = ref(false);
const flaggedCount = ref(0);
const showWinPrompt = ref(true);
let intervalId: number;

onMounted(() => {
  startGame();
});

function startGame() {
  grid.value = generateGrid(rows, cols, totalMines);
  timer.value = 0;
  flaggedCount.value = 0;
  gameOver.value = false;
  gameWon.value = false;
  showWinPrompt.value = false;

  intervalId = setInterval(() => timer.value++, 1000);
}

function generateGrid(r: number, c: number, mines: number): CellType[][] {
  const grid: CellType[][] = [];

  for (let i = 0; i < r; i++) {
    const row: CellType[] = [];
    for (let j = 0; j < c; j++) {
      row.push({
        row: i,
        col: j,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      });
    }
    grid.push(row);
  }

  // 2. Place mines
  let placed = 0;
  while (placed < mines) {
    const i = Math.floor(Math.random() * r);
    const j = Math.floor(Math.random() * c);
    if (!grid[i][j].isMine) {
      grid[i][j].isMine = true;
      placed++;
    }
  }

  // 3. Calculate adjacent mines
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      if (!grid[i][j].isMine) {
        let count = 0;
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const ni = i + dx, nj = j + dy;
            if (ni >= 0 && ni < r && nj >= 0 && nj < c && grid[ni][nj].isMine) {
              count++;
            }
          }
        }
        grid[i][j].adjacentMines = count;
      }
    }
  }

  return grid;
}

function onReveal(cell: CellType) {
  if (gameOver.value || cell.isRevealed || cell.isFlagged) return;

  cell.isRevealed = true;

  if (cell.isMine) {
    endGame(false);
    return;
  }

  // Reveal adjacent if 0
  if (cell.adjacentMines === 0) {
    revealAdjacent(cell.row, cell.col);
  }

  checkWin();
}

function onFlag(cell: CellType) {
  if (cell.isRevealed || gameOver.value) return;
  cell.isFlagged = !cell.isFlagged;
  flaggedCount.value += cell.isFlagged ? 1 : -1;
}

function revealAdjacent(row: number, col: number) {
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const ni = row + dx, nj = col + dy;
      if (ni >= 0 && ni < rows && nj >= 0 && nj < cols) {
        const neighbor = grid.value[ni][nj];
        if (!neighbor.isRevealed && !neighbor.isMine && !neighbor.isFlagged) {
          neighbor.isRevealed = true;
          if (neighbor.adjacentMines === 0) {
            revealAdjacent(ni, nj);
          }
        }
      }
    }
  }
}

function checkWin() {
  const allRevealed = grid.value.flat().every(cell =>
    cell.isRevealed || cell.isMine
  );

  if (allRevealed) {
    endGame(true);
  }
}

function endGame(won: boolean) {
  gameOver.value = true;
  gameWon.value = won;
  clearInterval(intervalId);

  if (won) {
    checkLeaderboard();
  }
}

async function checkLeaderboard() {
  const res = await fetch('/api/leaderboard');
  const top10 = await res.json();
  const slowest = top10[9]?.time ?? Infinity;

  if (timer.value < slowest || top10.length < 10) {
    showWinPrompt.value = true;
  }
}

async function submitInitials(initials: string) {
  await fetch('/api/leaderboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      initials,
      time: timer.value,
      date: new Date().toISOString(),
    }),
  });

  showWinPrompt.value = false;
}
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-rows: repeat(16, 1fr);
  grid-template-columns: repeat(16, 1fr);
}
.row {
  display: flex;
}
.message {
  margin-top: 10px;
  font-weight: bold;
  font-size: 1.2em;
}
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;      
  justify-content: center;  
  min-height: 100vh;        
  padding: 1rem;
}
</style>

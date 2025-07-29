   🎮 High-Performance Tetris Implementation Plan

Architecture Overview:

 • Backend: Phoenix controllers with SQLite persistence for game sessions and high scores
 • Frontend: Svelte 5 + Canvas rendering + Web Workers for maximum performance
 • Design: Game Boy aesthetic with green monochrome palette and brick borders

Key Performance Features:

 • Web Worker for game logic (keeps UI thread free)
 • Canvas rendering with pre-baked sprite sheets
 • Debounced SQLite persistence (every 5s or on visibility change)
 • PWA caching for instant offline loading
 • Manual Vite chunks for optimal loading

Database Schema:

 • sessions table: user_id, game state (JSON), score, level, lines
 • high_scores table: user_id, score, level, lines with composite indexes

Implementation Highlights:

 • Game engine in TypeScript with Int8Array board (10×20 = 200 elements)
 • RequestAnimationFrame loop with frame diffs via postMessage
 • Tailwind custom colors for Game Boy palette
 • IndexedDB for offline resume capability

Would you like me to proceed with implementing this Tetris game based on this plan? I can start with the database migrations and work
through the components systematically.
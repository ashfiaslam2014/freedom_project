#!/bin/bash
echo "Starting Agent 1: Architecture..."
claude -p "Task: Architecture & Code Maintainability. Refactor app.js into modular ES6 files (e.g., state.js, storage.js, ui.js, charts.js) and update index.html accordingly. Ensure it runs correctly." --dangerously-skip-permissions > agent1.log 2>&1 &
PID1=$!

echo "Starting Agent 2: UI/UX..."
claude -p "Task: UI/UX & Aesthetics. Improve style.css by adding responsive mobile layout (e.g., hamburger menu / bottom nav instead of fixed sidebar), micro-animations, and light/dark theme toggle." --dangerously-skip-permissions > agent2.log 2>&1 &
PID2=$!

echo "Starting Agent 3: Features..."
claude -p "Task: Core Functionality. Add multi-currency support to the app via a settings modal, and add an Export to CSV feature for transactions." --dangerously-skip-permissions > agent3.log 2>&1 &
PID3=$!

echo "Starting Agent 4: PWA..."
claude -p "Task: Performance & PWA. Create a manifest.json and a basic service worker (sw.js) to make the app a Progressive Web App, and register it in the main js or html." --dangerously-skip-permissions > agent4.log 2>&1 &
PID4=$!

echo "Waiting for all agents to finish..."
wait $PID1 $PID2 $PID3 $PID4
echo "All agents have completed their tasks."

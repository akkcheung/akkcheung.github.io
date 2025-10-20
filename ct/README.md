# Cognitive Training Games

This project is a collection of web-based games designed to test and improve cognitive abilities.

## Features

*   **User Management:** The application supports multiple users and stores game results for each user.
*   **Game Results:** Game results are saved in the browser's `localStorage`, allowing users to track their progress over time.

## Games

The application includes the following games:

*   **Memory Game:** A classic card-matching memory game.
*   **Reaction Time Test:** A test to measure your reaction time.
*   **Stroop Test:** A test based on the Stroop effect, which demonstrates the interference in the reaction time of a task.
*   **Trail Making Test:** A test of visual attention and task switching.
*   **Mirror Game:** A game to test your ability to identify mirror images.
*   **Charts:** A section to visualize the results from the games.

## How to Play

1.  Open the `index.html` file in your web browser.
2.  Add a new user or select an existing user.
3.  Select a game from the navigation menu.
4.  Follow the on-screen instructions for each game.

## Radar Chart Logic

The radar chart in the "View Charts" section provides an overall performance summary across all games. Since each game has a different scoring mechanism, the scores are normalized to a common scale of 0-100% for comparison.

Here is the logic for how each game's score is normalized:

*   **Memory Game:** Lower is better (fewer moves). A score of 0 moves is considered 100%, while a score of 50 moves or more is 0%.
*   **Reaction Time Test:** Lower is better (faster time). A reaction time of 150ms or less is 100%, while a time of 1000ms or more is 0%.
*   **Stroop Test:** Higher is better. A score of 30 or more is 100%.
*   **Trail Making Test:** Lower is better (faster time). A time of 0 seconds is 100%, while a time of 60 seconds or more is 0%.
*   **Mirror Game:** Higher is better. A score of 30 or more is 100%.

If you haven't played a particular game in the selected period (day or week), it will show a score of 0% for that game.

## Project Structure

*   `index.html`: The main entry point of the application.
*   `memory/`: Contains the files for the Memory Game.
*   `reaction/`: Contains the files for the Reaction Time Test.
*   `stroop/`: Contains the files for the Stroop Test.
*   `trail-making/`: Contains the files for the Trail Making Test.
*   `mirror-game/`: Contains the files for the Mirror Game.
*   `charts.html`, `charts.js`, `charts.css`: Files for the results visualization.
*   `data.js`: A module for handling data (e.g., user data, game results).
*   `index.js`, `style.css`: Main JavaScript and CSS files for the main page.

---
draft: true
date: 2026-06-15
order: "2006"
---
> [GitHub](https://github.com/will-pettifer/caravan) · [Play on itch.io](https://will-pettifer.itch.io/caravan)
>
> - [Game Design](#game-design)
> - [Data Structures](#data-structures)
> - [Evaluation Function](#evaluation-function)
> - [Minimax Search](#minimax-search)
> - [Reflections](#reflections)

*Caravan* is a turn-based card strategy game in Godot with four AI opponents, built as my final year project. It's based on the card game from *Fallout: New Vegas*, stripped of randomness and hidden information so it suits tree search. A random agent, a greedy one-move-lookahead agent and two minimax agents then play each other across hundreds of games.

- Redesigned a chance-based card game into a deterministic, perfect-information ruleset
- Custom data structures for fast, reversible moves across roughly 1.1 trillion positions
- An evaluation function built on winning lots and proximity to target values
- Minimax agents with configurable depth, benchmarked against the baselines
- 1,200+ head-to-head games, with statistical tests for first-move advantage

#### Game Design
The original has hidden hands and random draws, which is no good for search. So I made hands visible, removed the randomness and cut the deck to 1-10. Pairs summing to 10 now sum to 20, giving some cards dual purposes, and players can move cards between lots, which adds bluffing and reactive play. One extra win condition, a lot beating its opponent by sitting exactly 5 below it, widens the range of viable endgames.

#### Data Structures
A search agent applies and undoes thousands of moves per turn, so speed mattered. My array-based version worked but leaned on `pop_at()`, which shifts every later element on removal. The fix was storing the board as a string, with moves encoded as two-digit integers (source lot and card value). Positions are trivial to compare and print for debugging, and moves stay fast enough for deep search.

#### Evaluation Function
Unlike chess, Caravan's win conditions map directly onto measurable values: the number of winning lots and proximity to the target score. The evaluation combines both, weighting winning lots far above proximity. No heuristic tuning was needed for sensible play.

#### Minimax Search
Each agent generates the 20-30 legal moves per turn, searches recursively to a fixed depth, and returns the best line, flipping the evaluation sign each ply to alternate between players. Across 1,200+ games, results showed a clear hierarchy by search depth, confirming the algorithm worked. A possible second-move advantage appeared but wasn't statistically conclusive at the depths tested.

#### Reflections
The project hit its core goals: a polished, working game with a functioning minimax AI, evaluated through both data and playtesting. The main design weakness was the heavy mental arithmetic, which made thinking ahead less intuitive than in chess and played less fun against the strongest agents. On the AI side, search beyond depth 3 became impractically slow, which ruled out alpha-beta pruning experiments in the time available. Overall it was a crash course in adversarial search, from framing a real game as a search problem to statistically testing the results.
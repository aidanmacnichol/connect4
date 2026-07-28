#include "game.h"

#include <emscripten/bind.h>

using namespace emscripten;

// Thin wrappers so JS gets plain ints instead of C++ enum class values.
int currentPlayerInt(const Game& game) {
  return static_cast<int>(game.currentPlayer());
}

int winnerInt(const Game& game) { return static_cast<int>(game.winner()); }

int atInt(const Game& game, int row, int col) {
  return static_cast<int>(game.at(row, col));
}

EMSCRIPTEN_BINDINGS(connect4_engine) {
  constant("CELL_EMPTY", static_cast<int>(Cell::Empty));
  constant("CELL_RED", static_cast<int>(Cell::Red));
  constant("CELL_YELLOW", static_cast<int>(Cell::Yellow));

  class_<Game>("Game")
      .constructor<>()
      .function("play", &Game::play)
      .function("currentPlayer", &currentPlayerInt)
      .function("winner", &winnerInt)
      .function("isDraw", &Game::isDraw)
      .function("isOver", &Game::isOver)
      .function("at", &atInt)
      .class_function("rows", &Game::rows)
      .class_function("cols", &Game::cols);
}

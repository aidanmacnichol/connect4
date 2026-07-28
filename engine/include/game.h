#pragma once

#include "board.h"
#include "cell.h"

class Game {
 public:
  // Returns false if the move is illegal or the game is already over.
  bool play(int col);

  Cell currentPlayer() const;
  Cell winner() const;
  bool isDraw() const;
  bool isOver() const;
  void print() const;

  // Board accessors for UI / WASM.
  Cell at(int row, int col) const;
  static int rows();
  static int cols();

 private:
  Board board_;
  Cell current_ = Cell::Red;
  Cell winner_ = Cell::Empty;
  bool draw_ = false;

  bool inBounds_(int row, int col) const;
  int countInDirection_(int row, int col, int dr, int dc, Cell color) const;
  bool hasWinner_(int row, int col, Cell color) const;
};

#pragma once

#include "cell.h"

class Board {
 public:
  static constexpr int kRows = 6;
  static constexpr int kCols = 7;

  // Drop a piece. Returns the row it landed in, or -1 if illegal.
  int drop(int col, Cell player_color);

  Cell at(int row, int col) const;
  bool isFull(int col) const;
  bool isBoardFull() const;
  void print() const;

 private:
  Cell cells_[kRows][kCols]{};

  int getFirstEmptyRow(int col) const;
};

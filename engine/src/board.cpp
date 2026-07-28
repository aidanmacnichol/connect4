#include "board.h"

#include <iostream>

int Board::drop(int col, Cell player_color) {
  if (col < 0 || col >= kCols) {
    return -1;
  }
  int row = getFirstEmptyRow(col);
  if (row == -1) {
    return -1;
  }
  cells_[row][col] = player_color;
  return row;
}

Cell Board::at(int row, int col) const { return cells_[row][col]; }

bool Board::isFull(int col) const { return cells_[0][col] != Cell::Empty; }

bool Board::isBoardFull() const {
  for (int c = 0; c < kCols; ++c) {
    if (!isFull(c)) {
      return false;
    }
  }
  return true;
}

void Board::print() const {
  for (int r = 0; r < kRows; ++r) {
    for (int c = 0; c < kCols; ++c) {
      char ch = '.';
      if (cells_[r][c] == Cell::Red) {
        ch = 'R';
      } else if (cells_[r][c] == Cell::Yellow) {
        ch = 'Y';
      }
      std::cout << ch << ' ';
    }
    std::cout << '\n';
  }
  std::cout << "0 1 2 3 4 5 6\n";
}

int Board::getFirstEmptyRow(int col) const {
  if (isFull(col)) {
    return -1;
  }
  for (int i = kRows - 1; i >= 0; --i) {
    if (cells_[i][col] == Cell::Empty) {
      return i;
    }
  }
  return -1;
}

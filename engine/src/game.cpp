#include "game.h"

#include <iostream>

bool Game::play(int col) {
  if (winner_ != Cell::Empty || draw_) {
    std::cout << "game already over\n";
    return false;
  }

  const Cell player = current_;
  const int row = board_.drop(col, player);
  if (row == -1) {
    std::cout << "invalid move\n";
    return false;
  }

  if (hasWinner_(row, col, player)) {
    winner_ = player;
    return true;
  }

  if (board_.isBoardFull()) {
    draw_ = true;
    return true;
  }

  current_ = (current_ == Cell::Red) ? Cell::Yellow : Cell::Red;
  return true;
}

Cell Game::currentPlayer() const { return current_; }

Cell Game::winner() const { return winner_; }

bool Game::isDraw() const { return draw_; }

bool Game::isOver() const { return winner_ != Cell::Empty || draw_; }

void Game::print() const { board_.print(); }

Cell Game::at(int row, int col) const { return board_.at(row, col); }

int Game::rows() { return Board::kRows; }

int Game::cols() { return Board::kCols; }

bool Game::inBounds_(int row, int col) const {
  return row >= 0 && row < Board::kRows && col >= 0 && col < Board::kCols;
}

int Game::countInDirection_(int row, int col, int dr, int dc,
                            Cell color) const {
  int count = 0;
  int r = row + dr;
  int c = col + dc;
  while (inBounds_(r, c) && board_.at(r, c) == color) {
    ++count;
    r += dr;
    c += dc;
  }
  return count;
}

bool Game::hasWinner_(int row, int col, Cell color) const {
  if (!inBounds_(row, col)) {
    return false;
  }
  if (board_.at(row, col) != color) {
    return false;
  }

  const int directions[4][2] = {
      {0, 1},   // horizontal
      {1, 0},   // vertical
      {1, 1},   // diagonal down-right
      {-1, 1},  // diagonal up-right
  };

  for (const auto& dir : directions) {
    const int dr = dir[0];
    const int dc = dir[1];
    // +1 for the piece itself; count both directions along this line.
    const int count = 1 + countInDirection_(row, col, dr, dc, color) +
                      countInDirection_(row, col, -dr, -dc, color);
    if (count >= 4) {
      return true;
    }
  }
  return false;
}

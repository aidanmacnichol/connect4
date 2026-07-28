#include "game.h"

#include <iostream>

int main() {
  Game game;
  std::cout << "Connect 4 — enter a column 0-6 (or -1 to quit)\n";

  while (!game.isOver()) {
    game.print();
    std::cout << cellName(game.currentPlayer()) << " to move: ";

    int col = -1;
    if (!(std::cin >> col)) {
      break;
    }
    if (col == -1) {
      break;
    }

    game.play(col);
  }

  game.print();
  if (game.winner() != Cell::Empty) {
    std::cout << cellName(game.winner()) << " wins!\n";
  } else if (game.isDraw()) {
    std::cout << "Draw!\n";
  }

  return 0;
}

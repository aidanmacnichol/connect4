#pragma once

enum class Cell {
  Empty,
  Red,
  Yellow,
};

inline const char* cellName(Cell c) {
  switch (c) {
    case Cell::Red:
      return "Red";
    case Cell::Yellow:
      return "Yellow";
    case Cell::Empty:
      return "Empty";
  }
  return "?";
}

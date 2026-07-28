package game

import (
	"errors"
	"fmt"
)

var (
	ErrInvalidColumn = errors.New("invalid column")
	ErrColumnFull    = errors.New("column full")
)

type Board struct {
	cells [Rows][Cols]Cell
}

// Drop places a piece with gravity. Returns the row it landed in.
func (b *Board) Drop(col int, color Cell) (int, error) {
	if col < 0 || col >= Cols {
		return -1, ErrInvalidColumn
	}
	row := b.getFirstEmptyRow(col)
	if row == -1 {
		return -1, ErrColumnFull
	}
	b.cells[row][col] = color
	return row, nil
}

func (b *Board) At(row, col int) Cell {
	return b.cells[row][col]
}

// IsFull reports whether the top cell of the column is occupied.
func (b *Board) IsFull(col int) bool {
	return b.cells[0][col] != Empty
}

func (b *Board) IsBoardFull() bool {
	for c := 0; c < Cols; c++ {
		if !b.IsFull(c) {
			return false
		}
	}
	return true
}

func (b *Board) Cells() [Rows][Cols]Cell {
	return b.cells
}

func (b *Board) Print() {
	for r := 0; r < Rows; r++ {
		for c := 0; c < Cols; c++ {
			ch := "."
			switch b.cells[r][c] {
			case Red:
				ch = "R"
			case Yellow:
				ch = "Y"
			}
			fmt.Print(ch, " ")
		}
		fmt.Println()
	}
	fmt.Println("0 1 2 3 4 5 6")
}

// getFirstEmptyRow finds the lowest empty row in col (row 0 = top).
// Returns -1 if the column is full.
func (b *Board) getFirstEmptyRow(col int) int {
	if b.IsFull(col) {
		return -1
	}
	for i := Rows - 1; i >= 0; i-- {
		if b.cells[i][col] == Empty {
			return i
		}
	}
	return -1
}

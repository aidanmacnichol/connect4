package game

import (
	"errors"
	"testing"
)

func TestDropStacksFromBottom(t *testing.T) {
	var b Board

	row, err := b.Drop(3, Red)
	if err != nil {
		t.Fatalf("drop: %v", err)
	}
	if row != Rows-1 {
		t.Fatalf("first piece should land on bottom row %d, got %d", Rows-1, row)
	}
	if b.At(Rows-1, 3) != Red {
		t.Fatalf("expected Red at bottom of col 3")
	}

	row, err = b.Drop(3, Yellow)
	if err != nil {
		t.Fatalf("second drop: %v", err)
	}
	if row != Rows-2 {
		t.Fatalf("second piece should stack at row %d, got %d", Rows-2, row)
	}
}

func TestDropFullColumn(t *testing.T) {
	var b Board
	for i := 0; i < Rows; i++ {
		color := Red
		if i%2 == 1 {
			color = Yellow
		}
		if _, err := b.Drop(0, color); err != nil {
			t.Fatalf("drop %d: %v", i, err)
		}
	}
	if _, err := b.Drop(0, Red); !errors.Is(err, ErrColumnFull) {
		t.Fatalf("expected ErrColumnFull, got %v", err)
	}
}

func TestDropInvalidColumn(t *testing.T) {
	var b Board
	if _, err := b.Drop(-1, Red); !errors.Is(err, ErrInvalidColumn) {
		t.Fatalf("expected ErrInvalidColumn, got %v", err)
	}
	if _, err := b.Drop(Cols, Red); !errors.Is(err, ErrInvalidColumn) {
		t.Fatalf("expected ErrInvalidColumn, got %v", err)
	}
}

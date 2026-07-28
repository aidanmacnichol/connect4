package game

import (
	"errors"
	"testing"
)

func TestHorizontalWin(t *testing.T) {
	g := NewGame("test")

	moves := []int{3, 3, 4, 4, 2, 2, 1}
	for _, col := range moves {
		if err := g.Play(col); err != nil {
			t.Fatalf("Play(%d): %v", col, err)
		}
	}

	if !g.IsOver() {
		t.Fatal("expected game over")
	}
	if g.Winner() != Red {
		t.Fatalf("expected Red winner, got %v", g.Winner())
	}
	if g.IsDraw() {
		t.Fatal("expected win, not draw")
	}
}

func TestVerticalWin(t *testing.T) {
	g := NewGame("test")
	// Red stacks column 0; Yellow plays elsewhere.
	moves := []int{0, 1, 0, 1, 0, 1, 0}
	for _, col := range moves {
		if err := g.Play(col); err != nil {
			t.Fatalf("Play(%d): %v", col, err)
		}
	}
	if g.Winner() != Red {
		t.Fatalf("expected Red winner, got %v", g.Winner())
	}
}

func TestPlayAfterGameOver(t *testing.T) {
	g := NewGame("test")
	moves := []int{0, 1, 0, 1, 0, 1, 0}
	for _, col := range moves {
		if err := g.Play(col); err != nil {
			t.Fatalf("Play(%d): %v", col, err)
		}
	}
	if err := g.Play(2); !errors.Is(err, ErrGameOver) {
		t.Fatalf("expected ErrGameOver, got %v", err)
	}
}

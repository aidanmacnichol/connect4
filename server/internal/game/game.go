package game

import "errors"

var ErrGameOver = errors.New("game already over")

type Cell int

const (
	Empty Cell = iota
	Red
	Yellow
)

const Rows = 6
const Cols = 7

type Game struct {
	ID      string
	board   Board
	current Cell
	winner  Cell
	draw    bool
}

func NewGame(id string) *Game {
	return &Game{
		ID:      id,
		board:   Board{},
		current: Red,
		winner:  Empty,
		draw:    false,
	}
}

// Play drops for the current player, then checks win/draw and flips the turn.
func (g *Game) Play(col int) error {
	if g.IsOver() {
		return ErrGameOver
	}

	player := g.current
	row, err := g.board.Drop(col, player)
	if err != nil {
		return err
	}

	if g.hasWinner(row, col, player) {
		g.winner = player
		return nil
	}

	if g.board.IsBoardFull() {
		g.draw = true
		return nil
	}

	if g.current == Red {
		g.current = Yellow
	} else {
		g.current = Red
	}
	return nil
}

func (g *Game) Current() Cell {
	return g.current
}

func (g *Game) Winner() Cell {
	return g.winner
}

func (g *Game) IsDraw() bool {
	return g.draw
}

func (g *Game) IsOver() bool {
	return g.winner != Empty || g.draw
}

func (g *Game) At(row, col int) Cell {
	return g.board.At(row, col)
}

func (g *Game) Board() [Rows][Cols]Cell {
	return g.board.Cells()
}

func (g *Game) inBounds(row, col int) bool {
	return row >= 0 && row < Rows && col >= 0 && col < Cols
}

func (g *Game) countInDirection(row, col, dr, dc int, color Cell) int {
	count := 0
	r := row + dr
	c := col + dc
	for g.inBounds(r, c) && g.board.At(r, c) == color {
		count++
		r += dr
		c += dc
	}
	return count
}

func (g *Game) hasWinner(row, col int, color Cell) bool {
	if !g.inBounds(row, col) {
		return false
	}
	if g.board.At(row, col) != color {
		return false
	}

	directions := [4][2]int{
		{0, 1},  // horizontal
		{1, 0},  // vertical
		{1, 1},  // diagonal down-right
		{-1, 1}, // diagonal up-right
	}

	for _, dir := range directions {
		dr, dc := dir[0], dir[1]
		count := 1 + g.countInDirection(row, col, dr, dc, color) +
			g.countInDirection(row, col, -dr, -dc, color)
		if count >= 4 {
			return true
		}
	}
	return false
}

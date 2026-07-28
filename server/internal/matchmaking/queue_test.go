package matchmaking

import (
	"testing"
)

type TestPlayer struct {
	TestID string
}

func (tp *TestPlayer) ID() string {
	return tp.TestID
}

func TestEnqueueEmptyQueue(t *testing.T) {
	q := NewQueue()
	var p1 Player = &TestPlayer{TestID: "player1"}

	opponent, matched := q.Enqueue(p1)
	if matched {
		t.Fatal("expected no match on empty queue")
	}
	if opponent != nil {
		t.Fatal("expected nil opponent")
	}
	t.Log(q.players[0].ID())
}

func TestMatchPlayer(t *testing.T) {
	q := NewQueue()
	var p1 Player = &TestPlayer{TestID: "player1"}
	var p2 Player = &TestPlayer{TestID: "player2"}

	opponent, matched := q.Enqueue(p1)
	if matched || opponent != nil {
		t.Fatal("expected no match/nil opponent on empty queue")
	}

	opponent, matched = q.Enqueue(p2)
	if opponent.ID() != "player1" {
		t.Fatalf("matched wrong player: %s", opponent.ID())
	}

	if matched != true {
		t.Fatal("expected match")
	}

	if !q.isEmpty() {
		t.Fatal("expected empty queue")
	}
}

func TestCancel(t *testing.T) {
	q := NewQueue()
	p1 := &TestPlayer{TestID: "player1"}
	q.Enqueue(p1)
	q.Cancel(p1.ID())
	if !q.isEmpty() {
		t.Fatal("expected empty queue after cancel")
	}
}

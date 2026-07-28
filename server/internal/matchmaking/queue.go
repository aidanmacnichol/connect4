package matchmaking

import (
	"sync"
)

// separate so its easier to test (instead of Client slice)
type Player interface {
	ID() string
}

type Queue struct {
	players []Player
	mu      sync.Mutex
}

func NewQueue() *Queue {
	return &Queue{}
}

func (q *Queue) isEmpty() bool {
	return len(q.players) == 0
}

func (q *Queue) Enqueue(p Player) (opponent Player, matched bool) {

	q.mu.Lock()
	defer q.mu.Unlock()

	// Make sure player isnt already in queue
	// map for O(1) in the future would be nice
	if _, found := q.contains(p.ID()); found {
		return nil, false
	}

	// no players in queue
	if q.isEmpty() {
		q.players = append(q.players, p)
		return nil, false
	}

	// players in queue, match
	opponent = q.players[0]
	q.players = q.players[1:]
	return opponent, true
}

func (q *Queue) contains(id string) (idx int, found bool) {
	for idx, player := range q.players {
		if player.ID() == id {
			return idx, true
		}
	}
	return -1, false
}

func (q *Queue) Cancel(playerID string) {
	q.mu.Lock()
	defer q.mu.Unlock()

	idx, found := q.contains(playerID)
	if !found {
		return
	}
	q.players = append(q.players[:idx], q.players[idx+1:]...)
}

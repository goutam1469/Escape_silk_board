from fastapi import APIRouter
from models.requests import MoveRequest
from services.game_engine import (
    create_game,
    get_game
)
from services.judge import judge_action
from services.narrator import narrate

router = APIRouter()

#Start Game Endpoint
@router.post("/start")
def start_game():

    state = create_game()

    return {
        "session_id": state.session_id,
        "intro":
            "You are standing at Silk Board."
            "Your flight leaves in 60 minutes.",
        "state": state
    }

#Move Endpoint
@router.post("/move")
def make_move(request:MoveRequest):
    state = get_game(request.session_id)
    if not state:
        return {
            "error":"Invalid session"
        }
    result = judge_action(request.action)
    
    state.money += result["money_change"]
    state.distance_to_airport += result["distance_change"]
    state.time_remaining += result["time_change"]
    state.battery += result["battery_change"]

    narration = narrate(request.action)
    print("Narration: ", narration)

    if (
        state.distance_to_airport <= 0
        and state.time_remaining > 0
    ):
        state.game_over = True

    if state.time_remaining <=0:
        state.game_over = True

    return {
        "narration" : narration,
        "state" : state
    }
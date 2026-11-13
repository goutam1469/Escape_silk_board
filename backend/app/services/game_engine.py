import uuid

try:
    from app.models.state import GameState
except ModuleNotFoundError:
    from models.state import GameState

sessions = {}

def create_game():
    """
    Creates an instance of the Game's state with the 
    constraints
    """
    session_id = str(uuid.uuid4())

    state = GameState(
        session_id = session_id,
        money=500,
        battery=4,
        distance_to_airport=30,
        time_remaining=60,
        inventory=['cold samosa'],
        location="Silk Board"
    )

    sessions[session_id] = state

    return state

def get_game(session_id:str):
    """
    Returns a particular state of the game based
    on the unique session id
    """
    return sessions.get(session_id)
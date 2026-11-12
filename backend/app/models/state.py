from pydantic import BaseModel

class GameState(BaseModel):
    session_id : str

    money : int
    battery : int

    distance_to_airport : float
    time_remaining : int

    inventory : list[str]

    location : str
    game_over : bool = False
def judge_action(action:str):

    action = action.lower()

    if "samosa" in action:
        return {
            "money_change" : -480,
            "distance_change" : -0.2,
            "time_change" : -11,
            "battery_change" : 0 
        }

    elif "call" in action:
        return {
            "money_change" : -480,
            "distance_change" : -1,
            "time_change" : -5,
            "battery_change" : -1
        }

    else :
        return {
            "money_change" : 0,
            "distance_change" : -0.5,
            "time_change" : -10,
            "battery_change" : 0
        }
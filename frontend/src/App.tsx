import { useEffect, useState } from "react";

interface GameState {
  money: number;
  battery: number;
  distance_to_airport: number;
  time_remaining: number;
}

interface Message {
  role: "user" | "ai";
  text: string;
}

function App() {
  const [sessionId, setSessionId] = useState("");

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);

  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const startGame = async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/game/start",
        {
          method: "POST",
        }
      );

      const data = await response.json();

      setSessionId(data.session_id);

      setMessages([
        {
          role: "ai",
          text: data.intro,
        },
      ]);
    };

    startGame();
  }, []);

  const sendMove = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setMessage("");

    const response = await fetch(
      "http://127.0.0.1:8000/game/move",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          action: userMessage,
        }),
      }
    );

    const data = await response.json();
    console.log("MOVE RESPONSE:", data);

    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text: data.narration,
      },
    ]);

    setGameState(data.state);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#111827",
        color: "white",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          ✈️ Escape Silk Board
        </h1>

        {gameState && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                background: "#1f2937",
                padding: "12px",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <div>💰 Money</div>
              <div>₹{gameState.money}</div>
            </div>

            <div
              style={{
                background: "#1f2937",
                padding: "12px",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <div>🔋 Battery</div>
              <div>{gameState.battery}%</div>
            </div>

            <div
              style={{
                background: "#1f2937",
                padding: "12px",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <div>🛣 Distance</div>
              <div>{gameState.distance_to_airport} km</div>
            </div>

            <div
              style={{
                background: "#1f2937",
                padding: "12px",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <div>⏰ Time</div>
              <div>{gameState.time_remaining} min</div>
            </div>
          </div>
        )}

        <div
          style={{
            background: "#1f2937",
            borderRadius: "12px",
            padding: "20px",
            minHeight: "500px",
            marginBottom: "20px",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  msg.role === "user"
                    ? "flex-end"
                    : "flex-start",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "12px",
                  borderRadius: "12px",
                  backgroundColor:
                    msg.role === "user"
                      ? "#2563eb"
                      : "#374151",
                }}
              >
                <strong>
                  {msg.role === "user"
                    ? "YOU"
                    : "AI"}
                </strong>

                <div
                  style={{
                    marginTop: "5px",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            type="text"
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder="What do you want to do?"
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "none",
            }}
          />

          <button
            onClick={sendMove}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "12px 20px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
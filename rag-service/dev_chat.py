#file location: payment-integration/rag-service/dev_chat.py
import requests

API_URL = "http://localhost:8000/chat"
SESSION_ID = "dev-user-123"

print("🌿 FloraVerse AI Chat (Dev Mode)")
print("Type 'exit' to quit\n")

while True:
    message = input("You: ")

    if message.lower() == "exit":
        break

    try:
        res = requests.post(API_URL, json={
            "session_id": SESSION_ID,
            "message": message
        })

        data = res.json()

        print("\nBot:", data["answer"])

        if data.get("sources"):
            print("\nSources:")
            for s in data["sources"]:
                print(f"- {s['file']} (p.{s['page']})")

        print("\n" + "-"*40)

    except Exception as e:
        print("Error:", e)
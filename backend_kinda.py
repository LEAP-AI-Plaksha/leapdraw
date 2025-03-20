from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from supabase import create_client
import os
import random
import asyncio

# Environment variables for Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()
active_connections = {}
game_rooms = {}
ROUND_DURATION = 30  # 30 seconds per round

async def broadcast_message(room_id, message):
    connections = game_rooms[room_id]['clients']
    for connection in connections:
        await connection.send_json(message)

async def update_leaderboard(room_id):
    try:
        response = supabase.table("leaderboard").select("*").order("score", desc=True).execute()
        leaderboard_data = {"status": "success", "leaderboard": response.data}
        await broadcast_message(room_id, leaderboard_data)
    except Exception as e:
        print(f"Broadcast error: {str(e)}")

async def next_round(room_id):
    game_rooms[room_id]['round'] += 1
    if game_rooms[room_id]['round'] >= 5:  # End game after 5 rounds
        await broadcast_message(room_id, {"status": "game_over", "scores": game_rooms[room_id]['scores']})
        del game_rooms[room_id]  # Cleanup
        return
    drawer = random.choice(list(game_rooms[room_id]['scores'].keys()))
    game_rooms[room_id]['drawer'] = drawer
    await broadcast_message(room_id, {"status": "new_round", "round": game_rooms[room_id]['round'], "drawer": drawer})
    await asyncio.sleep(ROUND_DURATION)  # Wait for 30 seconds before moving to the next round
    await next_round(room_id)

@app.post("/create_room/")
async def create_room(room_id: str):
    game_rooms[room_id] = {
        'clients': [],
        'scores': {},
        'round': 0,
        'drawer': None,
        'prompts': ["apple", "car", "house", "tree", "fish"],
    }
    return {"status": "room created", "room_id": room_id}

@app.websocket("/ws/{room_id}/{username}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, username: str):
    await websocket.accept()
    if room_id not in game_rooms:
        await websocket.send_json({"status": "error", "message": "Room does not exist."})
        await websocket.close()
        return
    game_rooms[room_id]['clients'].append(websocket)
    game_rooms[room_id]['scores'][username] = 0
    if not game_rooms[room_id]['drawer']:
        game_rooms[room_id]['drawer'] = username

    try:
        while True:
            data = await websocket.receive_json()
            if data.get("action") == "guess":
                prompt = game_rooms[room_id]['prompts'][game_rooms[room_id]['round']]
                if data.get("guess") == prompt:
                    game_rooms[room_id]['scores'][username] += 10
                    await update_leaderboard(room_id)
                    await broadcast_message(room_id, {"status": "correct", "username": username})
            elif data.get("action") == "draw":
                await broadcast_message(room_id, {"status": "drawing", "data": data.get("data")})
    except WebSocketDisconnect:
        game_rooms[room_id]['clients'].remove(websocket)
        await broadcast_message(room_id, {"status": "disconnected", "username": username})

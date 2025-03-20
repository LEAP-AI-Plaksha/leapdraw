from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from supabase import create_client
import os
import random
import asyncio
import base64
from PIL import Image
from io import BytesIO
from inference import predict_from_image, pad_image_to_square

# Environment variables for Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Load all possible prompts from a file
with open('categories.txt', 'r') as f:
    ALL_PROMPTS = [line.strip() for line in f.readlines()]

app = FastAPI()
active_connections = {}
game_rooms = {}
ROUND_DURATION = 30  # 30 seconds per round

# Message handler map
message_handlers = {}

def message_handler(message_type):
    def decorator(func):
        message_handlers[message_type] = func
        return func
    return decorator

async def broadcast_message(room_id, message):
    connections = game_rooms[room_id]['clients']
    for connection in connections:
        await connection.send_json(message)

async def update_leaderboard(room_id):
    try:
        response = supabase.table("leaderboard").select("*").order("score", desc=True).execute()
        leaderboard_data = {"type": "leaderboard_update", "leaderboard": response.data}
        await broadcast_message(room_id, leaderboard_data)
    except Exception as e:
        print(f"Broadcast error: {str(e)}")

async def next_round(room_id):
    game_rooms[room_id]['round'] += 1
    if game_rooms[room_id]['round'] >= 5:  # End game after 5 rounds
        await broadcast_message(room_id, {"type": "game_over", "scores": game_rooms[room_id]['scores']})
        del game_rooms[room_id]  # Cleanup
        return
    drawer = random.choice(list(game_rooms[room_id]['scores'].keys()))
    game_rooms[room_id]['drawer'] = drawer
    prompt = random.choice(ALL_PROMPTS)
    game_rooms[room_id]['prompts'].append(prompt)
    await broadcast_message(room_id, {"type": "new_round", "round": game_rooms[room_id]['round'], "drawer": drawer, "prompt": prompt})
    await asyncio.sleep(ROUND_DURATION)
    await next_round(room_id)

@app.post("/create_room/")
async def create_room(room_id: str):
    game_rooms[room_id] = {
        'clients': [],
        'scores': {},
        'round': 0,
        'drawer': None,
        'prompts': [],
    }
    return {"status": "room created", "room_id": room_id}

@message_handler("guess_send")
async def handle_guess(room_id, username, data):
    guess = data.get("guess")
    prompt = game_rooms[room_id]['prompts'][game_rooms[room_id]['round']]
    correct = (guess.lower().strip() == prompt.lower().strip())
    await broadcast_message(room_id, {"type": "guess_result", "username": username, "guess": guess, "correct": correct})
    if correct:
        game_rooms[room_id]['scores'][username] += 10
        await update_leaderboard(room_id)

@message_handler("chat_send")
async def handle_chat(room_id, username, data):
    await broadcast_message(room_id, {"type": "chat_receive", "username": username, "message": data.get("message")})

@app.websocket("/ws/{room_id}/{username}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, username: str):
    await websocket.accept()
    if room_id not in game_rooms:
        await websocket.send_json({"type": "error", "message": "Room does not exist."})
        await websocket.close()
        return
    game_rooms[room_id]['clients'].append(websocket)
    game_rooms[room_id]['scores'][username] = 0
    if not game_rooms[room_id]['drawer']:
        game_rooms[room_id]['drawer'] = username
        await broadcast_message(room_id, {"type": "drawer_assigned", "drawer": username})
    await broadcast_message(room_id, {"type": "user_joined", "username": username})

    try:
        while True:
            data = await websocket.receive_json()
            message_type = data.get("type")
            handler = message_handlers.get(message_type)
            if handler:
                await handler(room_id, username, data)
    except WebSocketDisconnect:
        game_rooms[room_id]['clients'].remove(websocket)
        if not game_rooms[room_id]['clients']:
            del game_rooms[room_id]  # Clean up empty room
        await broadcast_message(room_id, {"type": "user_left", "username": username})

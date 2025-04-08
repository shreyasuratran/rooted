import asyncio
import aiohttp
from datetime import datetime, timezone, timedelta
import random

API_BASE_URL = "http://127.0.0.1:8000/plants"  # Change this if running elsewhere

async def fetch_all_plants(session):
    """Fetch all plants from the API."""
    async with session.get(f"{API_BASE_URL}/all") as response:
        if response.status == 200:
            return await response.json()
        else:
            print(f"Error fetching plants: {response.status}")
            return []

async def update_plant(session, plant_id, update_data):
    """Update plant fields via PUT request."""
    async with session.put(f"{API_BASE_URL}/{plant_id}", json=update_data) as response:
        if response.status == 200:
            print(f"Updated plant {plant_id}: {update_data}")
        else:
            print(f"Failed to update plant {plant_id}: {response.status}")

def calculate_new_values(plant):
    """Generate realistic new values based on previous values."""
    updated_fields = {}

    # Simulate moisture loss over time
    if not plant["water"] :
        updated_fields["water"] = round(random.uniform(50.0, 100.0), 2)
    else :
        updated_fields["water"] = round(max(0.0, plant["water"] - random.uniform(0.1, 0.5)), 2)

    # Simulate realistic temperature fluctuations
    if not plant["temperature"] :
        updated_fields["temperature"] = round(random.uniform(50.0, 100.0), 2)
    else :
        updated_fields["temperature"] = round(plant["temperature"] + random.uniform(-0.5, 0.5), 2)

    # Simulate humidity changes
    if not plant["humidity"] :
        updated_fields["humidity"] = round(random.uniform(50.0, 100.0), 2)
    else :
        updated_fields["humidity"] = round(max(0.0, min(100.0, plant["humidity"] + random.uniform(-1.0, 1.0))), 2)

    return updated_fields

async def simulate_plant_updates():
    """Periodically fetch and update plant data."""
    async with aiohttp.ClientSession() as session:
        while True:
            plants = await fetch_all_plants(session)
            if not plants:
                print("No plants found. Retrying in 10 seconds...")
            else:
                tasks = []
                for plant in plants:
                    update_data = calculate_new_values(plant)
                    tasks.append(update_plant(session, plant["id"], update_data))
                
                await asyncio.gather(*tasks)

            await asyncio.sleep(3)

if __name__ == "__main__":
    asyncio.run(simulate_plant_updates())
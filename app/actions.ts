"use server";

import { kv } from "@vercel/kv";
import { promises as fs } from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data/rooms.json");

// Migration function to run once
async function migrateDataToKV() {
  try {
    // Check if data is already migrated
    const isMigrated = await kv.get("dataMigrated");
    if (isMigrated) return;

    // Read data from JSON file
    const fileContent = await fs.readFile(dataFilePath, "utf-8");
    const roomStates = JSON.parse(fileContent);

    // Store data in KV
    await kv.set("roomStates", roomStates);
    await kv.set("dataMigrated", true);

    console.log("Data successfully migrated to KV");
  } catch (error) {
    console.error("Migration error:", error);
  }
}

export async function getRoomStates(): Promise<Record<string, boolean>> {
  await migrateDataToKV();

  try {
    const states = (await kv.get("roomStates")) as Record<string, boolean>;
    return states || {};
  } catch (error) {
    console.error("Error fetching room states:", error);
    return {};
  }
}

export async function updateRoomState(
  roomName: string,
  isOccupied: boolean
): Promise<void> {
  try {
    const currentStates = await getRoomStates();
    const newStates = { ...currentStates, [roomName]: isOccupied };
    await kv.set("roomStates", newStates);
  } catch (error) {
    console.error("Error updating room state:", error);
    throw new Error("Failed to update room state");
  }
}

"use server";

import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const dataFilePath = path.join(process.cwd(), "data/rooms.json");

// Migration function to run once
async function migrateDataToSupabase() {
  try {
    // Check if table exists
    const { data: existingData } = await supabase
      .from("room_states")
      .select("*")
      .limit(1);

    if (!existingData || existingData.length === 0) {
      // Read data from JSON file
      const fileContent = await fs.readFile(dataFilePath, "utf-8");
      const roomStates = JSON.parse(fileContent);

      // Convert to array format for Supabase
      const roomData = Object.entries(roomStates).map(
        ([room_name, is_occupied]) => ({
          room_name,
          is_occupied,
        })
      );

      // Insert data into Supabase
      const { error } = await supabase.from("room_states").insert(roomData);

      if (error) throw error;
      console.log("Data successfully migrated to Supabase");
    }
  } catch (error) {
    console.error("Migration error:", error);
  }
}

export async function getRoomStates(): Promise<Record<string, boolean>> {
  await migrateDataToSupabase();

  try {
    const { data, error } = await supabase
      .from("room_states")
      .select("room_name, is_occupied");

    if (error) throw error;

    // Convert array to object format
    return data.reduce((acc, { room_name, is_occupied }) => {
      acc[room_name] = is_occupied;
      return acc;
    }, {} as Record<string, boolean>);
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
    const { error } = await supabase.from("room_states").upsert({
      room_name: roomName,
      is_occupied: isOccupied,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
  } catch (error) {
    console.error("Error updating room state:", error);
    throw new Error("Failed to update room state");
  }
}

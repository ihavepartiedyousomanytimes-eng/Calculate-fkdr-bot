import fetch from "node-fetch";
import { config } from "../config.js";

export async function getPlayerData(username) {
  const url = `https://api.hypixel.net/player?key=${config.hypixelApiKey}&name=${username}`;
  const res = await fetch(url);
  const json = await res.json();

  if (!json.success || !json.player) {
    throw new Error("Player not found on Hypixel.");
  }

  return json.player;
}

import fetch from "node-fetch";
import { config } from "../config.js";

const hypixelApiSettings = {
  HYPIXEL_API_URL: "https://api.hypixel.net/player",
  MOJANG_API_URL: "https://api.mojang.com/users/profiles/minecraft/"
};

class GetHypixelData {

  constructor() {
    if (!process.env.HYPIXEL_API_KEY) {
      throw new Error("Missing HYPIXEL_API_KEY env variable");
    }

    this.key = process.env.HYPIXEL_API_KEY;
    this.hypixelUrl = hypixelApiSettings.HYPIXEL_API_URL;
    this.mojangUrl = hypixelApiSettings.MOJANG_API_URL;
  }

  // Main function
  async getRawData(uuidOrName) {
    const uuid = await this.getUUID(uuidOrName);
    if (!uuid) return null;

    const hypixelData = await this.requestHypixel(uuid);
    return hypixelData?.player ?? null;
  }

  isValidUUID(uuid) {
    if (!uuid.includes("-") && uuid.length === 32) {
      uuid = uuid.replace(
        /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
        "$1-$2-$3-$4-$5"
      );
    }

    return /^[0-9a-fA-F-]{36}$/.test(uuid);
  }

  async requestMojang(name) {
    try {
      const response = await fetch(`${this.mojangUrl}${name}`);

      if (!response.ok) {
        throw new Error(`Mojang error ${response.status} for ${name}`);
      }

      const data = await response.json();
      return data?.id ?? null;

    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getUUID(name) {
    // UUID input
    if (name.length > 16) {
      if (this.isValidUUID(name)) return name;

      console.error("Invalid UUID:", name);
      return null;
    }

    // Username input
    const uuid = await this.requestMojang(name);
    if (uuid && this.isValidUUID(uuid)) return uuid;

    console.error("Invalid Mojang UUID:", uuid);
    return null;
  }

  async requestHypixel(uuid) {
    try {
      const response = await fetch(
        `${this.hypixelUrl}?key=${this.key}&uuid=${uuid}`
      );

      if (response.status === 429) throw new Error("Hypixel rate limit");
      if (response.status === 403) throw new Error("Invalid Hypixel API key");
      if (response.status === 400) throw new Error("Invalid Hypixel query");
      if (!response.ok) {
        throw new Error(`Hypixel error ${response.status} for ${uuid}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(`Hypixel API failure: ${JSON.stringify(data)}`);
      }

      return data;

    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

module.exports = new GetHypixelData();

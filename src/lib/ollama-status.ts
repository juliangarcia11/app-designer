import { invoke } from "@tauri-apps/api/core";

// Check if Ollama is running
export const checkOllamaStatus = async (): Promise<boolean> => {
  try {
    return await invoke("check_ollama_status");
  } catch (error) {
    console.error("Error checking Ollama status:", error);
    return false;
  }
};

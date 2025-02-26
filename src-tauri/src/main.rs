#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::fs;
use std::path::Path;
use tauri::{command, AppHandle};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct ExportOptions {
    format: String,
    path: String,
    content: String,
}

#[command]
fn export_document(_app: AppHandle, options: ExportOptions) -> Result<String, String> {
    let path = Path::new(&options.path);
    
    // Create any necessary directories
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    
    // Write the content to file
    fs::write(path, options.content).map_err(|e| e.to_string())?;
    
    Ok("Document exported successfully".to_string())
}

#[command]
fn check_ollama_status() -> Result<bool, String> {
    // Simple HTTP request to check if Ollama server is running
    let client = reqwest::blocking::Client::new();
    match client.get("http://localhost:11434/api/version").send() {
        Ok(response) => {
            if response.status().is_success() {
                Ok(true)
            } else {
                Ok(false)
            }
        },
        Err(_) => Ok(false),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            export_document,
            check_ollama_status
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
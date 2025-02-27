#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use tauri::{command, AppHandle};
use tauri_plugin_fs::FsExt;

#[derive(Debug, Serialize, Deserialize)]
struct ExportOptions {
    format: String,
    path: String,
    content: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct ExportMultipleOptions {
    format: String,
    directory_path: String,
    documents: Vec<DocumentSection>,
}

#[derive(Debug, Serialize, Deserialize)]
struct DocumentSection {
    title: String,
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
fn export_multiple_documents(_app: AppHandle, options: ExportMultipleOptions) -> Result<String, String> {
    let dir_path = Path::new(&options.directory_path);
    
    // Create the directory if it doesn't exist
    fs::create_dir_all(dir_path).map_err(|e| e.to_string())?;
    
    // Export each document section as a separate file
    for section in options.documents {
        let sanitized_title = sanitize_filename(&section.title);
        let file_path = dir_path.join(format!("{}.{}", sanitized_title, options.format));
        
        fs::write(&file_path, section.content).map_err(|e| e.to_string())?;
    }
    
    Ok("Documents exported successfully".to_string())
}

// Helper function to sanitize filenames
fn sanitize_filename(filename: &str) -> String {
    filename
        .chars()
        .map(|c| {
            if c.is_alphanumeric() || c == ' ' || c == '-' || c == '_' {
                c
            } else {
                '_'
            }
        })
        .collect::<String>()
        .trim()
        .replace(' ', "_")
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
        }
        Err(_) => Ok(false),
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            // allowed the given directory
            let scope = app.fs_scope();
            scope
                .allow_directory("/exports", false)
                .map_err(|e| e.to_string())?;
            dbg!(scope.is_allowed("/exports"));

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            export_document,
            export_multiple_documents,
            check_ollama_status
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

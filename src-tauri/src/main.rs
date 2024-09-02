#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{command, Builder, generate_context, generate_handler};
use std::fs;
use std::path::{Path, PathBuf};
use serde::Serialize;
use std::time::Instant;

#[derive(Serialize, Debug)]
struct FileInfo {
    name: String,
    file_type: String,
    full_path: String,
}

#[derive(Serialize, Debug)]
struct FolderInfo {
    name: String,
    full_path: String,
    files: Vec<FileInfo>,
    subfolders: Vec<FolderInfo>,
}

fn parse_folder(path: &Path) -> FolderInfo {
    let mut files = Vec::new();
    let mut subfolders = Vec::new();

    let skip_dirs = ["node_modules", "target", ".git", ".next"];

    for entry in fs::read_dir(path).expect("Failed to read directory") {
        let entry = entry.expect("Failed to get directory entry");
        let entry_path = entry.path();
        let entry_name = entry.file_name().into_string().expect("Invalid filename");

        if entry_path.is_dir() {
            if skip_dirs.contains(&entry_name.as_str()) {
                continue;
            }
            subfolders.push(parse_folder(&entry_path));
        } else if entry_path.is_file() {
            let file_type = entry_path.extension().and_then(|ext| ext.to_str()).unwrap_or("unknown").to_string();
            files.push(FileInfo {
                name: entry_name.clone(),
                file_type,
                full_path: entry_path.to_string_lossy().to_string(),
            });
        }
    }

    FolderInfo {
        name: path.file_name().unwrap().to_str().unwrap().to_string(),
        full_path: path.to_string_lossy().to_string(),
        files,
        subfolders,
    }
}

#[command]
fn process_folder_path(folder_path: String) -> String {
    println!("Received folder path: {}", folder_path);

    let path = Path::new(&folder_path);

    // Start the timer
    let start_time = Instant::now();

    // Process the folder
    let folder_info = parse_folder(path);

    // Serialize the folder structure into JSON
    let json_output = serde_json::to_string_pretty(&folder_info).unwrap();

    // Stop the timer
    let duration = start_time.elapsed();
    println!("Time taken: {:?}", duration);

    // Return the JSON output
    json_output
}

#[command]
fn read_file_content(file_path: String) -> Result<String, String> {
    fs::read_to_string(file_path).map_err(|err| err.to_string())
}

#[command]
fn write_file_content(file_path: String, content: String) -> Result<(), String> {
    fs::write(file_path, content).map_err(|err| err.to_string())
}

fn main() {
    Builder::default()
        .invoke_handler(generate_handler![
            process_folder_path, 
            read_file_content, 
            write_file_content
        ])
        .run(generate_context!())
        .expect("error while running tauri application");
}

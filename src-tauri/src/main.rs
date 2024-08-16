#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{command, Builder, generate_context, generate_handler};
use tokio::runtime::Runtime;


#[command]
fn process_folder_path(folder_path: String) -> String {
    println!("Received folder path: {}", folder_path);
    // Add your backend logic here, e.g., reading files from the folder, processing data, etc.
    folder_path
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![process_folder_path])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

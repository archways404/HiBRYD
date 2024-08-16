use std::fs;
use std::path::{Path, PathBuf};
use std::time::Instant;
use serde::Serialize;

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

fn process_folder_path(folder_path: String) -> FolderInfo {
    println!("Received folder path: {}", folder_path);
    
    let path = Path::new(&folder_path);
    parse_folder(path)
}

fn parse_folder(path: &Path) -> FolderInfo {
    let mut files = Vec::new();
    let mut subfolders = Vec::new();

    // Define directories to skip
    let skip_dirs = ["node_modules", "target", ".git", ".next"];

    // Read the directory and iterate over its contents
    for entry in fs::read_dir(path).expect("Failed to read directory") {
        let entry = entry.expect("Failed to get directory entry");
        let entry_path = entry.path();
        let entry_name = entry.file_name().into_string().expect("Invalid filename");

        if entry_path.is_dir() {
            // Skip the directory if it matches one in the skip list
            if skip_dirs.contains(&entry_name.as_str()) {
                continue;
            }
            // If it's a directory, recursively parse the subfolder
            subfolders.push(parse_folder(&entry_path));
        } else if entry_path.is_file() {
            // If it's a file, determine its extension and add it to the files vector
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

fn main() {
    let folder_path = "C:\\Users\\archways\\Documents\\GitHub\\softw404\\web".to_string();
    
    // Start the timer
    let start_time = Instant::now();
    
    let folder_info = process_folder_path(folder_path);
    
    // Serialize the folder structure into JSON
    let json_output = serde_json::to_string_pretty(&folder_info).unwrap();

    // Save the JSON output to a file
    fs::write("path.json", json_output).expect("Unable to write file");

    // Stop the timer
    let duration = start_time.elapsed();
    println!("Time taken: {:?}", duration);
}

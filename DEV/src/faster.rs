use std::fs;
use std::path::{Path};
use std::time::Instant;
use rayon::prelude::*;
use serde::Serialize;
use memmap2::MmapOptions;

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
    let skip_dirs = ["node_modules", "target", ".git", ".next"];

    let entries: Vec<_> = fs::read_dir(path)
        .expect("Failed to read directory")
        .filter_map(|entry| entry.ok())
        .collect();

    let files: Vec<FileInfo> = entries
        .par_iter()
        .filter(|entry| entry.path().is_file())
        .map(|entry| {
            let entry_path = entry.path();
            let entry_name = entry.file_name().into_string().expect("Invalid filename");
            let file_type = entry_path.extension().and_then(|ext| ext.to_str()).unwrap_or("unknown").to_string();
            
            // Using unsafe block to call unsafe function
            let mmap = unsafe { 
                MmapOptions::new().map(&fs::File::open(&entry_path).expect("Unable to open file"))
                .expect("Unable to mmap file")
            };

            let _file_content = &mmap[..]; // Just a demo, you can process the content

            FileInfo {
                name: entry_name,
                file_type,
                full_path: entry_path.to_string_lossy().to_string(),
            }
        })
        .collect();

    let subfolders: Vec<FolderInfo> = entries
        .par_iter()
        .filter(|entry| entry.path().is_dir())
        .filter(|entry| {
            let entry_name = entry.file_name().into_string().expect("Invalid filename");
            !skip_dirs.contains(&entry_name.as_str())
        })
        .map(|entry| parse_folder(&entry.path()))
        .collect();

    FolderInfo {
        name: path.file_name().unwrap().to_str().unwrap().to_string(),
        full_path: path.to_string_lossy().to_string(),
        files,
        subfolders,
    }
}

fn main() {
    let folder_path = "C:\\Users\\archways\\Documents\\GitHub\\HiBRYD\\dev".to_string();
    
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

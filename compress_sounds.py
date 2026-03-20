import os
import subprocess

def compress_audio(folder, target_bitrate="32k"):
    for root, dirs, files in os.walk(folder):
        for file in files:
            if file.endswith((".mp3", ".ogg")):
                file_path = os.path.join(root, file)
                # Create temporary file
                temp_file = os.path.join(root, "temp_" + file)
                
                print(f"Compressing {file} to {target_bitrate}...")
                try:
                    # ffmpeg command
                    # -y for overwrite, -ab for audio bitrate
                    subprocess.run([
                        "ffmpeg", "-i", file_path, 
                        "-ab", target_bitrate, 
                        "-map_metadata", "0", 
                        temp_file, "-y"
                    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                    
                    # Check if smaller?
                    original_size = os.path.getsize(file_path)
                    new_size = os.path.getsize(temp_file)
                    
                    if new_size < original_size:
                        os.remove(file_path)
                        os.rename(temp_file, file_path)
                        print(f"Compressed {file}: {original_size/1e6:.1f}MB -> {new_size/1e6:.1f}MB")
                    else:
                        os.remove(temp_file)
                        print(f"Skipped {file} (no reduction)")
                except Exception as e:
                    print(f"Error compressing {file}: {e}")
                    if os.path.exists(temp_file):
                        os.remove(temp_file)

if __name__ == "__main__":
    # Project root
    base_dir = r"d:\gym 2\tap gyp"
    # Exclude node_modules, .git
    for item in os.listdir(base_dir):
        if item in ["node_modules", ".git", "dist", "build"]:
            continue
        full_path = os.path.join(base_dir, item)
        if os.path.isdir(full_path):
            compress_audio(full_path)

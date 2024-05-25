# Save this script as run_all_with_logs.ps1

# Function to start a process in a new PowerShell window
function Start-NewPowerShellWindow {
    param (
        [string]$WorkingDirectory,
        [string]$Command
    )

    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$WorkingDirectory`"; $Command"
}

# Define the path to the virtual environment activation script
$venvPath = ".\venv\Scripts\Activate.ps1"

# Activate the virtual environment
& $venvPath

# Start the Python server
Start-NewPowerShellWindow -WorkingDirectory "server" -Command "python app.py"

# Start the client application
Start-NewPowerShellWindow -WorkingDirectory "client" -Command "npm start"

# Start the dashboard application
Start-NewPowerShellWindow -WorkingDirectory "dashboard" -Command "npm start"

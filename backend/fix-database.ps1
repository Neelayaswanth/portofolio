# PowerShell script to fix missing database columns
# This adds the missing referrer and session_id columns to profile_views table

param(
    [string]$DatabaseUrl = $env:DATABASE_URL
)

if (-not $DatabaseUrl) {
    Write-Host "Error: DATABASE_URL not found in environment or parameters" -ForegroundColor Red
    Write-Host "Usage: .\fix-database.ps1 -DatabaseUrl 'postgresql://user:pass@host:port/db'" -ForegroundColor Yellow
    exit 1
}

Write-Host "Adding missing columns to database..." -ForegroundColor Yellow

# Parse DATABASE_URL
if ($DatabaseUrl -match 'postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)') {
    $username = $matches[1]
    $password = $matches[2]
    $host = $matches[3]
    $port = $matches[4]
    $database = $matches[5]
    
    Write-Host "Connecting to: $host:$port/$database" -ForegroundColor Cyan
    
    # Read the SQL file
    $sqlFile = Join-Path $PSScriptRoot "database\add_missing_columns.sql"
    $sql = Get-Content $sqlFile -Raw
    
    # Set password environment variable
    $env:PGPASSWORD = $password
    
    try {
        # Execute the SQL
        $sql | & psql -h $host -p $port -U $username -d $database
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n✓ Database columns added successfully!" -ForegroundColor Green
        } else {
            Write-Host "`n✗ Error adding columns. Exit code: $LASTEXITCODE" -ForegroundColor Red
            exit $LASTEXITCODE
        }
    } catch {
        Write-Host "`n✗ Error: $_" -ForegroundColor Red
        Write-Host "Make sure psql is installed and in your PATH" -ForegroundColor Yellow
        exit 1
    } finally {
        # Clear password from environment
        Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    }
} else {
    Write-Host "Error: Invalid DATABASE_URL format" -ForegroundColor Red
    Write-Host "Expected format: postgresql://user:pass@host:port/db" -ForegroundColor Yellow
    exit 1
}


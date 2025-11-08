# PowerShell script to run database schema
# Usage: .\run-schema.ps1 -DatabaseName "your_database" -Username "your_username"

param(
    [string]$DatabaseName = "portfolio_db",
    [string]$Username = "postgres",
    [string]$Host = "localhost",
    [int]$Port = 5432
)

$schemaPath = Join-Path $PSScriptRoot "database\schema.sql"

if (-not (Test-Path $schemaPath)) {
    Write-Host "Error: Schema file not found at $schemaPath" -ForegroundColor Red
    exit 1
}

Write-Host "Running schema on database: $DatabaseName" -ForegroundColor Green
Write-Host "Schema file: $schemaPath" -ForegroundColor Yellow

# Read the schema file
$schema = Get-Content $schemaPath -Raw

# Connect to PostgreSQL and execute schema
$env:PGPASSWORD = Read-Host "Enter PostgreSQL password for user '$Username'" -AsSecureString | ConvertFrom-SecureString -AsPlainText

try {
    # Use psql to execute the schema
    $schema | & psql -h $Host -p $Port -U $Username -d $DatabaseName
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✓ Schema executed successfully!" -ForegroundColor Green
    } else {
        Write-Host "`n✗ Error executing schema. Exit code: $LASTEXITCODE" -ForegroundColor Red
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


# PowerShell script to check PostgreSQL connection and create database if needed
# Usage: .\check-db.ps1

param(
    [string]$DatabaseName = "portfolio_db",
    [string]$Username = "postgres",
    [string]$Host = "localhost",
    [int]$Port = 5432
)

Write-Host "Checking PostgreSQL connection..." -ForegroundColor Yellow

# Check if psql is available
try {
    $psqlVersion = & psql --version 2>&1
    Write-Host "✓ psql found: $psqlVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ psql not found. Please install PostgreSQL client tools." -ForegroundColor Red
    Write-Host "  Download from: https://www.postgresql.org/download/" -ForegroundColor Yellow
    exit 1
}

# Get password
$password = Read-Host "Enter PostgreSQL password for user '$Username'" -AsSecureString
$plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
)

$env:PGPASSWORD = $plainPassword

try {
    # Test connection
    Write-Host "`nTesting connection to PostgreSQL server..." -ForegroundColor Yellow
    $testResult = & psql -h $Host -p $Port -U $Username -d postgres -c "SELECT version();" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Connected to PostgreSQL server" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to connect to PostgreSQL server" -ForegroundColor Red
        Write-Host $testResult -ForegroundColor Red
        exit 1
    }
    
    # Check if database exists
    Write-Host "`nChecking if database '$DatabaseName' exists..." -ForegroundColor Yellow
    $dbCheck = & psql -h $Host -p $Port -U $Username -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DatabaseName'" 2>&1
    
    if ($dbCheck -match "1") {
        Write-Host "✓ Database '$DatabaseName' exists" -ForegroundColor Green
    } else {
        Write-Host "Database '$DatabaseName' does not exist. Creating..." -ForegroundColor Yellow
        $createResult = & psql -h $Host -p $Port -U $Username -d postgres -c "CREATE DATABASE $DatabaseName;" 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Database '$DatabaseName' created successfully" -ForegroundColor Green
        } else {
            Write-Host "✗ Failed to create database" -ForegroundColor Red
            Write-Host $createResult -ForegroundColor Red
            exit 1
        }
    }
    
    Write-Host "`n✓ Database setup complete!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "1. Update your .env file with: DATABASE_URL=postgresql://$Username`:password@$Host`:$Port/$DatabaseName" -ForegroundColor Cyan
    Write-Host "2. Run: .\run-schema.ps1 -DatabaseName $DatabaseName -Username $Username" -ForegroundColor Cyan
    Write-Host "3. Or restart your server: npm start" -ForegroundColor Cyan
    
} catch {
    Write-Host "`n✗ Error: $_" -ForegroundColor Red
    exit 1
} finally {
    # Clear password from environment
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}


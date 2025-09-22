@echo off
echo ========================================
echo   Property Website - Neon DB Setup
echo ========================================
echo.
echo This script will help you set up Neon PostgreSQL database.
echo.
echo Follow these steps:
echo.
echo 1. Go to https://neon.tech and create a free account
echo 2. Create a new project
echo 3. Copy your connection string
echo 4. Update your .env file with the DATABASE_URL
echo.
echo Example connection string:
echo postgresql://username:password@ep-xyz.us-east-1.aws.neon.tech/neondb?sslmode=require
echo.
echo ========================================
echo   Environment Setup
echo ========================================
echo.
echo Make sure your .env file contains:
echo DATABASE_URL=your_neon_connection_string_here
echo.
echo Then run: npm run setup
echo.
pause

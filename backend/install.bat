@echo off

REM Copy environment file
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo Please edit .env file with your configuration before running the application.
)

REM Install dependencies
echo Installing dependencies...
npm install

REM Run database setup
echo Setting up database...
npm run setup

echo Setup complete! You can now start the server with 'npm run dev'
pause

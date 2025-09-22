# Copy environment file
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "Please edit .env file with your configuration before running the application."
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Run database setup
echo "Setting up database..."
npm run setup

echo "Setup complete! You can now start the server with 'npm run dev'"

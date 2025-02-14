# Bit Shifters

## Overview
The application contains configuration for a discord bot with a connection to the Codeforces API. Daily coding challenges of varying difficulties will be posted. The application will track scores and maintain a leaderboard of the highest ranking members. 

## Setup
The following environment variables must be set for the application to work
- `MONGODB_URI`: The address for the Mongo Database
- `DISCORD_TOKEN`: The auth token for the discord bot

Run the application with:
```bash
npm run build
npm run start
```

## Commands
| Command | Description |
|---------|-------------|
| `/link <handle>` | Create a link to your codeforces account |
| `/solve` | Verifies whether the user has solved the current challenge and updates their points |
| `/daily` | Fetches and posts the daily coding challenge |
| `/leaderboard` | Displays the current leaderboard |
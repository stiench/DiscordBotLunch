# Lunch Restaurant Discord Bot

A Discord bot that helps teams decide where to eat lunch based on restaurant preferences and who's in the office that day.

## Features

- **Smart Restaurant Selection**: Finds the best restaurant based on who likes what
- **Slash Commands**: Easy-to-use Discord slash commands
- **Dynamic Preferences**: Add/modify/remove restaurant preferences on the fly
- **Person Management**: Add/remove people from specific restaurants or all restaurants
- **Restaurant Management**: Add/remove entire restaurants
- **Scoring System**: Shows how many people like each restaurant
- **Tie Handling**: Handles cases where multiple restaurants have equal scores
- **Data Persistence**: Saves changes automatically

## Commands

### `/lunch [people]`
Decides where to eat lunch based on who's in the office.
- **people**: Comma-separated list of people in the office today
- Example: `/lunch Alice, Bob, Charlie`

### `/restaurants`
Shows all restaurants and who likes them.

### `/add-restaurant [name] [people]`
Adds a new restaurant with preferences.
- **name**: Restaurant name
- **people**: Comma-separated list of people who like this restaurant
- Example: `/add-restaurant Taco Tuesday Alice, Bob`

### `/remove-restaurant [name]`
Removes a restaurant completely.
- **name**: Restaurant name to remove
- Example: `/remove-restaurant Pizza Palace`

### `/add-person [person] [restaurant]`
Adds a person to a restaurant's preferences.
- **person**: Person name to add
- **restaurant**: Restaurant name
- Example: `/add-person John Pizza Palace`

### `/remove-person [person] [restaurant]`
Removes a person from restaurant preferences.
- **person**: Person name to remove
- **restaurant**: Restaurant to remove from (optional - leave empty to remove from all)
- Examples: 
  - `/remove-person Alice Pizza Palace` (remove from specific restaurant)
  - `/remove-person Alice` (remove from all restaurants)

### `/people`
Shows all people and their restaurant preferences.

## Setup

### Prerequisites
- Node.js 18.0.0 or higher
- A Discord application and bot token

### Discord Bot Setup
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to the "Bot" section and create a bot
4. Copy the bot token
5. Go to "OAuth2" > "URL Generator"
6. Select "bot" and "applications.commands" scopes
7. Select necessary permissions (Send Messages, Use Slash Commands)
8. Use the generated URL to invite the bot to your server

### Installation
1. Clone/download this project
2. Run `npm install` to install dependencies
3. Copy `.env.example` to `.env`
4. Add your Discord bot token and client ID to `.env`:
   ```
   DISCORD_TOKEN=your_discord_bot_token_here
   CLIENT_ID=your_discord_application_client_id_here
   ```
5. Run `npm start` to start the bot

### Development
- Run `npm run dev` for development mode with auto-reload
- The bot will automatically register slash commands when it starts

## How It Works

The bot uses a simple scoring system:
1. For each restaurant, it counts how many people in the office like it
2. The restaurant(s) with the highest score win
3. In case of ties, all tied restaurants are shown as options

### Example
If Alice, Bob, and Charlie are in the office:
- Pizza Palace: liked by Alice and Bob (score: 2/3 = 67%)
- Sushi Spot: liked by Alice (score: 1/3 = 33%)
- Burger Bar: liked by Bob and Charlie (score: 2/3 = 67%)

Result: Tie between Pizza Palace and Burger Bar

## Default Restaurants

The bot comes with these default restaurants and preferences:
- **Pizza Palace**: Alice, Bob, Charlie
- **Sushi Spot**: Alice, Diana, Eve
- **Burger Bar**: Bob, Charlie, Frank
- **Healthy Bites**: Diana, Eve, Grace
- **Mexican Cantina**: Charlie, Frank, Grace

## File Structure

```
src/
├── index.js              # Main bot file
└── utils/
    ├── restaurantSelector.js  # Restaurant selection logic
    └── dataManager.js         # Data persistence utilities
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License

require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
const { RestaurantSelector } = require('./utils/restaurantSelector');
const { DataManager } = require('./utils/dataManager');

// Initialize data manager
const dataManager = new DataManager();

// Restaurant data with preferences
let restaurants = {
    "Pizza Palace": ["Alice", "Bob", "Charlie"],
    "Sushi Spot": ["Alice", "Diana", "Eve"],
    "Burger Bar": ["Bob", "Charlie", "Frank"],
    "Healthy Bites": ["Diana", "Eve", "Grace"],
    "Mexican Cantina": ["Charlie", "Frank", "Grace"]
};

// Initialize restaurant selector
let restaurantSelector = new RestaurantSelector(restaurants);

// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Load saved data on startup
client.once('ready', async () => {
    console.log(`🤖 Bot is ready! Logged in as ${client.user.tag}`);
    
    // Load restaurants from file
    try {
        const savedRestaurants = await dataManager.loadRestaurants();
        restaurantSelector = new RestaurantSelector(savedRestaurants);
        console.log(`📊 Loaded ${Object.keys(savedRestaurants).length} restaurants`);
    } catch (error) {
        console.log('⚠️ Using default restaurant data');
    }
});

// Slash command setup
const commands = [
    new SlashCommandBuilder()
        .setName('lunch')
        .setDescription('Decide where to eat lunch based on who is in the office')
        .addStringOption(option =>
            option.setName('people')
                .setDescription('List of people in the office today (comma separated)')
                .setRequired(true)
        ),
    
    new SlashCommandBuilder()
        .setName('restaurants')
        .setDescription('Show all restaurants and who likes them'),
    
    new SlashCommandBuilder()
        .setName('add-restaurant')
        .setDescription('Add a new restaurant with preferences')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Restaurant name')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('people')
                .setDescription('People who like this restaurant (comma separated)')
                .setRequired(true)
        ),
    
    new SlashCommandBuilder()
        .setName('remove-restaurant')
        .setDescription('Remove a restaurant completely')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Restaurant name to remove')
                .setRequired(true)
        ),
    
    new SlashCommandBuilder()
        .setName('remove-person')
        .setDescription('Remove a person from restaurant preferences')
        .addStringOption(option =>
            option.setName('person')
                .setDescription('Person name to remove')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('restaurant')
                .setDescription('Restaurant to remove from (leave empty to remove from all)')
                .setRequired(false)
        ),
    
    new SlashCommandBuilder()
        .setName('add-person')
        .setDescription('Add a person to a restaurant\'s preferences')
        .addStringOption(option =>
            option.setName('person')
                .setDescription('Person name to add')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('restaurant')
                .setDescription('Restaurant name')
                .setRequired(true)
        ),
    
    new SlashCommandBuilder()
        .setName('people')
        .setDescription('Show all people and their restaurant preferences')
];

// Function to find best restaurant
function findBestRestaurant(peopleInOffice) {
    const scores = {};
    
    for (const [restaurant, likers] of Object.entries(restaurants)) {
        // Count how many people in office like this restaurant
        const matches = likers.filter(person => peopleInOffice.includes(person));
        scores[restaurant] = {
            score: matches.length,
            matches: matches,
            total: peopleInOffice.length
        };
    }
    
    // Find restaurant(s) with highest score
    const maxScore = Math.max(...Object.values(scores).map(s => s.score));
    const bestRestaurants = Object.entries(scores)
        .filter(([, data]) => data.score === maxScore)
        .map(([name, data]) => ({ name, ...data }));
    
    return { bestRestaurants, allScores: scores };
}

client.once('ready', () => {
    console.log(`🤖 Bot is ready! Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'lunch') {
        const peopleInput = interaction.options.getString('people');
        const peopleInOffice = peopleInput.split(',').map(p => p.trim());
        
        const bestRestaurants = restaurantSelector.findBestByMajority(peopleInOffice);
        const allScores = restaurantSelector.getSortedRestaurants(peopleInOffice);
        
        if (bestRestaurants.length === 0) {
            await interaction.reply('❌ No restaurants found for the people in office today!');
            return;
        }
        
        let response = `🍽️ **Lunch Decision for ${peopleInOffice.length} people:**\n\n`;
        
        if (bestRestaurants.length === 1) {
            const best = bestRestaurants[0];
            response += `🏆 **Winner: ${best.name}**\n`;
            response += `👥 Liked by ${best.score}/${best.total} people: ${best.matches.join(', ')}\n\n`;
        } else {
            response += `🤝 **Tie between ${bestRestaurants.length} restaurants:**\n`;
            bestRestaurants.forEach(restaurant => {
                response += `• **${restaurant.name}** (${restaurant.score}/${restaurant.total} people: ${restaurant.matches.join(', ')})\n`;
            });
            response += '\n';
        }
        
        // Show all scores
        response += '📊 **All Restaurant Scores:**\n';
        allScores.forEach(({ name, score, total, percentage }) => {
            response += `• ${name}: ${score}/${total} (${percentage}%)\n`;
        });
        
        await interaction.reply(response);
    }
    
    else if (commandName === 'restaurants') {
        let response = '🍽️ **Restaurant Preferences:**\n\n';
        
        const allRestaurants = restaurantSelector.getAllRestaurants();
        Object.entries(allRestaurants).forEach(([restaurant, people]) => {
            response += `**${restaurant}**\n`;
            response += `👥 Liked by: ${people.join(', ')}\n\n`;
        });
        
        await interaction.reply(response);
    }
    
    else if (commandName === 'add-restaurant') {
        const name = interaction.options.getString('name');
        const peopleInput = interaction.options.getString('people');
        const people = peopleInput.split(',').map(p => p.trim());
        
        restaurantSelector.addRestaurant(name, people);
        await dataManager.saveRestaurants(restaurantSelector.getAllRestaurants());
        
        await interaction.reply(`✅ Added **${name}** with preferences from: ${people.join(', ')}`);
    }
    
    else if (commandName === 'remove-restaurant') {
        const name = interaction.options.getString('name');
        
        if (restaurantSelector.removeRestaurant(name)) {
            await dataManager.saveRestaurants(restaurantSelector.getAllRestaurants());
            await interaction.reply(`✅ Removed restaurant **${name}**`);
        } else {
            await interaction.reply(`❌ Restaurant **${name}** not found`);
        }
    }
    
    else if (commandName === 'remove-person') {
        const person = interaction.options.getString('person');
        const restaurant = interaction.options.getString('restaurant');
        
        if (restaurant) {
            // Remove from specific restaurant
            if (restaurantSelector.removePersonFromRestaurant(restaurant, person)) {
                await dataManager.saveRestaurants(restaurantSelector.getAllRestaurants());
                await interaction.reply(`✅ Removed **${person}** from **${restaurant}**`);
            } else {
                await interaction.reply(`❌ **${person}** not found in **${restaurant}** or restaurant doesn't exist`);
            }
        } else {
            // Remove from all restaurants
            const removedFrom = restaurantSelector.removePersonFromAll(person);
            if (removedFrom.length > 0) {
                await dataManager.saveRestaurants(restaurantSelector.getAllRestaurants());
                await interaction.reply(`✅ Removed **${person}** from: ${removedFrom.join(', ')}`);
            } else {
                await interaction.reply(`❌ **${person}** not found in any restaurant preferences`);
            }
        }
    }
    
    else if (commandName === 'add-person') {
        const person = interaction.options.getString('person');
        const restaurant = interaction.options.getString('restaurant');
        
        if (restaurantSelector.addPersonToRestaurant(restaurant, person)) {
            await dataManager.saveRestaurants(restaurantSelector.getAllRestaurants());
            await interaction.reply(`✅ Added **${person}** to **${restaurant}**`);
        } else {
            const allRestaurants = restaurantSelector.getAllRestaurants();
            if (!allRestaurants[restaurant]) {
                await interaction.reply(`❌ Restaurant **${restaurant}** doesn't exist`);
            } else {
                await interaction.reply(`❌ **${person}** is already in **${restaurant}**'s preferences`);
            }
        }
    }
    
    else if (commandName === 'people') {
        const allPeople = restaurantSelector.getAllPeople();
        
        if (allPeople.length === 0) {
            await interaction.reply('❌ No people found in restaurant preferences');
            return;
        }
        
        let response = '👥 **People and their Restaurant Preferences:**\n\n';
        
        allPeople.forEach(person => {
            const likedRestaurants = restaurantSelector.getRestaurantsForPerson(person);
            response += `**${person}**\n`;
            response += `🍽️ Likes: ${likedRestaurants.join(', ')}\n\n`;
        });
        
        await interaction.reply(response);
    }
});

// Register slash commands
async function registerCommands() {
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);
    
    try {
        console.log('🔄 Started refreshing application (/) commands.');
        
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        
        console.log('✅ Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('❌ Error registering commands:', error);
    }
}

// Start bot
client.login(process.env.DISCORD_TOKEN).then(() => {
    registerCommands();
});

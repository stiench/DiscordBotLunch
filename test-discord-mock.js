// Mock Discord bot testing - simulates slash commands without actual Discord
const { RestaurantSelector } = require('./src/utils/restaurantSelector');

// Mock Discord interaction
class MockInteraction {
    constructor(commandName, options = {}) {
        this.commandName = commandName;
        this.options = options;
        this.replies = [];
    }
    
    isChatInputCommand() { return true; }
    
    getCommandName() { return this.commandName; }
    
    getString(name) { return this.options[name]; }
    
    async reply(message) {
        this.replies.push(message);
        console.log(`🤖 Bot Reply:\n${message}\n`);
    }
}

// Simulate bot logic
async function simulateBot() {
    console.log('🎭 Simulating Discord Bot Commands\n');
    
    const restaurants = {
        "Pizza Palace": ["Alice", "Bob", "Charlie"],
        "Sushi Spot": ["Alice", "Diana", "Eve"],
        "Burger Bar": ["Bob", "Charlie", "Frank"],
        "Healthy Bites": ["Diana", "Eve", "Grace"],
        "Mexican Cantina": ["Charlie", "Frank", "Grace"]
    };
    
    const selector = new RestaurantSelector(restaurants);
    
    // Simulate /lunch command
    console.log('👤 User: /lunch Alice, Bob, Charlie');
    const lunchInteraction = new MockInteraction('lunch', { people: 'Alice, Bob, Charlie' });
    
    // Bot logic (simplified from main bot)
    const peopleInput = lunchInteraction.getString('people');
    const peopleInOffice = peopleInput.split(',').map(p => p.trim());
    const bestRestaurants = selector.findBestByMajority(peopleInOffice);
    const allScores = selector.getSortedRestaurants(peopleInOffice);
    
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
    
    response += '📊 **All Restaurant Scores:**\n';
    allScores.forEach(({ name, score, total, percentage }) => {
        response += `• ${name}: ${score}/${total} (${percentage}%)\n`;
    });
    
    await lunchInteraction.reply(response);
    
    // Simulate /restaurants command
    console.log('👤 User: /restaurants');
    const restaurantsInteraction = new MockInteraction('restaurants');
    
    let restaurantsResponse = '🍽️ **Restaurant Preferences:**\n\n';
    Object.entries(restaurants).forEach(([restaurant, people]) => {
        restaurantsResponse += `**${restaurant}**\n👥 Liked by: ${people.join(', ')}\n\n`;
    });
    
    await restaurantsInteraction.reply(restaurantsResponse);
    
    // Simulate /add-restaurant command
    console.log('👤 User: /add-restaurant Taco Bell Bob, Frank');
    const addInteraction = new MockInteraction('add-restaurant', { 
        name: 'Taco Bell', 
        people: 'Bob, Frank' 
    });
    
    const name = addInteraction.getString('name');
    const newPeopleInput = addInteraction.getString('people');
    const newPeople = newPeopleInput.split(',').map(p => p.trim());
    
    selector.addRestaurant(name, newPeople);
    await addInteraction.reply(`✅ Added **${name}** with preferences from: ${newPeople.join(', ')}`);
    
    console.log('🎉 Mock Discord bot testing complete!');
}

simulateBot().catch(console.error);

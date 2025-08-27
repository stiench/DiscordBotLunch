// Local testing script for restaurant selection logic
const { RestaurantSelector } = require('./src/utils/restaurantSelector');

// Test data
const testRestaurants = {
    "Pizza Palace": ["Alice", "Bob", "Charlie"],
    "Sushi Spot": ["Alice", "Diana", "Eve"],
    "Burger Bar": ["Bob", "Charlie", "Frank"],
    "Healthy Bites": ["Diana", "Eve", "Grace"],
    "Mexican Cantina": ["Charlie", "Frank", "Grace"]
};

const selector = new RestaurantSelector(testRestaurants);

console.log('🧪 Testing Restaurant Selection Logic\n');

// Test case 1: Small group
console.log('📋 Test 1: Alice, Bob in office');
const test1 = selector.findBestByMajority(['Alice', 'Bob']);
console.log('Winners:', test1.map(r => `${r.name} (${r.score}/${r.total})`));

// Test case 2: Larger group
console.log('\n📋 Test 2: Alice, Charlie, Diana in office');
const test2 = selector.findBestByMajority(['Alice', 'Charlie', 'Diana']);
console.log('Winners:', test2.map(r => `${r.name} (${r.score}/${r.total})`));

// Test case 3: Show all scores
console.log('\n📋 Test 3: All restaurant scores for Alice, Bob, Charlie');
const scores = selector.getSortedRestaurants(['Alice', 'Bob', 'Charlie']);
scores.forEach(r => {
    console.log(`• ${r.name}: ${r.score}/${r.total} (${r.percentage}%) - Liked by: ${r.matches.join(', ')}`);
});

// Test case 4: No matches
console.log('\n📋 Test 4: Person not in any preferences');
const test4 = selector.findBestByMajority(['Unknown']);
console.log('Winners:', test4.length > 0 ? test4.map(r => r.name) : 'No restaurants found');

console.log('\n✅ Core logic testing complete!');

// Test removal functionality
const { RestaurantSelector } = require('./src/utils/restaurantSelector');

console.log('🗑️ Testing Restaurant and Person Removal\n');

// Create test data
const restaurants = {
    "Pizza Palace": ["Alice", "Bob", "Charlie"],
    "Sushi Spot": ["Alice", "Diana", "Eve"],
    "Burger Bar": ["Bob", "Charlie", "Frank"],
    "Healthy Bites": ["Diana", "Eve", "Grace"]
};

const selector = new RestaurantSelector(restaurants);

console.log('📋 Initial restaurants:');
Object.entries(selector.getAllRestaurants()).forEach(([name, people]) => {
    console.log(`• ${name}: ${people.join(', ')}`);
});

console.log('\n👥 Initial people:', selector.getAllPeople().join(', '));

console.log('\n🧪 Testing removal functions...\n');

// Test 1: Remove person from specific restaurant
console.log('1️⃣ Remove Alice from Pizza Palace');
const removed1 = selector.removePersonFromRestaurant('Pizza Palace', 'Alice');
console.log(`Result: ${removed1 ? 'Success' : 'Failed'}`);
console.log(`Pizza Palace now: ${selector.getAllRestaurants()['Pizza Palace'].join(', ')}`);

// Test 2: Remove person from all restaurants
console.log('\n2️⃣ Remove Charlie from all restaurants');
const removedFrom = selector.removePersonFromAll('Charlie');
console.log(`Removed from: ${removedFrom.join(', ')}`);

// Test 3: Add person to restaurant
console.log('\n3️⃣ Add John to Sushi Spot');
const added = selector.addPersonToRestaurant('Sushi Spot', 'John');
console.log(`Result: ${added ? 'Success' : 'Failed'}`);
console.log(`Sushi Spot now: ${selector.getAllRestaurants()['Sushi Spot'].join(', ')}`);

// Test 4: Remove entire restaurant
console.log('\n4️⃣ Remove Healthy Bites restaurant');
const removedRestaurant = selector.removeRestaurant('Healthy Bites');
console.log(`Result: ${removedRestaurant ? 'Success' : 'Failed'}`);

// Test 5: Show person's preferences
console.log('\n5️⃣ Diana\'s restaurant preferences:');
const dianaRestaurants = selector.getRestaurantsForPerson('Diana');
console.log(`• ${dianaRestaurants.join(', ')}`);

console.log('\n📋 Final state:');
console.log('Restaurants:');
Object.entries(selector.getAllRestaurants()).forEach(([name, people]) => {
    console.log(`• ${name}: ${people.join(', ')}`);
});

console.log('\nPeople:', selector.getAllPeople().join(', '));

console.log('\n✅ Removal testing complete!');

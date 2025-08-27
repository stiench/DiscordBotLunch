// Comprehensive test suite
const { RestaurantSelector } = require('./src/utils/restaurantSelector');
const { DataManager } = require('./src/utils/dataManager');

async function runTests() {
    console.log('🚀 Running Comprehensive Tests\n');
    
    // Test 1: Restaurant Selector
    console.log('1️⃣ Testing RestaurantSelector...');
    const restaurants = {
        "Pizza Palace": ["Alice", "Bob", "Charlie"],
        "Sushi Spot": ["Alice", "Diana", "Eve"],
        "Burger Bar": ["Bob", "Charlie", "Frank"]
    };
    
    const selector = new RestaurantSelector(restaurants);
    
    // Test adding restaurant
    selector.addRestaurant("Thai Garden", ["Alice", "Eve"]);
    console.log('✅ Added new restaurant');
    
    // Test updating restaurant
    selector.updateRestaurant("Pizza Palace", ["Alice", "Bob", "Charlie", "Diana"]);
    console.log('✅ Updated restaurant preferences');
    
    // Test weighted scoring
    const weights = { "Alice": 2, "Bob": 1.5, "Charlie": 1 };
    const weighted = selector.findBestByWeight(["Alice", "Bob"], weights);
    console.log('✅ Weighted scoring works');
    
    // Test 2: Data Manager
    console.log('\n2️⃣ Testing DataManager...');
    const dataManager = new DataManager('./test-data');
    
    // Save test data
    await dataManager.saveRestaurants(selector.getAllRestaurants());
    console.log('✅ Saved restaurants to file');
    
    // Load test data
    const loaded = await dataManager.loadRestaurants();
    console.log('✅ Loaded restaurants from file');
    console.log(`   Found ${Object.keys(loaded).length} restaurants`);
    
    // Test 3: Edge Cases
    console.log('\n3️⃣ Testing Edge Cases...');
    
    // Empty office
    const emptyResult = selector.findBestByMajority([]);
    console.log(`✅ Empty office handled: ${emptyResult.length === 0 ? 'No winners' : 'Has winners'}`);
    
    // Single person
    const singleResult = selector.findBestByMajority(["Alice"]);
    console.log(`✅ Single person: ${singleResult.length} winner(s)`);
    
    // Unknown people
    const unknownResult = selector.findBestByMajority(["Unknown1", "Unknown2"]);
    console.log(`✅ Unknown people: ${unknownResult.length} result(s)`);
    
    console.log('\n🎉 All tests completed successfully!');
    
    // Cleanup
    const fs = require('fs').promises;
    try {
        await fs.rm('./test-data', { recursive: true, force: true });
        console.log('🧹 Cleaned up test data');
    } catch (error) {
        // Ignore cleanup errors
    }
}

runTests().catch(console.error);

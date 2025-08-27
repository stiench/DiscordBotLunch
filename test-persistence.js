// Test complete persistence workflow including bot behavior
const { RestaurantSelector } = require('./src/utils/restaurantSelector');
const { DataManager } = require('./src/utils/dataManager');

async function testCompletePersistence() {
    console.log('💾 Testing Complete Persistence Workflow\n');
    
    const dataManager = new DataManager('./data');
    
    console.log('1️⃣ Creating initial restaurant data...');
    const initialData = {
        "Pizza Palace": ["Alice", "Bob", "Charlie"],
        "Sushi Spot": ["Alice", "Diana"],
        "Burger Bar": ["Bob", "Charlie"]
    };
    
    let selector = new RestaurantSelector(initialData);
    await dataManager.saveRestaurants(selector.getAllRestaurants());
    console.log('✅ Initial data saved');
    
    console.log('\n2️⃣ Simulating bot restart - loading data from file...');
    const loadedData = await dataManager.loadRestaurants();
    selector = new RestaurantSelector(loadedData);
    console.log(`✅ Loaded ${Object.keys(loadedData).length} restaurants`);
    
    console.log('\n3️⃣ Making changes (add restaurant)...');
    selector.addRestaurant('Taco Bell', ['Eve', 'Frank']);
    await dataManager.saveRestaurants(selector.getAllRestaurants());
    console.log('✅ Added restaurant and saved');
    
    console.log('\n4️⃣ Making changes (remove person)...');
    selector.removePersonFromRestaurant('Pizza Palace', 'Alice');
    await dataManager.saveRestaurants(selector.getAllRestaurants());
    console.log('✅ Removed person and saved');
    
    console.log('\n5️⃣ Simulating another bot restart...');
    const finalData = await dataManager.loadRestaurants();
    const newSelector = new RestaurantSelector(finalData);
    
    console.log('\n📊 Final persisted state:');
    Object.entries(newSelector.getAllRestaurants()).forEach(([name, people]) => {
        console.log(`• ${name}: ${people.join(', ')}`);
    });
    
    // Verify changes persisted
    const pizzaPalace = finalData['Pizza Palace'];
    const hasTacoBell = finalData['Taco Bell'];
    const aliceInPizza = pizzaPalace && pizzaPalace.includes('Alice');
    
    console.log('\n🔍 Verification:');
    console.log(`• Taco Bell exists: ${hasTacoBell ? '✅' : '❌'}`);
    console.log(`• Alice removed from Pizza Palace: ${!aliceInPizza ? '✅' : '❌'}`);
    console.log(`• Data file location: ${require('path').resolve('./data/restaurants.json')}`);
    
    console.log('\n🎉 Persistence test complete!');
}

testCompletePersistence().catch(console.error);

// Data persistence utilities
const fs = require('fs').promises;
const path = require('path');

class DataManager {
    constructor(dataDir = './data') {
        this.dataDir = dataDir;
        this.restaurantFile = path.join(dataDir, 'restaurants.json');
    }

    async ensureDataDir() {
        try {
            await fs.mkdir(this.dataDir, { recursive: true });
        } catch (error) {
            console.error('Error creating data directory:', error);
        }
    }

    async saveRestaurants(restaurants) {
        try {
            await this.ensureDataDir();
            const data = JSON.stringify(restaurants, null, 2);
            await fs.writeFile(this.restaurantFile, data, 'utf8');
            return true;
        } catch (error) {
            console.error('Error saving restaurants:', error);
            return false;
        }
    }

    async loadRestaurants() {
        try {
            const data = await fs.readFile(this.restaurantFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            // Return default restaurants if file doesn't exist
            return {
                "Pizza Palace": ["Alice", "Bob", "Charlie"],
                "Sushi Spot": ["Alice", "Diana", "Eve"],
                "Burger Bar": ["Bob", "Charlie", "Frank"],
                "Healthy Bites": ["Diana", "Eve", "Grace"],
                "Mexican Cantina": ["Charlie", "Frank", "Grace"]
            };
        }
    }

    async backupRestaurants() {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFile = path.join(this.dataDir, `restaurants-backup-${timestamp}.json`);
            
            const restaurants = await this.loadRestaurants();
            const data = JSON.stringify(restaurants, null, 2);
            await fs.writeFile(backupFile, data, 'utf8');
            
            console.log(`Backup created: ${backupFile}`);
            return backupFile;
        } catch (error) {
            console.error('Error creating backup:', error);
            return null;
        }
    }
}

module.exports = { DataManager };

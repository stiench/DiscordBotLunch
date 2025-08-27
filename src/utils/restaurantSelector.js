// Restaurant selection algorithms and utilities

class RestaurantSelector {
    constructor(restaurants) {
        this.restaurants = restaurants;
    }

    // Find best restaurant based on simple majority
    findBestByMajority(peopleInOffice) {
        const scores = this.calculateScores(peopleInOffice);
        const maxScore = Math.max(...Object.values(scores).map(s => s.score));
        
        return Object.entries(scores)
            .filter(([, data]) => data.score === maxScore)
            .map(([name, data]) => ({ name, ...data }));
    }

    // Find best restaurant with weighted scoring
    findBestByWeight(peopleInOffice, weights = {}) {
        const scores = {};
        
        for (const [restaurant, likers] of Object.entries(this.restaurants)) {
            let weightedScore = 0;
            const matches = [];
            
            for (const person of peopleInOffice) {
                if (likers.includes(person)) {
                    const weight = weights[person] || 1;
                    weightedScore += weight;
                    matches.push(person);
                }
            }
            
            scores[restaurant] = {
                score: weightedScore,
                matches: matches,
                total: peopleInOffice.length
            };
        }
        
        const maxScore = Math.max(...Object.values(scores).map(s => s.score));
        return Object.entries(scores)
            .filter(([, data]) => data.score === maxScore)
            .map(([name, data]) => ({ name, ...data }));
    }

    // Calculate basic scores for all restaurants
    calculateScores(peopleInOffice) {
        const scores = {};
        
        for (const [restaurant, likers] of Object.entries(this.restaurants)) {
            const matches = likers.filter(person => peopleInOffice.includes(person));
            scores[restaurant] = {
                score: matches.length,
                matches: matches,
                total: peopleInOffice.length,
                percentage: peopleInOffice.length > 0 ? Math.round((matches.length / peopleInOffice.length) * 100) : 0
            };
        }
        
        return scores;
    }

    // Get restaurants sorted by preference
    getSortedRestaurants(peopleInOffice) {
        const scores = this.calculateScores(peopleInOffice);
        
        return Object.entries(scores)
            .sort(([,a], [,b]) => b.score - a.score)
            .map(([name, data]) => ({ name, ...data }));
    }

    // Add new restaurant
    addRestaurant(name, likers) {
        this.restaurants[name] = likers;
    }

    // Remove restaurant
    removeRestaurant(name) {
        if (this.restaurants[name]) {
            delete this.restaurants[name];
            return true;
        }
        return false;
    }

    // Update restaurant preferences
    updateRestaurant(name, likers) {
        if (this.restaurants[name]) {
            this.restaurants[name] = likers;
            return true;
        }
        return false;
    }

    // Remove person from a specific restaurant
    removePersonFromRestaurant(restaurantName, personName) {
        if (this.restaurants[restaurantName]) {
            const index = this.restaurants[restaurantName].indexOf(personName);
            if (index > -1) {
                this.restaurants[restaurantName].splice(index, 1);
                return true;
            }
        }
        return false;
    }

    // Remove person from all restaurants
    removePersonFromAll(personName) {
        let removedFrom = [];
        
        for (const [restaurantName, likers] of Object.entries(this.restaurants)) {
            const index = likers.indexOf(personName);
            if (index > -1) {
                likers.splice(index, 1);
                removedFrom.push(restaurantName);
            }
        }
        
        return removedFrom;
    }

    // Add person to a restaurant
    addPersonToRestaurant(restaurantName, personName) {
        if (this.restaurants[restaurantName]) {
            if (!this.restaurants[restaurantName].includes(personName)) {
                this.restaurants[restaurantName].push(personName);
                return true;
            }
        }
        return false;
    }

    // Get all people mentioned in preferences
    getAllPeople() {
        const people = new Set();
        Object.values(this.restaurants).forEach(likers => {
            likers.forEach(person => people.add(person));
        });
        return Array.from(people).sort();
    }

    // Get restaurants a person likes
    getRestaurantsForPerson(personName) {
        return Object.entries(this.restaurants)
            .filter(([, likers]) => likers.includes(personName))
            .map(([name]) => name);
    }

    // Get all restaurants
    getAllRestaurants() {
        return { ...this.restaurants };
    }
}

module.exports = { RestaurantSelector };

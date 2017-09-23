var SCRIPTED_ORDERS = [
    {
        spawnTime: 3000, // How far into the game does this order spawn?
        timeLimit: 60000, // How long does the player have to fulfill this order?
        temperature: CoffeeCup.Temp.HOT,
        cup: CoffeeCup.Type.GLASS,
        price: 1 // How much will the score be increased
    },
    {
        spawnTime: 30000,
        timeLimit: 55000,
        temperature: CoffeeCup.Temp.COLD,
        cup: CoffeeCup.Type.PAPER,
        price: 1
    }
];

var BETWEEN_TIME = 20000; // Amount of time between scripted orders and randomly spawned orders

var SPAWN_SPECS = [
    {
        duration: 60000, // how long does this level of intensity last?
        spawnRate: { // The range of time in between each order spawn
            min: 20000,
            max: 30000
        },
        timeLimit: 50000, // The time limit for the orders in this difficulty
        price: 2, // Score increase
        break_machine: true // probability that the machine will break sometime during this difficulty
    },
    {
        duration: 40000,
        spawnRate: {
            min: 15000,
            max: 25000
        },
        timeLimit: 40000,
        price: 4,
        break_machine: false
    },
    {
        duration: 30000,
        spawnRate: {
            min: 15000,
            max: 20000
        },
        timeLimit: 30000,
        price: 6,
        break_machine: true
    }
];
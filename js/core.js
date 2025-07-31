// SBURB.PRIME Core Engine
class SburbCore {
    constructor() {
        this.gameState = {
            player: {
                name: null,
                classpect: null,
                lunarSway: null,
                hp: 100,
                maxHp: 100,
                level: 1,
                experience: 0,
                inventory: [],
                strife: {
                    specibus: null,
                    modus: null
                },
                location: null,
                echoes: []
            },
            session: {
                active: false,
                id: null,
                players: [],
                lands: [],
                events: [],
                actNumber: 0,
                timeStamp: null
            },
            world: {
                currentLand: null,
                availableLands: [],
                metaLocations: {
                    office: false,
                    grey: false
                }
            },
            narrative: {
                commandHistory: [],
                bookOfNumbers: [],
                currentNarrative: "",
                seeds: []
            },
            settings: {
                autoSave: true,
                narrativeLength: 'medium',
                echoLimit: 10
            }
        };
        
        this.saveKey = 'sburb_prime_save';
        this.initialized = false;
        
        // Event system
        this.eventListeners = {};
        
        this.init();
    }
    
    init() {
        console.log('Initializing SBURB.PRIME Core...');
        this.loadGame();
        this.setupAutoSave();
        this.initialized = true;
        this.emit('core:initialized');
    }
    
    // Event System
    on(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }
    
    emit(event, data = null) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }
    
    // Save/Load System
    saveGame() {
        try {
            const saveData = {
                ...this.gameState,
                timestamp: Date.now(),
                version: '2.0.1'
            };
            
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            this.emit('game:saved', saveData);
            console.log('Game saved successfully');
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            this.emit('game:save_failed', error);
            return false;
        }
    }
    
    loadGame() {
        try {
            const savedData = localStorage.getItem(this.saveKey);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                
                // Validate save version compatibility
                if (this.isCompatibleSave(parsedData)) {
                    this.gameState = { ...this.gameState, ...parsedData };
                    this.emit('game:loaded', parsedData);
                    console.log('Game loaded successfully');
                    return true;
                } else {
                    console.warn('Save file incompatible, starting fresh');
                    this.resetGame();
                }
            } else {
                console.log('No save file found, starting fresh');
            }
        } catch (error) {
            console.error('Failed to load game:', error);
            this.emit('game:load_failed', error);
            this.resetGame();
        }
        return false;
    }
    
    isCompatibleSave(saveData) {
        // Simple version check - in production, implement more sophisticated migration
        return saveData.version && saveData.version.startsWith('2.');
    }
    
    resetGame() {
        // Reset to default state but preserve settings
        const settings = { ...this.gameState.settings };
        this.gameState = {
            player: {
                name: null,
                classpect: null,
                lunarSway: null,
                hp: 100,
                maxHp: 100,
                level: 1,
                experience: 0,
                inventory: [],
                strife: {
                    specibus: null,
                    modus: null
                },
                location: null,
                echoes: []
            },
            session: {
                active: false,
                id: null,
                players: [],
                lands: [],
                events: [],
                actNumber: 0,
                timeStamp: null
            },
            world: {
                currentLand: null,
                availableLands: [],
                metaLocations: {
                    office: false,
                    grey: false
                }
            },
            narrative: {
                commandHistory: [],
                bookOfNumbers: [],
                currentNarrative: "",
                seeds: []
            },
            settings: settings
        };
        
        this.emit('game:reset');
        this.saveGame();
    }
    
    setupAutoSave() {
        if (this.gameState.settings.autoSave) {
            setInterval(() => {
                this.saveGame();
            }, 30000); // Auto-save every 30 seconds
        }
    }
    
    // Game State Accessors
    getPlayer() {
        return this.gameState.player;
    }
    
    getSession() {
        return this.gameState.session;
    }
    
    getWorld() {
        return this.gameState.world;
    }
    
    getNarrative() {
        return this.gameState.narrative;
    }
    
    // Player Management
    setPlayerName(name) {
        this.gameState.player.name = name;
        this.emit('player:name_set', name);
        this.saveGame();
    }
    
    setPlayerClasspect(classpect) {
        this.gameState.player.classpect = classpect;
        this.emit('player:classpect_set', classpect);
        this.saveGame();
    }
    
    setPlayerLunarSway(sway) {
        this.gameState.player.lunarSway = sway;
        this.emit('player:lunar_sway_set', sway);
        this.saveGame();
    }
    
    // Session Management
    startSession() {
        this.gameState.session.active = true;
        this.gameState.session.id = this.generateSessionId();
        this.gameState.session.timeStamp = Date.now();
        this.gameState.session.actNumber = 1;
        
        this.emit('session:started', this.gameState.session);
        this.saveGame();
    }
    
    generateSessionId() {
        // Generate a unique session ID based on timestamp and random elements
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `S${timestamp}${random}`.toUpperCase();
    }
    
    // Command History
    addCommand(command, response) {
        const entry = {
            command: command,
            response: response,
            timestamp: Date.now(),
            act: this.gameState.session.actNumber
        };
        
        this.gameState.narrative.commandHistory.push(entry);
        
        // Keep only last 1000 commands to prevent memory issues
        if (this.gameState.narrative.commandHistory.length > 1000) {
            this.gameState.narrative.commandHistory.shift();
        }
        
        this.emit('command:logged', entry);
    }
    
    // Book of Numbers Entry
    addBookEntry(title, content, type = 'event') {
        const entry = {
            id: Date.now(),
            title: title,
            content: content,
            type: type,
            timestamp: Date.now(),
            act: this.gameState.session.actNumber
        };
        
        this.gameState.narrative.bookOfNumbers.push(entry);
        this.emit('book:entry_added', entry);
        this.saveGame();
    }
    
    // Utility Functions
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    formatTimestamp(timestamp) {
        return new Date(timestamp).toLocaleString();
    }
    
    // Debug Functions
    debug() {
        return {
            gameState: this.gameState,
            initialized: this.initialized,
            saveKey: this.saveKey
        };
    }
    
    exportSave() {
        const saveData = {
            ...this.gameState,
            timestamp: Date.now(),
            version: '2.0.1'
        };
        
        const dataStr = JSON.stringify(saveData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `sburb_prime_save_${Date.now()}.json`;
        link.click();
    }
}

// Initialize global core instance
window.sburbCore = new SburbCore();
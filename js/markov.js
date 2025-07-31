// L.A.S.T. Markov Engine - Language Analysis and Synthesis Technology
class MarkovEngine {
    constructor() {
        this.chains = new Map();
        this.hussieCodex = new Map();
        this.narrativeSeeds = [];
        this.contextMemory = [];
        this.maxContextLength = 50;
        this.initialized = false;
        
        this.init();
    }
    
    async init() {
        console.log('Initializing L.A.S.T. Markov Engine...');
        await this.loadHussieCodex();
        await this.loadNarrativeSeeds();
        this.initialized = true;
        sburbCore.emit('markov:initialized');
    }
    
    async loadHussieCodex() {
        // Hussie Codex - Core narrative patterns and responses
        const codexData = {
            greetings: [
                "well well well, looks like we got ourselves another player",
                "ah, another soul ready to dance with paradox space",
                "welcome to the grand performance, player",
                "the stage is set, the curtain rises, and you've got front row seats"
            ],
            
            confirmations: [
                "understood, player",
                "got it, moving forward with the plan",
                "roger that, initiating sequence",
                "acknowledged, the wheels are in motion"
            ],
            
            mysteries: [
                "curious and curiouser, the plot thickens",
                "ah, but that would be telling, wouldn't it?",
                "some secrets are meant to unfold in their own time",
                "the answer lies deeper in the rabbit hole"
            ],
            
            warnings: [
                "careful now, some paths can't be retraced",
                "tread lightly, player, paradox space is watching",
                "that's dangerous territory you're entering",
                "proceed with caution, the consequences ripple outward"
            ],
            
            encouragements: [
                "you're getting the hang of this cosmic dance",
                "excellent work, the narrative flows through you",
                "your choices shape the very fabric of this reality",
                "the story bends to your will, as it should"
            ],
            
            transitions: [
                "meanwhile, in another corner of paradox space",
                "but that's not all that's happening",
                "simultaneously, events unfold elsewhere",
                "the timeline branches and converges"
            ],
            
            classpectDescriptions: {
                "Knight": "one who serves through {aspect} or serves {aspect} to others",
                "Page": "one who provides {aspect} through service to others",
                "Maid": "one who creates {aspect} or creates through {aspect}",
                "Sylph": "one who heals with {aspect} or heals {aspect}",
                "Seer": "one who knows {aspect} or knows through {aspect}",
                "Mage": "one who understands {aspect} through experience",
                "Heir": "one who inherits {aspect} or inherits through {aspect}",
                "Witch": "one who manipulates {aspect} or manipulates through {aspect}",
                "Prince": "one who destroys {aspect} or destroys through {aspect}",
                "Bard": "one who allows destruction of {aspect} or destruction through {aspect}",
                "Thief": "one who steals {aspect} or steals through {aspect}",
                "Rogue": "one who redistributes {aspect} or redistributes through {aspect}"
            },
            
            aspects: [
                "Time", "Space", "Light", "Void", "Life", "Doom",
                "Blood", "Breath", "Heart", "Mind", "Hope", "Rage"
            ],
            
            lunarSways: ["Prospit", "Derse"],
            
            landThemes: [
                "Clockwork and Melody", "Frost and Frogs", "Heat and Clockwork",
                "Light and Rain", "Wind and Shade", "Pulse and Haze",
                "Crypts and Helium", "Brains and Fire", "Little Cubes and Tea",
                "Rays and Frogs", "Thought and Flow", "Maps and Treasure"
            ]
        };
        
        // Build Markov chains from codex data
        Object.entries(codexData).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                this.buildChain(key, value);
            } else if (typeof value === 'object') {
                this.hussieCodex.set(key, value);
            }
        });
    }
    
    async loadNarrativeSeeds() {
        // Narrative seeds for procedural story generation
        this.narrativeSeeds = [
            {
                type: 'entry',
                weight: 10,
                template: 'The {player} stands before the {object}, {feeling} about what comes next. The {atmosphere} seems to {action} around them.',
                variables: {
                    player: ['young hero', 'destined child', 'chosen one', 'brave soul'],
                    object: ['glowing portal', 'mysterious device', 'ancient artifact', 'swirling vortex'],
                    feeling: ['uncertain', 'excited', 'apprehensive', 'determined'],
                    atmosphere: ['air itself', 'very fabric of reality', 'space around them', 'energy in the room'],
                    action: ['shimmer', 'pulse', 'vibrate', 'hum with potential']
                }
            },
            {
                type: 'discovery',
                weight: 8,
                template: 'In the {location}, something {adjective} catches your attention. It\'s {description}, and it seems to {behavior}.',
                variables: {
                    location: ['shadowy corner', 'distant alcove', 'hidden chamber', 'forgotten passage'],
                    adjective: ['peculiar', 'otherworldly', 'familiar yet strange', 'impossibly ancient'],
                    description: ['covered in strange symbols', 'glowing with inner light', 'shifting between dimensions', 'whispering secrets'],
                    behavior: ['beckon to you', 'pulse with energy', 'fade in and out of existence', 'respond to your presence']
                }
            },
            {
                type: 'conflict',
                weight: 6,
                template: 'The {enemy} {approaches} with {intent}. Your {instinct} tells you to {action}, but {complication}.',
                variables: {
                    enemy: ['shadowy figure', 'mechanical construct', 'twisted reflection', 'temporal anomaly'],
                    approaches: ['advances menacingly', 'materializes suddenly', 'phases into reality', 'emerges from the void'],
                    intent: ['malicious purpose', 'unknown agenda', 'chaotic energy', 'calculated precision'],
                    instinct: ['training', 'intuition', 'classpect powers', 'survival instinct'],
                    action: ['fight', 'flee', 'negotiate', 'hide'],
                    complication: ['the environment shifts around you', 'time seems to slow', 'reality becomes unstable', 'echoes of other timelines interfere']
                }
            }
        ];
    }
    
    buildChain(key, texts) {
        const chain = new Map();
        
        texts.forEach(text => {
            const words = text.toLowerCase().split(/\s+/);
            
            for (let i = 0; i < words.length - 1; i++) {
                const currentWord = words[i];
                const nextWord = words[i + 1];
                
                if (!chain.has(currentWord)) {
                    chain.set(currentWord, []);
                }
                chain.get(currentWord).push(nextWord);
            }
        });
        
        this.chains.set(key, chain);
    }
    
    generateFromChain(chainKey, maxLength = 20) {
        const chain = this.chains.get(chainKey);
        if (!chain) return "the narrative flows in mysterious ways";
        
        const startWords = Array.from(chain.keys());
        let currentWord = startWords[Math.floor(Math.random() * startWords.length)];
        let result = [currentWord];
        
        for (let i = 0; i < maxLength - 1; i++) {
            const nextWords = chain.get(currentWord);
            if (!nextWords || nextWords.length === 0) break;
            
            currentWord = nextWords[Math.floor(Math.random() * nextWords.length)];
            result.push(currentWord);
        }
        
        return result.join(' ');
    }
    
    generateNarrative(context = '', type = 'general', length = 'medium') {
        this.addToContext(context);
        
        let narrative = '';
        const lengthMap = { short: 1, medium: 2, long: 3 };
        const sentences = lengthMap[length] || 2;
        
        // Use context to influence generation
        const relevantSeeds = this.narrativeSeeds.filter(seed => 
            !type || type === 'general' || seed.type === type
        );
        
        for (let i = 0; i < sentences; i++) {
            if (relevantSeeds.length > 0 && Math.random() < 0.7) {
                // Use template-based generation
                const seed = this.weightedRandom(relevantSeeds);
                narrative += this.fillTemplate(seed.template, seed.variables) + ' ';
            } else {
                // Use Markov chain generation
                const chainKeys = Array.from(this.chains.keys());
                const randomChain = chainKeys[Math.floor(Math.random() * chainKeys.length)];
                narrative += this.generateFromChain(randomChain, 15) + '. ';
            }
        }
        
        return this.postProcess(narrative.trim());
    }
    
    fillTemplate(template, variables) {
        let result = template;
        
        Object.entries(variables).forEach(([key, options]) => {
            const placeholder = `{${key}}`;
            if (result.includes(placeholder)) {
                const choice = options[Math.floor(Math.random() * options.length)];
                result = result.replace(new RegExp(placeholder, 'g'), choice);
            }
        });
        
        return result;
    }
    
    weightedRandom(items) {
        const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
        let random = Math.random() * totalWeight;
        
        for (const item of items) {
            random -= (item.weight || 1);
            if (random <= 0) return item;
        }
        
        return items[items.length - 1];
    }
    
    generateClasspect() {
        const classes = Object.keys(this.hussieCodex.get('classpectDescriptions'));
        const aspects = this.hussieCodex.get('aspects');
        
        const selectedClass = classes[Math.floor(Math.random() * classes.length)];
        const selectedAspect = aspects[Math.floor(Math.random() * aspects.length)];
        
        const description = this.hussieCodex.get('classpectDescriptions')[selectedClass]
            .replace(/{aspect}/g, selectedAspect);
        
        return {
            class: selectedClass,
            aspect: selectedAspect,
            full: `${selectedClass} of ${selectedAspect}`,
            description: description
        };
    }
    
    generateLunarSway() {
        const sways = this.hussieCodex.get('lunarSways');
        return sways[Math.floor(Math.random() * sways.length)];
    }
    
    generateLandName() {
        const themes = this.hussieCodex.get('landThemes');
        const theme = themes[Math.floor(Math.random() * themes.length)];
        return `Land of ${theme}`;
    }
    
    addToContext(text) {
        if (text && text.trim()) {
            this.contextMemory.push(text.trim());
            
            if (this.contextMemory.length > this.maxContextLength) {
                this.contextMemory.shift();
            }
        }
    }
    
    getContextualResponse(input, type = 'general') {
        // Analyze input for keywords and generate contextual response
        const keywords = input.toLowerCase().split(/\s+/);
        let responseType = 'confirmations';
        
        if (keywords.some(word => ['help', 'what', 'how', '?'].includes(word))) {
            responseType = 'mysteries';
        } else if (keywords.some(word => ['danger', 'careful', 'warning'].includes(word))) {
            responseType = 'warnings';
        } else if (keywords.some(word => ['good', 'great', 'excellent', 'success'].includes(word))) {
            responseType = 'encouragements';
        }
        
        return this.generateFromChain(responseType, 25);
    }
    
    postProcess(text) {
        // Clean up and enhance generated text
        let processed = text
            .replace(/\s+/g, ' ')
            .replace(/([.!?])\s*([a-z])/g, (match, punct, letter) => punct + ' ' + letter.toUpperCase())
            .trim();
        
        // Ensure first letter is capitalized
        if (processed.length > 0) {
            processed = processed.charAt(0).toUpperCase() + processed.slice(1);
        }
        
        // Ensure it ends with punctuation
        if (processed.length > 0 && !/[.!?]$/.test(processed)) {
            processed += '.';
        }
        
        return processed;
    }
    
    // Debug and utility functions
    getChainKeys() {
        return Array.from(this.chains.keys());
    }
    
    getContextMemory() {
        return [...this.contextMemory];
    }
    
    clearContext() {
        this.contextMemory = [];
    }
}

// Initialize global Markov engine
window.markovEngine = new MarkovEngine();
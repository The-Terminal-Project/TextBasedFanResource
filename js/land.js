// Land Generation System - Procedural Land Creation with ASCII Maps
class LandSystem {
    constructor() {
        this.lands = new Map();
        this.currentLand = null;
        this.landTemplates = [];
        this.consortSpecies = [];
        this.initialized = false;
        
        this.init();
    }
    
    async init() {
        console.log('Initializing Land Generation System...');
        await this.loadLandTemplates();
        await this.loadConsortSpecies();
        this.initialized = true;
        sburbCore.emit('land:initialized');
    }
    
    async loadLandTemplates() {
        // Land templates based on Homestuck patterns
        this.landTemplates = [
            {
                id: 'clockwork_melody',
                name: 'Clockwork and Melody',
                themes: ['time', 'music', 'mechanical'],
                description: 'A realm where intricate clockwork mechanisms create haunting melodies',
                terrain: ['gears', 'pipes', 'towers', 'springs'],
                hazards: ['temporal_loops', 'discordant_notes', 'grinding_gears'],
                resources: ['clockwork_parts', 'tuning_forks', 'temporal_crystals'],
                questType: 'temporal_harmony'
            },
            {
                id: 'frost_frogs',
                name: 'Frost and Frogs',
                themes: ['cold', 'amphibian', 'winter'],
                description: 'A frozen landscape populated by hardy amphibian creatures',
                terrain: ['ice_caves', 'frozen_ponds', 'crystal_formations', 'snow_drifts'],
                hazards: ['blizzards', 'thin_ice', 'frost_bite'],
                resources: ['ice_crystals', 'frog_essence', 'winter_herbs'],
                questType: 'amphibian_awakening'
            },
            {
                id: 'heat_clockwork',
                name: 'Heat and Clockwork',
                themes: ['fire', 'mechanical', 'industry'],
                description: 'A sweltering industrial realm of steam and precision',
                terrain: ['steam_vents', 'gear_forests', 'molten_rivers', 'brass_spires'],
                hazards: ['steam_bursts', 'molten_metal', 'overheating'],
                resources: ['brass_gears', 'steam_essence', 'heat_crystals'],
                questType: 'industrial_mastery'
            },
            {
                id: 'light_rain',
                name: 'Light and Rain',
                themes: ['illumination', 'water', 'reflection'],
                description: 'A realm where eternal rain creates prismatic light displays',
                terrain: ['crystal_pools', 'rainbow_bridges', 'light_towers', 'rain_forests'],
                hazards: ['blinding_light', 'flash_floods', 'prismatic_confusion'],
                resources: ['light_crystals', 'rain_essence', 'prism_shards'],
                questType: 'luminous_cleansing'
            },
            {
                id: 'wind_shade',
                name: 'Wind and Shade',
                themes: ['air', 'darkness', 'movement'],
                description: 'A shadowy realm swept by eternal winds',
                terrain: ['shadow_valleys', 'wind_tunnels', 'dark_peaks', 'whisper_caves'],
                hazards: ['shadow_storms', 'cutting_winds', 'void_pockets'],
                resources: ['wind_essence', 'shadow_silk', 'void_fragments'],
                questType: 'umbral_mastery'
            },
            {
                id: 'pulse_haze',
                name: 'Pulse and Haze',
                themes: ['rhythm', 'obscurity', 'life'],
                description: 'A misty realm that pulses with the rhythm of life',
                terrain: ['mist_valleys', 'pulse_chambers', 'rhythm_caves', 'haze_lakes'],
                hazards: ['disorienting_mist', 'pulse_overload', 'rhythm_traps'],
                resources: ['pulse_crystals', 'mist_essence', 'rhythm_stones'],
                questType: 'vital_synchronization'
            }
        ];
    }
    
    async loadConsortSpecies() {
        this.consortSpecies = [
            {
                name: 'Salamanders',
                description: 'Wise, fire-resistant lizards with ancient knowledge',
                habitat: ['heat', 'fire', 'desert'],
                personality: 'wise',
                helpfulness: 'high',
                specialties: ['fire_magic', 'ancient_lore', 'crafting']
            },
            {
                name: 'Turtles',
                description: 'Patient, methodical shelled creatures',
                habitat: ['water', 'earth', 'slow'],
                personality: 'patient',
                helpfulness: 'medium',
                specialties: ['defense', 'patience', 'stability']
            },
            {
                name: 'Iguanas',
                description: 'Proud, territorial reptiles with strong opinions',
                habitat: ['warm', 'rocky', 'sunny'],
                personality: 'proud',
                helpfulness: 'low',
                specialties: ['territory_knowledge', 'combat', 'intimidation']
            },
            {
                name: 'Crocodiles',
                description: 'Ancient, powerful predators with deep wisdom',
                habitat: ['water', 'swamp', 'ancient'],
                personality: 'ancient',
                helpfulness: 'variable',
                specialties: ['ancient_wisdom', 'power', 'survival']
            },
            {
                name: 'Rabbits',
                description: 'Quick, nervous creatures with keen senses',
                habitat: ['grass', 'burrows', 'quick'],
                personality: 'nervous',
                helpfulness: 'high',
                specialties: ['speed', 'senses', 'escape_routes']
            },
            {
                name: 'Cats',
                description: 'Independent, mysterious felines with hidden agendas',
                habitat: ['anywhere', 'mysterious', 'independent'],
                personality: 'mysterious',
                helpfulness: 'unpredictable',
                specialties: ['stealth', 'mystery', 'independence']
            }
        ];
    }
    
    // Land Generation
    generateLand(playerData = null) {
        const landId = sburbCore.generateId();
        let template;
        
        if (playerData && playerData.hobbies && playerData.dreams) {
            // Generate based on player's interests
            template = this.selectTemplateByInterests(playerData);
        } else {
            // Random generation
            template = this.landTemplates[Math.floor(Math.random() * this.landTemplates.length)];
        }
        
        const land = this.createLandFromTemplate(landId, template, playerData);
        this.lands.set(landId, land);
        
        sburbCore.emit('land:generated', land);
        return land;
    }
    
    selectTemplateByInterests(playerData) {
        // Analyze player interests to select appropriate template
        const interests = [...(playerData.hobbies || []), ...(playerData.dreams || [])];
        const interestKeywords = interests.join(' ').toLowerCase();
        
        let bestMatch = this.landTemplates[0];
        let bestScore = 0;
        
        for (const template of this.landTemplates) {
            let score = 0;
            
            // Check theme matches
            for (const theme of template.themes) {
                if (interestKeywords.includes(theme)) {
                    score += 3;
                }
            }
            
            // Check terrain matches
            for (const terrain of template.terrain) {
                if (interestKeywords.includes(terrain.replace('_', ' '))) {
                    score += 1;
                }
            }
            
            if (score > bestScore) {
                bestScore = score;
                bestMatch = template;
            }
        }
        
        return bestMatch;
    }
    
    createLandFromTemplate(landId, template, playerData) {
        // Select appropriate consorts
        const consorts = this.selectConsorts(template);
        
        // Generate ASCII map
        const asciiMap = this.generateASCIIMap(template);
        
        // Create quest
        const quest = this.generateQuest(template, consorts);
        
        // Generate denizen
        const denizen = this.generateDenizen(template);
        
        const land = {
            id: landId,
            name: `Land of ${template.name}`,
            template: template.id,
            themes: [...template.themes],
            description: template.description,
            terrain: [...template.terrain],
            hazards: [...template.hazards],
            resources: [...template.resources],
            consorts: consorts,
            quest: quest,
            denizen: denizen,
            asciiMap: asciiMap,
            explored: {
                areas: ['entry_point'],
                percentage: 5
            },
            events: [],
            timestamp: Date.now()
        };
        
        return land;
    }
    
    selectConsorts(template) {
        // Select consorts based on template themes and habitat compatibility
        const compatibleConsorts = this.consortSpecies.filter(species => {
            return species.habitat.some(habitat => 
                template.themes.some(theme => 
                    habitat.includes(theme) || theme.includes(habitat)
                )
            );
        });
        
        if (compatibleConsorts.length === 0) {
            // Fallback to random consort
            return [this.consortSpecies[Math.floor(Math.random() * this.consortSpecies.length)]];
        }
        
        // Select 1-2 consort species
        const numConsorts = Math.random() > 0.7 ? 2 : 1;
        const selectedConsorts = [];
        
        for (let i = 0; i < numConsorts && i < compatibleConsorts.length; i++) {
            const consort = compatibleConsorts.splice(
                Math.floor(Math.random() * compatibleConsorts.length), 1
            )[0];
            selectedConsorts.push(consort);
        }
        
        return selectedConsorts;
    }
    
    generateASCIIMap(template) {
        // Generate a simple ASCII map based on terrain types
        const mapWidth = 40;
        const mapHeight = 20;
        const map = [];
        
        // Initialize with base terrain
        for (let y = 0; y < mapHeight; y++) {
            map[y] = [];
            for (let x = 0; x < mapWidth; x++) {
                map[y][x] = '.';
            }
        }
        
        // Add terrain features based on template
        this.addTerrainFeatures(map, template, mapWidth, mapHeight);
        
        // Add entry point
        map[mapHeight - 2][mapWidth / 2] = '@';
        
        // Convert to string
        return map.map(row => row.join('')).join('\n');
    }
    
    addTerrainFeatures(map, template, width, height) {
        const terrainSymbols = {
            'gears': '⚙',
            'pipes': '|',
            'towers': '♠',
            'springs': '~',
            'ice_caves': '◊',
            'frozen_ponds': '○',
            'crystal_formations': '◆',
            'snow_drifts': '^',
            'steam_vents': '≈',
            'gear_forests': '♣',
            'molten_rivers': '≋',
            'brass_spires': '▲',
            'crystal_pools': '◯',
            'rainbow_bridges': '=',
            'light_towers': '†',
            'rain_forests': '♠',
            'shadow_valleys': 'v',
            'wind_tunnels': ')',
            'dark_peaks': '▲',
            'whisper_caves': '(',
            'mist_valleys': '~',
            'pulse_chambers': '□',
            'rhythm_caves': '◊',
            'haze_lakes': '○'
        };
        
        // Place terrain features randomly but logically
        for (const terrain of template.terrain) {
            const symbol = terrainSymbols[terrain] || '#';
            const numFeatures = Math.floor(Math.random() * 5) + 3;
            
            for (let i = 0; i < numFeatures; i++) {
                const x = Math.floor(Math.random() * width);
                const y = Math.floor(Math.random() * height);
                
                if (map[y] && map[y][x] === '.') {
                    map[y][x] = symbol;
                }
            }
        }
        
        // Add paths connecting features
        this.addPaths(map, width, height);
    }
    
    addPaths(map, width, height) {
        // Simple path generation - connect some features
        const pathSymbol = '-';
        
        // Horizontal paths
        for (let i = 0; i < 3; i++) {
            const y = Math.floor(Math.random() * height);
            const startX = Math.floor(Math.random() * (width / 3));
            const endX = startX + Math.floor(Math.random() * (width / 2)) + 5;
            
            for (let x = startX; x < Math.min(endX, width); x++) {
                if (map[y] && map[y][x] === '.') {
                    map[y][x] = pathSymbol;
                }
            }
        }
        
        // Vertical paths
        for (let i = 0; i < 2; i++) {
            const x = Math.floor(Math.random() * width);
            const startY = Math.floor(Math.random() * (height / 3));
            const endY = startY + Math.floor(Math.random() * (height / 2)) + 3;
            
            for (let y = startY; y < Math.min(endY, height); y++) {
                if (map[y] && map[y][x] === '.') {
                    map[y][x] = '|';
                }
            }
        }
    }
    
    generateQuest(template, consorts) {
        const questTemplates = {
            'temporal_harmony': {
                title: 'Synchronize the Clockwork Symphony',
                description: 'The great clockwork mechanisms have fallen out of sync, creating discordant melodies that threaten reality.',
                objectives: [
                    'Find the Master Conductor\'s Baton',
                    'Repair the Primary Harmonic Gear',
                    'Conduct the Symphony of Time'
                ]
            },
            'amphibian_awakening': {
                title: 'Awaken the Frozen Chorus',
                description: 'The ancient frog chorus sleeps beneath the ice, and their song is needed to bring warmth back to the land.',
                objectives: [
                    'Gather the Thawing Crystals',
                    'Locate the Hibernation Chamber',
                    'Perform the Awakening Ritual'
                ]
            },
            'industrial_mastery': {
                title: 'Master the Great Engine',
                description: 'The colossal steam engine that powers the land has gone haywire, threatening to overheat reality itself.',
                objectives: [
                    'Acquire the Master\'s Wrench',
                    'Cool the Primary Boiler',
                    'Calibrate the Pressure Valves'
                ]
            },
            'luminous_cleansing': {
                title: 'Purify the Light Prisms',
                description: 'Dark corruption has tainted the great prisms, turning the beautiful light displays into chaotic storms.',
                objectives: [
                    'Collect Pure Rain Essence',
                    'Cleanse the Central Prism',
                    'Restore the Rainbow Network'
                ]
            },
            'umbral_mastery': {
                title: 'Tame the Shadow Winds',
                description: 'The eternal winds carry shadows that devour light and hope. They must be calmed.',
                objectives: [
                    'Find the Wind Caller\'s Horn',
                    'Navigate the Shadow Maze',
                    'Bind the Storm King'
                ]
            },
            'vital_synchronization': {
                title: 'Harmonize the Life Pulse',
                description: 'The rhythmic pulse that sustains all life in the land has become erratic and chaotic.',
                objectives: [
                    'Locate the Heart Chamber',
                    'Gather Rhythm Stones',
                    'Perform the Great Synchronization'
                ]
            }
        };
        
        const questTemplate = questTemplates[template.questType] || questTemplates['temporal_harmony'];
        
        return {
            ...questTemplate,
            progress: 0,
            completed: false,
            consortAdvice: this.generateConsortAdvice(consorts, questTemplate)
        };
    }
    
    generateConsortAdvice(consorts, quest) {
        const advice = [];
        
        for (const consort of consorts) {
            const tips = [
                `The ${consort.name} suggest: "${quest.description.toLowerCase()} requires ${consort.specialties[0]}."`
            ];
            
            if (consort.helpfulness === 'high') {
                tips.push(`They offer to help with ${quest.objectives[0].toLowerCase()}.`);
            } else if (consort.helpfulness === 'medium') {
                tips.push(`They might help if you prove yourself worthy.`);
            } else {
                tips.push(`They seem uninterested in helping directly.`);
            }
            
            advice.push({
                species: consort.name,
                tips: tips
            });
        }
        
        return advice;
    }
    
    generateDenizen(template) {
        const denizenNames = {
            'clockwork_melody': 'Chronos the Eternal Conductor',
            'frost_frogs': 'Boreas the Winter King',
            'heat_clockwork': 'Vulcan the Forge Master',
            'light_rain': 'Iris the Prism Keeper',
            'wind_shade': 'Nyx the Shadow Weaver',
            'pulse_haze': 'Gaia the Life Binder'
        };
        
        const name = denizenNames[template.id] || 'The Ancient Guardian';
        
        return {
            name: name,
            description: `The powerful denizen who rules over the ${template.name}`,
            encountered: false,
            defeated: false,
            choice: null, // Player's choice when meeting the denizen
            power: Math.floor(Math.random() * 5) + 8
        };
    }
    
    // Land Interaction
    setCurrentLand(landId) {
        const land = this.lands.get(landId);
        if (land) {
            this.currentLand = land;
            sburbCore.getWorld().currentLand = landId;
            sburbCore.emit('land:current_changed', land);
            sburbCore.saveGame();
            return true;
        }
        return false;
    }
    
    exploreLand(landId, area = 'random') {
        const land = this.lands.get(landId);
        if (!land) return null;
        
        // Generate exploration result
        const explorationResult = this.generateExplorationResult(land, area);
        
        // Update land exploration progress
        if (!land.explored.areas.includes(explorationResult.area)) {
            land.explored.areas.push(explorationResult.area);
            land.explored.percentage = Math.min(100, 
                (land.explored.areas.length / 20) * 100
            );
        }
        
        // Add event to land history
        land.events.push({
            type: 'exploration',
            area: explorationResult.area,
            result: explorationResult,
            timestamp: Date.now()
        });
        
        sburbCore.emit('land:explored', { land, result: explorationResult });
        sburbCore.saveGame();
        
        return explorationResult;
    }
    
    generateExplorationResult(land, targetArea) {
        const areas = [
            'crystal_caverns', 'ancient_ruins', 'hidden_grove', 'mysterious_structure',
            'consort_village', 'resource_deposit', 'puzzle_chamber', 'scenic_overlook',
            'dangerous_territory', 'quest_location'
        ];
        
        const area = targetArea === 'random' ? 
            areas[Math.floor(Math.random() * areas.length)] : targetArea;
        
        const discoveries = [
            'valuable_resource', 'quest_item', 'consort_settlement', 'ancient_artifact',
            'hidden_passage', 'puzzle_mechanism', 'lore_fragment', 'nothing_special'
        ];
        
        const discovery = discoveries[Math.floor(Math.random() * discoveries.length)];
        
        // Generate narrative based on land themes and discovery
        const narrative = this.generateExplorationNarrative(land, area, discovery);
        
        return {
            area: area,
            discovery: discovery,
            narrative: narrative,
            resources: discovery === 'valuable_resource' ? 
                [land.resources[Math.floor(Math.random() * land.resources.length)]] : [],
            experience: Math.floor(Math.random() * 20) + 10
        };
    }
    
    generateExplorationNarrative(land, area, discovery) {
        const context = `exploring ${area} in ${land.name}, discovering ${discovery}`;
        const baseNarrative = markovEngine.generateNarrative(context, 'discovery', 'medium');
        
        // Add land-specific flavor
        const themeDescriptor = land.themes[Math.floor(Math.random() * land.themes.length)];
        const terrainFeature = land.terrain[Math.floor(Math.random() * land.terrain.length)];
        
        return `${baseNarrative} The ${themeDescriptor} essence of this place is evident in the ${terrainFeature.replace('_', ' ')} around you.`;
    }
    
    // Utility Functions
    getCurrentLand() {
        return this.currentLand;
    }
    
    getAllLands() {
        return Array.from(this.lands.values());
    }
    
    getLandById(id) {
        return this.lands.get(id);
    }
    
    getLandsByTheme(theme) {
        return Array.from(this.lands.values()).filter(land => 
            land.themes.includes(theme)
        );
    }
    
    getExplorationProgress(landId) {
        const land = this.lands.get(landId);
        return land ? land.explored : null;
    }
    
    // ASCII Map Utilities
    getMapSection(landId, centerX = 20, centerY = 10, radius = 10) {
        const land = this.lands.get(landId);
        if (!land || !land.asciiMap) return null;
        
        const lines = land.asciiMap.split('\n');
        const section = [];
        
        for (let y = Math.max(0, centerY - radius); 
             y < Math.min(lines.length, centerY + radius); y++) {
            if (lines[y]) {
                const line = lines[y].substring(
                    Math.max(0, centerX - radius),
                    Math.min(lines[y].length, centerX + radius)
                );
                section.push(line);
            }
        }
        
        return section.join('\n');
    }
    
    updateMapLocation(landId, x, y, symbol) {
        const land = this.lands.get(landId);
        if (!land || !land.asciiMap) return false;
        
        const lines = land.asciiMap.split('\n');
        if (y >= 0 && y < lines.length && x >= 0 && x < lines[y].length) {
            const line = lines[y];
            lines[y] = line.substring(0, x) + symbol + line.substring(x + 1);
            land.asciiMap = lines.join('\n');
            return true;
        }
        
        return false;
    }
}

// Initialize global Land system
window.landSystem = new LandSystem();
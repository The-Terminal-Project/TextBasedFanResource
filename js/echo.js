// Echo System - Manages Core, Fan, and Developer Echoes
class EchoSystem {
    constructor() {
        this.echoes = new Map();
        this.activeEchoes = [];
        this.echoCallFiles = new Map();
        this.maxActiveEchoes = 10;
        this.initialized = false;
        
        this.echoTypes = {
            CORE: 'core',
            FAN: 'fan',
            DEVELOPER: 'developer',
            TEMPORAL: 'temporal',
            PARADOX: 'paradox'
        };
        
        this.init();
    }
    
    async init() {
        console.log('Initializing Echo System...');
        await this.loadCoreEchoes();
        await this.loadEchoCallFiles();
        this.initialized = true;
        sburbCore.emit('echo:initialized');
    }
    
    async loadCoreEchoes() {
        // Core Echoes - Fundamental game mechanics
        const coreEchoes = [
            {
                id: 'echo_alchemize',
                name: 'Alchemical Synthesis',
                type: this.echoTypes.CORE,
                classpectAffinity: ['Maid', 'Sylph'],
                description: 'Combine items through alchemical processes',
                power: 3,
                cooldown: 0,
                commands: ['alchemize', 'combine', 'synthesize'],
                effect: this.createAlchemizeEffect()
            },
            {
                id: 'echo_strife',
                name: 'Strife Engagement',
                type: this.echoTypes.CORE,
                classpectAffinity: ['Knight', 'Prince'],
                description: 'Enter combat with hostile entities',
                power: 5,
                cooldown: 2,
                commands: ['fight', 'attack', 'strife'],
                effect: this.createStrifeEffect()
            },
            {
                id: 'echo_explore',
                name: 'Dimensional Exploration',
                type: this.echoTypes.CORE,
                classpectAffinity: ['Seer', 'Heir'],
                description: 'Explore new areas and discover secrets',
                power: 2,
                cooldown: 1,
                commands: ['explore', 'search', 'investigate'],
                effect: this.createExploreEffect()
            },
            {
                id: 'echo_prototype',
                name: 'Sprite Prototyping',
                type: this.echoTypes.CORE,
                classpectAffinity: ['Page', 'Maid'],
                description: 'Prototype kernelsprites with objects or beings',
                power: 8,
                cooldown: 0,
                commands: ['prototype', 'sprite'],
                effect: this.createPrototypeEffect()
            },
            {
                id: 'echo_time_travel',
                name: 'Temporal Manipulation',
                type: this.echoTypes.TEMPORAL,
                classpectAffinity: ['Time'],
                description: 'Manipulate the flow of time and causality',
                power: 10,
                cooldown: 5,
                commands: ['time', 'temporal', 'loop'],
                effect: this.createTimeEffect()
            },
            {
                id: 'echo_space_warp',
                name: 'Spatial Distortion',
                type: this.echoTypes.TEMPORAL,
                classpectAffinity: ['Space'],
                description: 'Bend space and create portals',
                power: 9,
                cooldown: 4,
                commands: ['warp', 'portal', 'space'],
                effect: this.createSpaceEffect()
            }
        ];
        
        coreEchoes.forEach(echo => {
            this.echoes.set(echo.id, echo);
        });
    }
    
    async loadEchoCallFiles() {
        // Echo Call Files - Command-triggered special abilities
        const callFiles = [
            {
                command: 'echo_cascade',
                name: 'Cascade Protocol',
                description: 'Trigger a reality-altering cascade event',
                requirements: ['Time', 'Space'],
                effect: this.createCascadeEffect()
            },
            {
                command: 'echo_scratch',
                name: 'Scratch Sequence',
                description: 'Reset the session timeline',
                requirements: ['Doom', 'Time'],
                effect: this.createScratchEffect()
            },
            {
                command: 'echo_god_tier',
                name: 'God Tier Ascension',
                description: 'Achieve conditional immortality',
                requirements: ['Heroic', 'Just'],
                effect: this.createGodTierEffect()
            }
        ];
        
        callFiles.forEach(callFile => {
            this.echoCallFiles.set(callFile.command, callFile);
        });
    }
    
    // Echo Generation
    generateEcho(type = 'random', classpect = null) {
        const echoId = sburbCore.generateId();
        let echo;
        
        switch (type) {
            case 'fan':
                echo = this.generateFanEcho(echoId, classpect);
                break;
            case 'developer':
                echo = this.generateDeveloperEcho(echoId);
                break;
            case 'temporal':
                echo = this.generateTemporalEcho(echoId);
                break;
            default:
                echo = this.generateRandomEcho(echoId, classpect);
        }
        
        this.echoes.set(echoId, echo);
        sburbCore.emit('echo:generated', echo);
        return echo;
    }
    
    generateFanEcho(id, classpect) {
        const fanEchoTemplates = [
            {
                name: 'Narrative Intervention',
                description: 'Directly influence story outcomes',
                power: Math.floor(Math.random() * 5) + 3,
                commands: ['intervene', 'narrate', 'story']
            },
            {
                name: 'Character Summon',
                description: 'Summon aspects of beloved characters',
                power: Math.floor(Math.random() * 4) + 4,
                commands: ['summon', 'invoke', 'channel']
            },
            {
                name: 'Meme Reality',
                description: 'Make fan theories temporarily real',
                power: Math.floor(Math.random() * 6) + 2,
                commands: ['meme', 'theory', 'canon']
            }
        ];
        
        const template = fanEchoTemplates[Math.floor(Math.random() * fanEchoTemplates.length)];
        
        return {
            id: id,
            name: template.name,
            type: this.echoTypes.FAN,
            classpectAffinity: classpect ? [classpect.class, classpect.aspect] : [],
            description: template.description,
            power: template.power,
            cooldown: Math.floor(template.power / 2),
            commands: template.commands,
            effect: this.createGenericEchoEffect(template.name),
            fanGenerated: true,
            timestamp: Date.now()
        };
    }
    
    generateDeveloperEcho(id) {
        const devEchoes = [
            {
                name: 'Debug Console',
                description: 'Access developer debugging tools',
                power: 1,
                commands: ['debug', 'console', 'dev'],
                effect: this.createDebugEffect()
            },
            {
                name: 'State Manipulation',
                description: 'Directly modify game state variables',
                power: 10,
                commands: ['set', 'modify', 'state'],
                effect: this.createStateEffect()
            },
            {
                name: 'Narrative Override',
                description: 'Override narrative generation',
                power: 7,
                commands: ['override', 'force', 'admin'],
                effect: this.createOverrideEffect()
            }
        ];
        
        const template = devEchoes[Math.floor(Math.random() * devEchoes.length)];
        
        return {
            id: id,
            name: template.name,
            type: this.echoTypes.DEVELOPER,
            classpectAffinity: ['Admin'],
            description: template.description,
            power: template.power,
            cooldown: 0,
            commands: template.commands,
            effect: template.effect,
            developerOnly: true,
            timestamp: Date.now()
        };
    }
    
    generateTemporalEcho(id) {
        const temporalEchoes = [
            {
                name: 'Doomed Timeline',
                description: 'Create or access doomed timeline variants',
                power: 8,
                commands: ['doomed', 'timeline', 'branch']
            },
            {
                name: 'Stable Time Loop',
                description: 'Establish causally consistent time loops',
                power: 9,
                commands: ['loop', 'stable', 'causal']
            },
            {
                name: 'Paradox Resolution',
                description: 'Resolve temporal paradoxes',
                power: 10,
                commands: ['resolve', 'paradox', 'fix']
            }
        ];
        
        const template = temporalEchoes[Math.floor(Math.random() * temporalEchoes.length)];
        
        return {
            id: id,
            name: template.name,
            type: this.echoTypes.TEMPORAL,
            classpectAffinity: ['Time', 'Space', 'Void'],
            description: template.description,
            power: template.power,
            cooldown: template.power - 3,
            commands: template.commands,
            effect: this.createTemporalEchoEffect(template.name),
            temporal: true,
            timestamp: Date.now()
        };
    }
    
    generateRandomEcho(id, classpect) {
        const types = Object.values(this.echoTypes);
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        switch (randomType) {
            case this.echoTypes.FAN:
                return this.generateFanEcho(id, classpect);
            case this.echoTypes.DEVELOPER:
                return this.generateDeveloperEcho(id);
            case this.echoTypes.TEMPORAL:
                return this.generateTemporalEcho(id);
            default:
                return this.generateFanEcho(id, classpect);
        }
    }
    
    // Echo Management
    activateEcho(echoId) {
        const echo = this.echoes.get(echoId);
        if (!echo) {
            return { success: false, message: 'Echo not found' };
        }
        
        if (this.activeEchoes.length >= this.maxActiveEchoes) {
            return { success: false, message: 'Maximum active echoes reached' };
        }
        
        if (this.isEchoOnCooldown(echoId)) {
            return { success: false, message: 'Echo is on cooldown' };
        }
        
        // Check classpect compatibility
        const player = sburbCore.getPlayer();
        if (echo.classpectAffinity.length > 0 && player.classpect) {
            const hasAffinity = echo.classpectAffinity.some(affinity => 
                player.classpect.includes(affinity)
            );
            
            if (!hasAffinity) {
                return { 
                    success: false, 
                    message: `Echo requires affinity with ${echo.classpectAffinity.join(' or ')}` 
                };
            }
        }
        
        this.activeEchoes.push({
            ...echo,
            activatedAt: Date.now(),
            lastUsed: 0
        });
        
        sburbCore.emit('echo:activated', echo);
        sburbCore.addBookEntry(
            `Echo Activated: ${echo.name}`,
            `The echo "${echo.name}" has been activated and is now available for use.`,
            'echo'
        );
        
        return { success: true, echo: echo };
    }
    
    deactivateEcho(echoId) {
        const index = this.activeEchoes.findIndex(echo => echo.id === echoId);
        if (index === -1) {
            return { success: false, message: 'Echo not active' };
        }
        
        const echo = this.activeEchoes.splice(index, 1)[0];
        sburbCore.emit('echo:deactivated', echo);
        
        return { success: true, echo: echo };
    }
    
    useEcho(echoId, context = '') {
        const activeEcho = this.activeEchoes.find(echo => echo.id === echoId);
        if (!activeEcho) {
            return { success: false, message: 'Echo not active' };
        }
        
        if (this.isEchoOnCooldown(echoId)) {
            const cooldownRemaining = this.getCooldownRemaining(echoId);
            return { 
                success: false, 
                message: `Echo on cooldown for ${cooldownRemaining} more turns` 
            };
        }
        
        // Execute echo effect
        const result = activeEcho.effect(context);
        
        // Set cooldown
        activeEcho.lastUsed = Date.now();
        
        sburbCore.emit('echo:used', { echo: activeEcho, result: result });
        sburbCore.addBookEntry(
            `Echo Used: ${activeEcho.name}`,
            `${activeEcho.description}. Result: ${result.message || 'Effect applied.'}`,
            'echo'
        );
        
        return { success: true, result: result };
    }
    
    isEchoOnCooldown(echoId) {
        const activeEcho = this.activeEchoes.find(echo => echo.id === echoId);
        if (!activeEcho || activeEcho.cooldown === 0) return false;
        
        const timeSinceUse = Date.now() - activeEcho.lastUsed;
        const cooldownMs = activeEcho.cooldown * 30000; // 30 seconds per cooldown turn
        
        return timeSinceUse < cooldownMs;
    }
    
    getCooldownRemaining(echoId) {
        const activeEcho = this.activeEchoes.find(echo => echo.id === echoId);
        if (!activeEcho) return 0;
        
        const timeSinceUse = Date.now() - activeEcho.lastUsed;
        const cooldownMs = activeEcho.cooldown * 30000;
        const remaining = Math.max(0, cooldownMs - timeSinceUse);
        
        return Math.ceil(remaining / 30000);
    }
    
    // Echo Effects
    createAlchemizeEffect() {
        return (context) => {
            const narrative = markovEngine.generateNarrative(context, 'discovery', 'short');
            return {
                type: 'alchemize',
                message: `Alchemical synthesis initiated. ${narrative}`,
                effect: 'item_created'
            };
        };
    }
    
    createStrifeEffect() {
        return (context) => {
            const narrative = markovEngine.generateNarrative(context, 'conflict', 'medium');
            return {
                type: 'strife',
                message: `Strife engagement commenced. ${narrative}`,
                effect: 'combat_started'
            };
        };
    }
    
    createExploreEffect() {
        return (context) => {
            const narrative = markovEngine.generateNarrative(context, 'discovery', 'medium');
            return {
                type: 'explore',
                message: `Exploration reveals new possibilities. ${narrative}`,
                effect: 'area_discovered'
            };
        };
    }
    
    createPrototypeEffect() {
        return (context) => {
            const narrative = markovEngine.generateNarrative(context, 'entry', 'short');
            return {
                type: 'prototype',
                message: `Sprite prototyping sequence activated. ${narrative}`,
                effect: 'sprite_prototyped'
            };
        };
    }
    
    createTimeEffect() {
        return (context) => {
            const narrative = "The fabric of time bends to your will, causality becomes malleable.";
            return {
                type: 'temporal',
                message: `Temporal manipulation engaged. ${narrative}`,
                effect: 'time_altered'
            };
        };
    }
    
    createSpaceEffect() {
        return (context) => {
            const narrative = "Space folds upon itself, distances become meaningless.";
            return {
                type: 'spatial',
                message: `Spatial distortion activated. ${narrative}`,
                effect: 'space_warped'
            };
        };
    }
    
    createGenericEchoEffect(echoName) {
        return (context) => {
            const narrative = markovEngine.generateNarrative(context, 'general', 'short');
            return {
                type: 'generic',
                message: `${echoName} takes effect. ${narrative}`,
                effect: 'narrative_altered'
            };
        };
    }
    
    createDebugEffect() {
        return (context) => {
            return {
                type: 'debug',
                message: 'Debug console accessed. Reality parameters visible.',
                effect: 'debug_mode',
                data: sburbCore.debug()
            };
        };
    }
    
    createStateEffect() {
        return (context) => {
            return {
                type: 'state',
                message: 'Game state manipulation interface activated.',
                effect: 'state_access'
            };
        };
    }
    
    createOverrideEffect() {
        return (context) => {
            return {
                type: 'override',
                message: 'Narrative override protocols engaged. Author privileges granted.',
                effect: 'narrative_override'
            };
        };
    }
    
    createTemporalEchoEffect(echoName) {
        return (context) => {
            const temporalNarrative = "Timeline fluctuations detected. Paradox space responds to your intervention.";
            return {
                type: 'temporal',
                message: `${echoName} manifests. ${temporalNarrative}`,
                effect: 'temporal_event'
            };
        };
    }
    
    createCascadeEffect() {
        return (context) => {
            return {
                type: 'cascade',
                message: 'CASCADE PROTOCOL INITIATED. Reality restructuring in progress.',
                effect: 'cascade_event',
                magnitude: 'universe_altering'
            };
        };
    }
    
    createScratchEffect() {
        return (context) => {
            return {
                type: 'scratch',
                message: 'SCRATCH SEQUENCE ACTIVATED. Timeline reset imminent.',
                effect: 'session_reset',
                magnitude: 'timeline_altering'
            };
        };
    }
    
    createGodTierEffect() {
        return (context) => {
            return {
                type: 'god_tier',
                message: 'GOD TIER ASCENSION ACHIEVED. Conditional immortality granted.',
                effect: 'god_tier_awakening',
                magnitude: 'player_transcendence'
            };
        };
    }
    
    // Command Processing
    processEchoCommand(command, args) {
        // Check if command matches any active echo
        for (const echo of this.activeEchoes) {
            if (echo.commands.includes(command.toLowerCase())) {
                return this.useEcho(echo.id, args.join(' '));
            }
        }
        
        // Check echo call files
        if (this.echoCallFiles.has(command)) {
            const callFile = this.echoCallFiles.get(command);
            const result = callFile.effect(args.join(' '));
            
            sburbCore.addBookEntry(
                `Echo Call: ${callFile.name}`,
                `${callFile.description}. ${result.message}`,
                'echo_call'
            );
            
            return { success: true, result: result };
        }
        
        return null; // Command not recognized as echo
    }
    
    // Utility Functions
    getActiveEchoes() {
        return [...this.activeEchoes];
    }
    
    getAllEchoes() {
        return Array.from(this.echoes.values());
    }
    
    getEchoById(id) {
        return this.echoes.get(id);
    }
    
    getEchosByType(type) {
        return Array.from(this.echoes.values()).filter(echo => echo.type === type);
    }
    
    getEchosByClasspect(classpect) {
        return Array.from(this.echoes.values()).filter(echo => 
            echo.classpectAffinity.some(affinity => 
                classpect.includes(affinity)
            )
        );
    }
    
    // Echo Mutation (for advanced gameplay)
    mutateEcho(echoId, mutationType = 'random') {
        const echo = this.echoes.get(echoId);
        if (!echo) return null;
        
        const mutatedEcho = { ...echo };
        mutatedEcho.id = sburbCore.generateId();
        mutatedEcho.name = `${echo.name} [MUTATED]`;
        mutatedEcho.power = Math.max(1, echo.power + (Math.random() > 0.5 ? 1 : -1));
        mutatedEcho.mutated = true;
        mutatedEcho.originalId = echoId;
        
        this.echoes.set(mutatedEcho.id, mutatedEcho);
        sburbCore.emit('echo:mutated', { original: echo, mutated: mutatedEcho });
        
        return mutatedEcho;
    }
}

// Initialize global Echo system
window.echoSystem = new EchoSystem();
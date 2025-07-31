// Command Interpretation System - Gamzee H (The First Mate) Narrator AI
class CommandSystem {
    constructor() {
        this.commands = new Map();
        this.aliases = new Map();
        this.commandHistory = [];
        this.contextStack = [];
        this.initialized = false;
        
        this.init();
    }
    
    async init() {
        console.log('Initializing Command System...');
        await this.loadCommands();
        await this.loadAliases();
        this.initialized = true;
        sburbCore.emit('commands:initialized');
    }
    
    async loadCommands() {
        // Core game commands
        const coreCommands = {
            // Session Management
            'begin': {
                description: 'Start your SBURB session',
                category: 'session',
                handler: this.handleBegin.bind(this)
            },
            'name': {
                description: 'Set your player name',
                category: 'player',
                usage: 'name [your name]',
                handler: this.handleName.bind(this)
            },
            'classpect': {
                description: 'Discover or set your classpect',
                category: 'player',
                usage: 'classpect [class] [aspect]',
                handler: this.handleClasspect.bind(this)
            },
            'lunar': {
                description: 'Determine your lunar sway',
                category: 'player',
                handler: this.handleLunar.bind(this)
            },
            
            // Exploration
            'look': {
                description: 'Examine your surroundings',
                category: 'exploration',
                handler: this.handleLook.bind(this)
            },
            'explore': {
                description: 'Explore the current area',
                category: 'exploration',
                usage: 'explore [area]',
                handler: this.handleExplore.bind(this)
            },
            'map': {
                description: 'View the ASCII map of your land',
                category: 'exploration',
                handler: this.handleMap.bind(this)
            },
            'go': {
                description: 'Move to a different location',
                category: 'exploration',
                usage: 'go [direction/location]',
                handler: this.handleGo.bind(this)
            },
            
            // Player Status
            'status': {
                description: 'Check your current status',
                category: 'player',
                handler: this.handleStatus.bind(this)
            },
            'inventory': {
                description: 'View your inventory',
                category: 'player',
                handler: this.handleInventory.bind(this)
            },
            'level': {
                description: 'Check your experience and level',
                category: 'player',
                handler: this.handleLevel.bind(this)
            },
            
            // Echo Management
            'echoes': {
                description: 'List available echoes',
                category: 'echoes',
                handler: this.handleEchoes.bind(this)
            },
            'activate': {
                description: 'Activate an echo',
                category: 'echoes',
                usage: 'activate [echo_id]',
                handler: this.handleActivate.bind(this)
            },
            'deactivate': {
                description: 'Deactivate an echo',
                category: 'echoes',
                usage: 'deactivate [echo_id]',
                handler: this.handleDeactivate.bind(this)
            },
            'generate': {
                description: 'Generate a new echo',
                category: 'echoes',
                usage: 'generate [type]',
                handler: this.handleGenerate.bind(this)
            },
            
            // Land Interaction
            'land': {
                description: 'Get information about your current land',
                category: 'land',
                handler: this.handleLand.bind(this)
            },
            'quest': {
                description: 'Check your current quest status',
                category: 'land',
                handler: this.handleQuest.bind(this)
            },
            'consorts': {
                description: 'Interact with consort species',
                category: 'land',
                handler: this.handleConsorts.bind(this)
            },
            
            // System Commands
            'help': {
                description: 'Show available commands',
                category: 'system',
                usage: 'help [command]',
                handler: this.handleHelp.bind(this)
            },
            'save': {
                description: 'Save your game',
                category: 'system',
                handler: this.handleSave.bind(this)
            },
            'load': {
                description: 'Load your game',
                category: 'system',
                handler: this.handleLoad.bind(this)
            },
            'reset': {
                description: 'Reset your session (WARNING: Destructive)',
                category: 'system',
                handler: this.handleReset.bind(this)
            },
            'debug': {
                description: 'Access debug information',
                category: 'system',
                handler: this.handleDebug.bind(this)
            },
            
            // Narrative Commands
            'story': {
                description: 'Generate narrative content',
                category: 'narrative',
                usage: 'story [theme]',
                handler: this.handleStory.bind(this)
            },
            'book': {
                description: 'Access the Book of Numbers',
                category: 'narrative',
                handler: this.handleBook.bind(this)
            },
            'lore': {
                description: 'Access lore and background information',
                category: 'narrative',
                usage: 'lore [topic]',
                handler: this.handleLore.bind(this)
            },
            
            // Meta Commands
            'office': {
                description: 'Access the Office of Paradoxes (if unlocked)',
                category: 'meta',
                handler: this.handleOffice.bind(this)
            },
            'grey': {
                description: 'Enter The Grey (if accessible)',
                category: 'meta',
                handler: this.handleGrey.bind(this)
            }
        };
        
        // Register all commands
        Object.entries(coreCommands).forEach(([command, data]) => {
            this.commands.set(command, data);
        });
    }
    
    async loadAliases() {
        const aliases = {
            // Common shortcuts
            'l': 'look',
            'i': 'inventory',
            'st': 'status',
            'h': 'help',
            'e': 'explore',
            'm': 'map',
            'q': 'quest',
            
            // Alternative names
            'examine': 'look',
            'check': 'status',
            'items': 'inventory',
            'powers': 'echoes',
            'abilities': 'echoes',
            'land_info': 'land',
            'quest_status': 'quest',
            
            // Narrative aliases
            'tell': 'story',
            'narrate': 'story',
            'archive': 'book',
            'log': 'book',
            'history': 'book'
        };
        
        Object.entries(aliases).forEach(([alias, command]) => {
            this.aliases.set(alias, command);
        });
    }
    
    // Main command processing
    processCommand(input) {
        if (!input || !input.trim()) {
            return this.createResponse('> GAMZEE H: speak up there, player, the void doesn\'t respond to silence', 'warning');
        }
        
        const trimmedInput = input.trim();
        const [command, ...args] = trimmedInput.toLowerCase().split(/\s+/);
        
        // Add to command history
        this.commandHistory.push({
            input: trimmedInput,
            timestamp: Date.now()
        });
        
        // Keep history manageable
        if (this.commandHistory.length > 100) {
            this.commandHistory.shift();
        }
        
        // Check for echo commands first
        const echoResult = echoSystem.processEchoCommand(command, args);
        if (echoResult) {
            const narrative = this.generateNarratorResponse(echoResult.result.message, 'echo');
            sburbCore.addCommand(trimmedInput, echoResult.result.message);
            return this.createResponse(narrative, echoResult.success ? 'success' : 'error');
        }
        
        // Resolve aliases
        const resolvedCommand = this.aliases.get(command) || command;
        
        // Check if command exists
        const commandData = this.commands.get(resolvedCommand);
        if (!commandData) {
            const suggestion = this.findSimilarCommand(resolvedCommand);
            const message = suggestion ? 
                `Unknown command '${command}'. Did you mean '${suggestion}'?` :
                `Unknown command '${command}'. Type 'help' for available commands.`;
            
            const narrative = this.generateNarratorResponse(message, 'error');
            return this.createResponse(narrative, 'error');
        }
        
        // Execute command
        try {
            const result = commandData.handler(args, trimmedInput);
            sburbCore.addCommand(trimmedInput, result.message);
            return result;
        } catch (error) {
            console.error('Command execution error:', error);
            const narrative = this.generateNarratorResponse(
                'Something went wrong in the cosmic machinery. The paradox space hiccupped.',
                'error'
            );
            return this.createResponse(narrative, 'error');
        }
    }
    
    // Command Handlers
    handleBegin(args) {
        const session = sburbCore.getSession();
        if (session.active) {
            return this.createResponse(
                this.generateNarratorResponse('Your session is already active, player. The wheels are already in motion.', 'info'),
                'info'
            );
        }
        
        sburbCore.startSession();
        
        // Generate initial land if none exists
        if (!landSystem.getCurrentLand()) {
            const land = landSystem.generateLand();
            landSystem.setCurrentLand(land.id);
        }
        
        const narrative = this.generateNarratorResponse(
            'Session initiated! The cosmic dance begins. Your journey through paradox space starts now. But first, we need to see how you approach this cosmic game...',
            'session'
        );
        
        // Present the first major choice after a brief delay
        setTimeout(() => {
            const sessionChoice = choiceSystem.getChoiceTemplate('sessionStart');
            choiceSystem.presentChoice('session_start', sessionChoice);
        }, 2000);
        
        return this.createResponse(narrative, 'success');
    }
    
    handleName(args) {
        if (args.length === 0) {
            const player = sburbCore.getPlayer();
            const currentName = player.name || 'Unknown';
            return this.createResponse(
                this.generateNarratorResponse(`Your name is ${currentName}.`, 'info'),
                'info'
            );
        }
        
        const name = args.join(' ');
        sburbCore.setPlayerName(name);
        
        const narrative = this.generateNarratorResponse(
            `Excellent choice, ${name}. Names have power in paradox space.`,
            'player'
        );
        
        return this.createResponse(narrative, 'success');
    }
    
    handleClasspect(args) {
        const player = sburbCore.getPlayer();
        
        if (args.length === 0) {
            if (player.classpect) {
                return this.createResponse(
                    this.generateNarratorResponse(`You are the ${player.classpect}.`, 'info'),
                    'info'
                );
            } else {
                // Generate random classpect
                const classpect = markovEngine.generateClasspect();
                sburbCore.setPlayerClasspect(classpect.full);
                
                const narrative = this.generateNarratorResponse(
                    `The cosmic forces reveal your true nature: ${classpect.full}. ${classpect.description}.`,
                    'awakening'
                );
                
                return this.createResponse(narrative, 'success');
            }
        }
        
        if (args.length >= 2) {
            const classpectString = `${args[0]} of ${args[1]}`;
            sburbCore.setPlayerClasspect(classpectString);
            
            const narrative = this.generateNarratorResponse(
                `Your classpect has been set to ${classpectString}. The universe acknowledges your choice.`,
                'player'
            );
            
            return this.createResponse(narrative, 'success');
        }
        
        return this.createResponse(
            this.generateNarratorResponse('Usage: classpect [class] [aspect] or just "classpect" to discover yours.', 'help'),
            'info'
        );
    }
    
    handleLunar(args) {
        const player = sburbCore.getPlayer();
        
        if (player.lunarSway) {
            return this.createResponse(
                this.generateNarratorResponse(`Your lunar sway is ${player.lunarSway}.`, 'info'),
                'info'
            );
        }
        
        const sway = markovEngine.generateLunarSway();
        sburbCore.setPlayerLunarSway(sway);
        
        const swayDescriptions = {
            'Prospit': 'You are a dreamer of the golden city, optimistic and creative.',
            'Derse': 'You are a dreamer of the purple moon, skeptical and rebellious.'
        };
        
        const narrative = this.generateNarratorResponse(
            `Your lunar sway is ${sway}. ${swayDescriptions[sway]}`,
            'awakening'
        );
        
        return this.createResponse(narrative, 'success');
    }
    
    handleLook(args) {
        const land = landSystem.getCurrentLand();
        
        if (!land) {
            return this.createResponse(
                this.generateNarratorResponse('You find yourself in the void between worlds. Perhaps you should begin your session?', 'mystery'),
                'warning'
            );
        }
        
        const description = markovEngine.generateNarrative(
            `looking around ${land.name}`,
            'discovery',
            'medium'
        );
        
        const narrative = this.generateNarratorResponse(
            `You survey ${land.name}. ${description} The ${land.themes.join(', ')} themes permeate everything here.`,
            'exploration'
        );
        
        return this.createResponse(narrative, 'success');
    }
    
    handleExplore(args) {
        const land = landSystem.getCurrentLand();
        
        if (!land) {
            return this.createResponse(
                this.generateNarratorResponse('There\'s nothing to explore in the void. Start your session first.', 'warning'),
                'warning'
            );
        }
        
        const targetArea = args.length > 0 ? args.join('_') : 'random';
        const result = landSystem.exploreLand(land.id, targetArea);
        
        if (result) {
            const narrative = this.generateNarratorResponse(
                `Exploration yields results: ${result.narrative}`,
                'discovery'
            );
            
            // Award experience
            const player = sburbCore.getPlayer();
            player.experience += result.experience;
            
            return this.createResponse(narrative, 'success');
        }
        
        return this.createResponse(
            this.generateNarratorResponse('The exploration yields nothing of note this time.', 'neutral'),
            'info'
        );
    }
    
    handleMap(args) {
        const land = landSystem.getCurrentLand();
        
        if (!land) {
            return this.createResponse(
                this.generateNarratorResponse('No land to map in the void.', 'warning'),
                'warning'
            );
        }
        
        const mapSection = landSystem.getMapSection(land.id);
        const narrative = this.generateNarratorResponse(
            `Behold, the layout of ${land.name}:`,
            'info'
        );
        
        return this.createResponse(`${narrative}\n\n${mapSection}`, 'success');
    }
    
    handleStatus(args) {
        const player = sburbCore.getPlayer();
        const session = sburbCore.getSession();
        
        const statusInfo = [
            `Name: ${player.name || 'Unknown'}`,
            `Classpect: ${player.classpect || 'Unawakened'}`,
            `Lunar Sway: ${player.lunarSway || 'Undetermined'}`,
            `HP: ${player.hp}/${player.maxHp}`,
            `Level: ${player.level}`,
            `Experience: ${player.experience}`,
            `Session: ${session.active ? 'Active' : 'Inactive'}`,
            `Active Echoes: ${echoSystem.getActiveEchoes().length}`
        ];
        
        const narrative = this.generateNarratorResponse(
            'Here\'s your current status in the grand cosmic game:',
            'info'
        );
        
        return this.createResponse(`${narrative}\n\n${statusInfo.join('\n')}`, 'info');
    }
    
    handleInventory(args) {
        const player = sburbCore.getPlayer();
        
        if (player.inventory.length === 0) {
            return this.createResponse(
                this.generateNarratorResponse('Your inventory is as empty as the void between stars.', 'neutral'),
                'info'
            );
        }
        
        const items = player.inventory.map(item => `- ${item.name || item}`).join('\n');
        const narrative = this.generateNarratorResponse(
            'Your inventory contains:',
            'info'
        );
        
        return this.createResponse(`${narrative}\n\n${items}`, 'info');
    }
    
    handleEchoes(args) {
        const activeEchoes = echoSystem.getActiveEchoes();
        const allEchoes = echoSystem.getAllEchoes();
        
        if (activeEchoes.length === 0) {
            return this.createResponse(
                this.generateNarratorResponse('No echoes currently active. The narrative awaits your influence.', 'neutral'),
                'info'
            );
        }
        
        const echoList = activeEchoes.map(echo => 
            `- ${echo.name} (${echo.type}) - Power: ${echo.power}`
        ).join('\n');
        
        const narrative = this.generateNarratorResponse(
            `Active echoes resonating in paradox space (${activeEchoes.length}/${allEchoes.length} total):`,
            'info'
        );
        
        return this.createResponse(`${narrative}\n\n${echoList}`, 'info');
    }
    
    handleHelp(args) {
        if (args.length > 0) {
            const command = args[0].toLowerCase();
            const commandData = this.commands.get(command);
            
            if (commandData) {
                const usage = commandData.usage || command;
                const helpText = [
                    `Command: ${command}`,
                    `Description: ${commandData.description}`,
                    `Usage: ${usage}`,
                    `Category: ${commandData.category}`
                ].join('\n');
                
                return this.createResponse(helpText, 'info');
            } else {
                return this.createResponse(
                    this.generateNarratorResponse(`No help available for '${command}'.`, 'warning'),
                    'warning'
                );
            }
        }
        
        // Group commands by category
        const categories = {};
        this.commands.forEach((data, command) => {
            if (!categories[data.category]) {
                categories[data.category] = [];
            }
            categories[data.category].push(command);
        });
        
        let helpText = this.generateNarratorResponse(
            'Available commands in the cosmic interface:',
            'help'
        ) + '\n\n';
        
        Object.entries(categories).forEach(([category, commands]) => {
            helpText += `${category.toUpperCase()}:\n`;
            helpText += commands.map(cmd => `  ${cmd} - ${this.commands.get(cmd).description}`).join('\n');
            helpText += '\n\n';
        });
        
        helpText += 'Type "help [command]" for detailed information about a specific command.';
        
        return this.createResponse(helpText, 'info');
    }
    
    handleSave(args) {
        const success = sburbCore.saveGame();
        const message = success ? 
            'Game saved successfully. Your progress persists across the timelines.' :
            'Save failed. The cosmic forces resist preservation.';
        
        return this.createResponse(
            this.generateNarratorResponse(message, success ? 'success' : 'error'),
            success ? 'success' : 'error'
        );
    }
    
    handleLoad(args) {
        const success = sburbCore.loadGame();
        const message = success ?
            'Game loaded successfully. The timeline restores itself.' :
            'Load failed. Perhaps there\'s nothing to restore?';
        
        return this.createResponse(
            this.generateNarratorResponse(message, success ? 'success' : 'warning'),
            success ? 'success' : 'warning'
        );
    }
    
    handleBook(args) {
        const bookEntries = sburbCore.getNarrative().bookOfNumbers;
        
        if (bookEntries.length === 0) {
            return this.createResponse(
                this.generateNarratorResponse('The Book of Numbers is empty. Your story has yet to be written.', 'neutral'),
                'info'
            );
        }
        
        const recentEntries = bookEntries.slice(-5).map(entry => 
            `[${new Date(entry.timestamp).toLocaleTimeString()}] ${entry.title}`
        ).join('\n');
        
        const narrative = this.generateNarratorResponse(
            `The Book of Numbers contains ${bookEntries.length} entries. Recent entries:`,
            'info'
        );
        
        return this.createResponse(`${narrative}\n\n${recentEntries}`, 'info');
    }
    
    // Utility methods
    generateNarratorResponse(message, context = 'general') {
        const narratorPrefixes = {
            'general': '> GAMZEE H: ',
            'info': '> GAMZEE H: ',
            'success': '> GAMZEE H: ',
            'error': '> GAMZEE H: whoops, ',
            'warning': '> GAMZEE H: careful now, ',
            'help': '> GAMZEE H: let me break it down for you, ',
            'mystery': '> GAMZEE H: curious and curiouser, ',
            'awakening': '> GAMZEE H: ah, the cosmic truth reveals itself! ',
            'exploration': '> GAMZEE H: ',
            'discovery': '> GAMZEE H: well well, ',
            'session': '> GAMZEE H: the grand performance begins! ',
            'player': '> GAMZEE H: ',
            'echo': '> GAMZEE H: the echoes of paradox space respond! ',
            'neutral': '> GAMZEE H: '
        };
        
        const prefix = narratorPrefixes[context] || narratorPrefixes['general'];
        
        // Add some Gamzee-style flavor occasionally
        const flavorChance = Math.random();
        if (flavorChance < 0.1) {
            const flavors = [
                ' :o)',
                ' honk honk',
                ' *chuckles*',
                ' the miracles never end',
                ' all according to the grand design'
            ];
            const flavor = flavors[Math.floor(Math.random() * flavors.length)];
            return prefix + message + flavor;
        }
        
        return prefix + message;
    }
    
    createResponse(message, type = 'info') {
        return {
            message: message,
            type: type,
            timestamp: Date.now()
        };
    }
    
    findSimilarCommand(input) {
        const commands = Array.from(this.commands.keys());
        const aliases = Array.from(this.aliases.keys());
        const allCommands = [...commands, ...aliases];
        
        // Simple similarity check
        for (const command of allCommands) {
            if (command.includes(input) || input.includes(command)) {
                return command;
            }
        }
        
        // Levenshtein distance check for close matches
        let bestMatch = null;
        let bestDistance = Infinity;
        
        for (const command of allCommands) {
            const distance = this.levenshteinDistance(input, command);
            if (distance < bestDistance && distance <= 2) {
                bestDistance = distance;
                bestMatch = command;
            }
        }
        
        return bestMatch;
    }
    
    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }
    
    // Add more command handlers as needed...
    handleLand(args) {
        const land = landSystem.getCurrentLand();
        
        if (!land) {
            return this.createResponse(
                this.generateNarratorResponse('You exist in the void between lands. Begin your session to manifest your realm.', 'mystery'),
                'warning'
            );
        }
        
        const info = [
            `Name: ${land.name}`,
            `Themes: ${land.themes.join(', ')}`,
            `Description: ${land.description}`,
            `Consorts: ${land.consorts.map(c => c.name).join(', ')}`,
            `Exploration: ${land.explored.percentage.toFixed(1)}%`,
            `Quest: ${land.quest.title}`
        ];
        
        const narrative = this.generateNarratorResponse(
            'Your land awaits your exploration:',
            'info'
        );
        
        return this.createResponse(`${narrative}\n\n${info.join('\n')}`, 'info');
    }
    
    handleQuest(args) {
        const land = landSystem.getCurrentLand();
        
        if (!land) {
            return this.createResponse(
                this.generateNarratorResponse('No quest exists in the void. Enter your session first.', 'warning'),
                'warning'
            );
        }
        
        const quest = land.quest;
        const progress = `${quest.progress}/${quest.objectives.length}`;
        
        const questInfo = [
            `Quest: ${quest.title}`,
            `Progress: ${progress}`,
            `Description: ${quest.description}`,
            `Current Objectives:`
        ];
        
        quest.objectives.forEach((objective, index) => {
            const status = index < quest.progress ? '[COMPLETE]' : '[PENDING]';
            questInfo.push(`  ${status} ${objective}`);
        });
        
        const narrative = this.generateNarratorResponse(
            'Your quest status in the grand narrative:',
            'info'
        );
        
        return this.createResponse(`${narrative}\n\n${questInfo.join('\n')}`, 'info');
    }
    
    handleDebug(args) {
        const debugInfo = sburbCore.debug();
        const systemStatus = {
            core: sburbCore.initialized,
            markov: markovEngine.initialized,
            echo: echoSystem.initialized,
            land: landSystem.initialized,
            commands: this.initialized
        };
        
        const debugText = [
            'SYSTEM STATUS:',
            Object.entries(systemStatus).map(([system, status]) => 
                `${system}: ${status ? 'ONLINE' : 'OFFLINE'}`
            ).join('\n'),
            '',
            'GAME STATE:',
            `Session Active: ${debugInfo.gameState.session.active}`,
            `Player Name: ${debugInfo.gameState.player.name || 'None'}`,
            `Current Land: ${debugInfo.gameState.world.currentLand || 'None'}`,
            `Active Echoes: ${echoSystem.getActiveEchoes().length}`,
            `Command History: ${this.commandHistory.length} entries`
        ];
        
        return this.createResponse(debugText.join('\n'), 'info');
    }
    
    // Placeholder handlers for missing commands
    handleLevel(args) {
        const player = sburbCore.getPlayer();
        const expToNext = (player.level * 100) - player.experience;
        
        const levelInfo = [
            `Current Level: ${player.level}`,
            `Experience: ${player.experience}`,
            `Experience to Next Level: ${Math.max(0, expToNext)}`
        ];
        
        return this.createResponse(levelInfo.join('\n'), 'info');
    }
    
    handleActivate(args) {
        if (args.length === 0) {
            return this.createResponse(
                this.generateNarratorResponse('Specify an echo to activate.', 'help'),
                'warning'
            );
        }
        
        const echoId = args[0];
        const result = echoSystem.activateEcho(echoId);
        
        return this.createResponse(
            this.generateNarratorResponse(result.message, result.success ? 'success' : 'error'),
            result.success ? 'success' : 'error'
        );
    }
    
    handleDeactivate(args) {
        if (args.length === 0) {
            return this.createResponse(
                this.generateNarratorResponse('Specify an echo to deactivate.', 'help'),
                'warning'
            );
        }
        
        const echoId = args[0];
        const result = echoSystem.deactivateEcho(echoId);
        
        return this.createResponse(
            this.generateNarratorResponse(result.message, result.success ? 'success' : 'error'),
            result.success ? 'success' : 'error'
        );
    }
    
    handleGenerate(args) {
        const type = args[0] || 'random';
        const player = sburbCore.getPlayer();
        const classpect = player.classpect ? { 
            class: player.classpect.split(' of ')[0], 
            aspect: player.classpect.split(' of ')[1] 
        } : null;
        
        const echo = echoSystem.generateEcho(type, classpect);
        
        return this.createResponse(
            this.generateNarratorResponse(`New echo generated: ${echo.name} (${echo.type})`, 'success'),
            'success'
        );
    }
    
    handleConsorts(args) {
        const land = landSystem.getCurrentLand();
        
        if (!land) {
            return this.createResponse(
                this.generateNarratorResponse('No consorts exist in the void.', 'warning'),
                'warning'
            );
        }
        
        const consortInfo = land.consorts.map(consort => {
            return [
                `Species: ${consort.name}`,
                `Description: ${consort.description}`,
                `Personality: ${consort.personality}`,
                `Helpfulness: ${consort.helpfulness}`,
                `Specialties: ${consort.specialties.join(', ')}`
            ].join('\n');
        }).join('\n\n');
        
        const narrative = this.generateNarratorResponse(
            'The consorts of your land:',
            'info'
        );
        
        return this.createResponse(`${narrative}\n\n${consortInfo}`, 'info');
    }
    
    handleStory(args) {
        const theme = args.join(' ') || 'general';
        const narrative = markovEngine.generateNarrative('', theme, 'long');
        
        return this.createResponse(
            this.generateNarratorResponse(`A tale unfolds: ${narrative}`, 'discovery'),
            'success'
        );
    }
    
    handleLore(args) {
        const topic = args.join(' ') || 'general';
        const loreText = `Lore about ${topic}: The mysteries of paradox space run deep...`;
        
        return this.createResponse(
            this.generateNarratorResponse(loreText, 'mystery'),
            'info'
        );
    }
    
    handleGo(args) {
        if (args.length === 0) {
            return this.createResponse(
                this.generateNarratorResponse('Where would you like to go?', 'help'),
                'warning'
            );
        }
        
        const destination = args.join(' ');
        const narrative = markovEngine.generateNarrative(`traveling to ${destination}`, 'general', 'short');
        
        return this.createResponse(
            this.generateNarratorResponse(`You attempt to go to ${destination}. ${narrative}`, 'exploration'),
            'info'
        );
    }
    
    handleReset(args) {
        sburbCore.resetGame();
        return this.createResponse(
            this.generateNarratorResponse('Session reset. The timeline begins anew.', 'warning'),
            'warning'
        );
    }
    
    handleOffice(args) {
        return this.createResponse(
            this.generateNarratorResponse('The Office of Paradoxes remains locked. Perhaps you need the right key...', 'mystery'),
            'warning'
        );
    }
    
    handleGrey(args) {
        return this.createResponse(
            this.generateNarratorResponse('The Grey is not accessible from here. Some paths require special circumstances.', 'mystery'),
            'warning'
        );
    }
}

// Initialize global command system
window.commandSystem = new CommandSystem();
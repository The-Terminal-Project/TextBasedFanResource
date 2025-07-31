// SBURB.PRIME Choice & Consequence System
class ChoiceSystem {
    constructor() {
        this.activeChoices = new Map();
        this.choiceHistory = [];
        this.consequences = new Map();
        this.worldState = {
            reputation: {
                consorts: 0,
                denizen: 0,
                echoes: 0
            },
            relationships: new Map(),
            unlockedPaths: new Set(),
            worldChanges: new Map()
        };
        this.initialized = false;
        
        this.init();
    }
    
    init() {
        console.log('Initializing Choice System...');
        this.setupChoiceTemplates();
        this.initialized = true;
        sburbCore.emit('choice:initialized');
    }
    
    // Present a choice to the player
    presentChoice(choiceId, choiceData) {
        const choice = {
            id: choiceId,
            title: choiceData.title,
            description: choiceData.description,
            options: choiceData.options,
            context: choiceData.context || {},
            timestamp: Date.now(),
            consequences: choiceData.consequences || {}
        };
        
        this.activeChoices.set(choiceId, choice);
        this.displayChoice(choice);
        return choice;
    }
    
    // Display choice in the terminal
    displayChoice(choice) {
        const choiceHtml = `
            <div class="choice-container" data-choice-id="${choice.id}">
                <div class="choice-header">
                    <h3>${choice.title}</h3>
                    <p class="choice-description">${choice.description}</p>
                </div>
                <div class="choice-options">
                    ${choice.options.map((option, index) => `
                        <button class="choice-option" 
                                data-choice-id="${choice.id}" 
                                data-option-index="${index}"
                                onclick="choiceSystem.makeChoice('${choice.id}', ${index})">
                            <span class="option-number">${index + 1}.</span>
                            <span class="option-text">${option.text}</span>
                            ${option.consequences ? `<span class="option-hint">(${option.consequences.hint || ''})</span>` : ''}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        uiManager.addToTerminal(choiceHtml, 'choice');
    }
    
    // Handle player choice selection
    makeChoice(choiceId, optionIndex) {
        const choice = this.activeChoices.get(choiceId);
        if (!choice) {
            console.error('Choice not found:', choiceId);
            return;
        }
        
        const selectedOption = choice.options[optionIndex];
        if (!selectedOption) {
            console.error('Invalid option index:', optionIndex);
            return;
        }
        
        // Record the choice
        const choiceRecord = {
            choiceId,
            optionIndex,
            selectedOption,
            timestamp: Date.now(),
            context: choice.context
        };
        
        this.choiceHistory.push(choiceRecord);
        this.activeChoices.delete(choiceId);
        
        // Apply consequences
        this.applyConsequences(choiceRecord);
        
        // Update UI
        this.removeChoiceFromUI(choiceId);
        
        // Generate narrative response
        this.generateChoiceResponse(choiceRecord);
        
        // Trigger follow-up events
        this.triggerFollowUpEvents(choiceRecord);
        
        sburbCore.emit('choice:made', choiceRecord);
    }
    
    // Apply consequences of the choice
    applyConsequences(choiceRecord) {
        const consequences = choiceRecord.selectedOption.consequences || {};
        
        // Apply stat changes
        if (consequences.stats) {
            Object.entries(consequences.stats).forEach(([stat, change]) => {
                this.applyStatChange(stat, change);
            });
        }
        
        // Apply reputation changes
        if (consequences.reputation) {
            Object.entries(consequences.reputation).forEach(([faction, change]) => {
                this.worldState.reputation[faction] = 
                    (this.worldState.reputation[faction] || 0) + change;
            });
        }
        
        // Unlock new paths or areas
        if (consequences.unlocks) {
            consequences.unlocks.forEach(unlock => {
                this.worldState.unlockedPaths.add(unlock);
            });
        }
        
        // Apply world changes
        if (consequences.worldChanges) {
            Object.entries(consequences.worldChanges).forEach(([key, value]) => {
                this.worldState.worldChanges.set(key, value);
            });
        }
        
        // Store long-term consequences
        if (consequences.longTerm) {
            this.consequences.set(choiceRecord.choiceId, consequences.longTerm);
        }
    }
    
    applyStatChange(stat, change) {
        const player = sburbCore.gameState.player;
        
        switch (stat) {
            case 'hp':
                player.hp = Math.max(0, Math.min(player.maxHp, player.hp + change));
                break;
            case 'experience':
                player.experience += change;
                this.checkLevelUp();
                break;
            case 'level':
                player.level += change;
                break;
            default:
                if (player[stat] !== undefined) {
                    player[stat] += change;
                }
        }
    }
    
    checkLevelUp() {
        const player = sburbCore.gameState.player;
        const expNeeded = player.level * 100; // Simple leveling formula
        
        if (player.experience >= expNeeded) {
            player.level++;
            player.experience -= expNeeded;
            player.maxHp += 10;
            player.hp = player.maxHp; // Full heal on level up
            
            uiManager.addToTerminal(
                `> GAMZEE H: well well well, looks like you've grown stronger! welcome to level ${player.level}!`,
                'narrator level-up'
            );
            
            sburbCore.emit('player:level_up', player.level);
        }
    }
    
    // Generate narrative response to choice
    generateChoiceResponse(choiceRecord) {
        const response = choiceRecord.selectedOption.response || 
                        this.generateGenericResponse(choiceRecord);
        
        uiManager.addToTerminal(
            `> You chose: ${choiceRecord.selectedOption.text}`,
            'player-choice'
        );
        
        uiManager.addToTerminal(response, 'narrative');
        
        // Add Gamzee's commentary
        const commentary = this.generateGamzeeCommentary(choiceRecord);
        if (commentary) {
            uiManager.addToTerminal(
                `> GAMZEE H: ${commentary}`,
                'narrator'
            );
        }
    }
    
    generateGenericResponse(choiceRecord) {
        const responses = [
            "Your decision ripples through paradox space, creating new possibilities.",
            "The echoes of your choice resonate across the narrative threads.",
            "Reality shifts subtly in response to your will.",
            "The game takes note of your decision and adapts accordingly."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    generateGamzeeCommentary(choiceRecord) {
        const commentaries = [
            "interesting choice there, player. let's see where this miracle leads us :o)",
            "that's one way to shake up the narrative, i respect that approach",
            "the honk of destiny approves of your decision making skills",
            "now that's what i call playing the game with style!",
            "every choice is a miracle in its own special way"
        ];
        
        // Add context-specific commentary based on choice consequences
        if (choiceRecord.selectedOption.consequences?.reputation) {
            commentaries.push("looks like you're making friends... or enemies. either way, it's all miracles");
        }
        
        if (choiceRecord.selectedOption.consequences?.stats?.hp && 
            choiceRecord.selectedOption.consequences.stats.hp < 0) {
            commentaries.push("ouch, that's gonna leave a mark. but pain is just another miracle, right?");
        }
        
        return commentaries[Math.floor(Math.random() * commentaries.length)];
    }
    
    // Remove choice from UI after selection
    removeChoiceFromUI(choiceId) {
        const choiceElement = document.querySelector(`[data-choice-id="${choiceId}"]`);
        if (choiceElement) {
            choiceElement.style.opacity = '0.5';
            choiceElement.style.pointerEvents = 'none';
            
            // Add "CHOSEN" indicator
            const chosenIndicator = document.createElement('div');
            chosenIndicator.className = 'choice-chosen';
            chosenIndicator.textContent = 'CHOICE MADE';
            choiceElement.appendChild(chosenIndicator);
        }
    }
    
    // Trigger follow-up events based on choice
    triggerFollowUpEvents(choiceRecord) {
        const followUps = choiceRecord.selectedOption.followUp || [];
        
        followUps.forEach(followUp => {
            setTimeout(() => {
                this.executeFollowUpEvent(followUp, choiceRecord);
            }, followUp.delay || 1000);
        });
    }
    
    executeFollowUpEvent(followUp, originalChoice) {
        switch (followUp.type) {
            case 'new_choice':
                this.presentChoice(followUp.choiceId, followUp.choiceData);
                break;
            case 'narrative':
                uiManager.addToTerminal(followUp.text, 'narrative');
                break;
            case 'encounter':
                this.triggerEncounter(followUp.encounterId);
                break;
            case 'quest_update':
                this.updateQuest(followUp.questId, followUp.update);
                break;
        }
    }
    
    // Setup choice templates for different scenarios
    setupChoiceTemplates() {
        this.choiceTemplates = {
            // Session start choices
            sessionStart: {
                title: "Your SBURB Session Begins",
                description: "The game disc spins up and reality begins to shift. How do you approach this cosmic game?",
                options: [
                    {
                        text: "Embrace the chaos and dive in headfirst",
                        consequences: {
                            stats: { experience: 10 },
                            reputation: { echoes: 1 },
                            unlocks: ["chaos_path"]
                        },
                        response: "You leap into the unknown with wild abandon. The game responds to your fearless energy.",
                        followUp: [
                            {
                                type: "new_choice",
                                delay: 2000,
                                choiceId: "chaos_follow_up",
                                choiceData: "chaosPath"
                            }
                        ]
                    },
                    {
                        text: "Study the mechanics carefully before proceeding",
                        consequences: {
                            stats: { experience: 5 },
                            unlocks: ["knowledge_path"]
                        },
                        response: "Your methodical approach reveals hidden patterns in the game's structure.",
                        followUp: [
                            {
                                type: "narrative",
                                delay: 1500,
                                text: "The game appreciates your careful observation and reveals additional information."
                            }
                        ]
                    },
                    {
                        text: "Seek guidance from the echoes of past players",
                        consequences: {
                            reputation: { echoes: 2 },
                            unlocks: ["echo_path"]
                        },
                        response: "The whispers of previous players guide your first steps into the game.",
                        followUp: [
                            {
                                type: "encounter",
                                delay: 3000,
                                encounterId: "echo_mentor"
                            }
                        ]
                    }
                ]
            },
            
            // Land exploration choices
            landExploration: {
                title: "Exploring Your Land",
                description: "You stand before multiple paths leading deeper into your land. Each seems to promise different adventures.",
                options: [
                    {
                        text: "Follow the path toward the consort village",
                        consequences: {
                            reputation: { consorts: 2 },
                            unlocks: ["consort_friendship"]
                        },
                        response: "The consorts welcome you with curious chirps and helpful guidance."
                    },
                    {
                        text: "Venture toward the ominous spire in the distance",
                        consequences: {
                            stats: { experience: 15, hp: -10 },
                            unlocks: ["danger_zone"]
                        },
                        response: "The spire pulses with dangerous energy, but you gain valuable insights about your land."
                    },
                    {
                        text: "Search for hidden secrets in the terrain",
                        consequences: {
                            stats: { experience: 8 },
                            unlocks: ["secret_area"]
                        },
                        response: "Your careful exploration reveals a hidden cache of ancient artifacts."
                    }
                ]
            }
        };
    }
    
    // Get a choice template by name
    getChoiceTemplate(templateName, context = {}) {
        const template = this.choiceTemplates[templateName];
        if (!template) {
            console.error('Choice template not found:', templateName);
            return null;
        }
        
        // Apply context to template if needed
        return this.applyContextToTemplate(template, context);
    }
    
    applyContextToTemplate(template, context) {
        // Clone the template to avoid modifying the original
        const contextualTemplate = JSON.parse(JSON.stringify(template));
        
        // Apply context-specific modifications
        if (context.playerName) {
            contextualTemplate.description = contextualTemplate.description.replace(
                /\{playerName\}/g, 
                context.playerName
            );
        }
        
        if (context.landName) {
            contextualTemplate.description = contextualTemplate.description.replace(
                /\{landName\}/g, 
                context.landName
            );
        }
        
        return contextualTemplate;
    }
    
    // Check if player has made specific choices
    hasPlayerChosen(choiceId, optionIndex = null) {
        const choice = this.choiceHistory.find(c => c.choiceId === choiceId);
        if (!choice) return false;
        
        if (optionIndex !== null) {
            return choice.optionIndex === optionIndex;
        }
        
        return true;
    }
    
    // Get reputation with a faction
    getReputation(faction) {
        return this.worldState.reputation[faction] || 0;
    }
    
    // Check if a path is unlocked
    isPathUnlocked(pathName) {
        return this.worldState.unlockedPaths.has(pathName);
    }
    
    // Get world state changes
    getWorldChange(key) {
        return this.worldState.worldChanges.get(key);
    }
    
    // Generate dynamic choices based on current game state
    generateDynamicChoice(context) {
        const player = sburbCore.gameState.player;
        const currentLand = sburbCore.gameState.world.currentLand;
        
        // Example: Generate choices based on player level
        if (player.level >= 5 && !this.hasPlayerChosen('advanced_training')) {
            return {
                id: 'advanced_training',
                title: 'Advanced Training Opportunity',
                description: 'Your growing power attracts the attention of a mysterious mentor.',
                options: [
                    {
                        text: 'Accept the challenging training',
                        consequences: {
                            stats: { experience: 50, hp: -20 },
                            unlocks: ['advanced_abilities']
                        }
                    },
                    {
                        text: 'Politely decline and continue on your own',
                        consequences: {
                            stats: { experience: 10 }
                        }
                    }
                ]
            };
        }
        
        return null;
    }
    
    // Save choice system state
    saveState() {
        return {
            choiceHistory: this.choiceHistory,
            worldState: this.worldState,
            consequences: Array.from(this.consequences.entries())
        };
    }
    
    // Load choice system state
    loadState(state) {
        if (state) {
            this.choiceHistory = state.choiceHistory || [];
            this.worldState = state.worldState || this.worldState;
            this.consequences = new Map(state.consequences || []);
        }
    }
}

// Initialize the choice system
const choiceSystem = new ChoiceSystem();
window.choiceSystem = choiceSystem;
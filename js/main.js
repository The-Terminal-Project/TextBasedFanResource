// SBURB.PRIME Main Application Controller
class SburbApplication {
    constructor() {
        this.version = '2.0.1';
        this.initialized = false;
        this.systems = {};
        this.initializationOrder = [
            'core',
            'markov',
            'echo',
            'land',
            'commands',
            'ui'
        ];
        
        this.init();
    }
    
    async init() {
        console.log(`Initializing SBURB.PRIME v${this.version}...`);
        
        try {
            // Wait for DOM to be ready
            await this.waitForDOM();
            
            // Initialize systems in order
            await this.initializeSystems();
            
            // Setup global event listeners
            this.setupGlobalEventListeners();
            
            // Start periodic processes
            this.startPeriodicProcesses();
            
            // Mark as initialized
            this.initialized = true;
            
            console.log('SBURB.PRIME initialization complete!');
            this.showWelcomeMessage();
            
        } catch (error) {
            console.error('SBURB.PRIME initialization failed:', error);
            this.handleInitializationError(error);
        }
    }
    
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }
    
    async initializeSystems() {
        console.log('Initializing core systems...');
        
        // Wait for all systems to initialize
        const initPromises = [];
        
        // Core system should already be initialized
        this.systems.core = window.sburbCore;
        
        // Wait for other systems to initialize
        this.systems.markov = window.markovEngine;
        this.systems.echo = window.echoSystem;
        this.systems.land = window.landSystem;
        this.systems.commands = window.commandSystem;
        this.systems.ui = window.uiManager;
        
        // Wait for all systems to be ready
        await this.waitForSystemsReady();
        
        console.log('All systems initialized successfully');
    }
    
    async waitForSystemsReady() {
        const maxWaitTime = 10000; // 10 seconds
        const checkInterval = 100; // 100ms
        let elapsedTime = 0;
        
        return new Promise((resolve, reject) => {
            const checkSystems = () => {
                const allReady = Object.values(this.systems).every(system => 
                    system && system.initialized
                );
                
                if (allReady) {
                    resolve();
                } else if (elapsedTime >= maxWaitTime) {
                    reject(new Error('System initialization timeout'));
                } else {
                    elapsedTime += checkInterval;
                    setTimeout(checkSystems, checkInterval);
                }
            };
            
            checkSystems();
        });
    }
    
    setupGlobalEventListeners() {
        // Handle window events
        window.addEventListener('beforeunload', () => {
            if (this.systems.core) {
                this.systems.core.saveGame();
            }
        });
        
        // Handle errors
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleRuntimeError(event.error);
        });
        
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleRuntimeError(event.reason);
        });
        
        // Handle visibility changes (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Tab is hidden, save game
                if (this.systems.core) {
                    this.systems.core.saveGame();
                }
            } else {
                // Tab is visible, check for updates
                this.onTabVisible();
            }
        });
        
        // Handle keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            this.handleGlobalKeyboard(event);
        });
    }
    
    startPeriodicProcesses() {
        // Start UI periodic updates
        if (this.systems.ui && this.systems.ui.startPeriodicUpdates) {
            this.systems.ui.startPeriodicUpdates();
        }
        
        // Auto-save every 30 seconds (handled by core system)
        // Periodic cleanup every 5 minutes
        setInterval(() => {
            this.performPeriodicCleanup();
        }, 5 * 60 * 1000);
        
        // System health check every minute
        setInterval(() => {
            this.performHealthCheck();
        }, 60 * 1000);
    }
    
    showWelcomeMessage() {
        if (this.systems.ui && this.systems.ui.addToTerminal) {
            const welcomeMessages = [
                '',
                '═══════════════════════════════════════════════════════════════',
                '  SBURB.PRIME v2.0.1 - TERMINAL SIMULATION INITIALIZED',
                '  All systems online. Paradox space awaits your commands.',
                '═══════════════════════════════════════════════════════════════',
                ''
            ];
            
            welcomeMessages.forEach((message, index) => {
                setTimeout(() => {
                    this.systems.ui.addToTerminal(message, 'response-text');
                }, index * 200);
            });
            
            // Check if there's a saved session
            setTimeout(() => {
                this.checkSavedSession();
            }, welcomeMessages.length * 200 + 500);
        }
    }
    
    checkSavedSession() {
        if (!this.systems.core) return;
        
        const session = this.systems.core.getSession();
        const player = this.systems.core.getPlayer();
        
        if (session.active && player.name) {
            this.systems.ui.addToTerminal(
                `> GAMZEE H: welcome back, ${player.name}! your session continues...`,
                'response-text'
            );
            
            // Update UI with loaded data
            this.systems.ui.updatePlayerName(player.name);
            if (player.classpect) this.systems.ui.updatePlayerClasspect(player.classpect);
            if (player.lunarSway) this.systems.ui.updatePlayerLunar(player.lunarSway);
            this.systems.ui.updateSessionStatus(true, session.id);
            
            // Update land info if available
            const currentLandId = this.systems.core.getWorld().currentLand;
            if (currentLandId) {
                const land = this.systems.land.getLandById(currentLandId);
                if (land) {
                    this.systems.ui.updateLandInfo(land);
                }
            }
            
            // Update echo list
            this.systems.ui.updateEchoList();
            this.systems.ui.updateEchoCount();
        } else {
            this.systems.ui.addToTerminal(
                '> GAMZEE H: new to the cosmic dance? type "help" to see your options, or "begin" to start your session',
                'response-text'
            );
        }
    }
    
    handleGlobalKeyboard(event) {
        // Ctrl+S: Save game
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            if (this.systems.core) {
                this.systems.core.saveGame();
                if (this.systems.ui) {
                    this.systems.ui.showNotification('Game saved!', 'success');
                }
            }
        }
        
        // Ctrl+L: Clear terminal
        if (event.ctrlKey && event.key === 'l') {
            event.preventDefault();
            if (this.systems.ui) {
                this.systems.ui.clearTerminal();
            }
        }
        
        // F1: Help
        if (event.key === 'F1') {
            event.preventDefault();
            if (this.systems.ui) {
                this.systems.ui.executeCommand('help');
            }
        }
        
        // Escape: Close modals
        if (event.key === 'Escape') {
            const modals = document.querySelectorAll('.modal:not(.hidden)');
            modals.forEach(modal => {
                modal.classList.add('hidden');
            });
        }
    }
    
    onTabVisible() {
        // Refresh UI when tab becomes visible
        if (this.systems.ui) {
            this.systems.ui.updateEchoList();
            this.systems.ui.updateEchoCount();
        }
    }
    
    performPeriodicCleanup() {
        console.log('Performing periodic cleanup...');
        
        // Clean up old command history
        if (this.systems.commands && this.systems.commands.commandHistory) {
            const maxHistory = 1000;
            if (this.systems.commands.commandHistory.length > maxHistory) {
                this.systems.commands.commandHistory.splice(0, 
                    this.systems.commands.commandHistory.length - maxHistory);
            }
        }
        
        // Clean up old narrative context
        if (this.systems.markov && this.systems.markov.contextMemory) {
            const maxContext = 50;
            if (this.systems.markov.contextMemory.length > maxContext) {
                this.systems.markov.contextMemory.splice(0,
                    this.systems.markov.contextMemory.length - maxContext);
            }
        }
        
        // Trigger garbage collection if available
        if (window.gc) {
            window.gc();
        }
    }
    
    performHealthCheck() {
        const issues = [];
        
        // Check system health
        Object.entries(this.systems).forEach(([name, system]) => {
            if (!system || !system.initialized) {
                issues.push(`System ${name} is not properly initialized`);
            }
        });
        
        // Check memory usage (if available)
        if (performance.memory) {
            const memUsage = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
            if (memUsage > 0.9) {
                issues.push('High memory usage detected');
            }
        }
        
        // Check for DOM issues
        const criticalElements = [
            'terminal-output',
            'command-input',
            'player-name',
            'session-status'
        ];
        
        criticalElements.forEach(id => {
            if (!document.getElementById(id)) {
                issues.push(`Critical DOM element ${id} missing`);
            }
        });
        
        if (issues.length > 0) {
            console.warn('Health check issues:', issues);
            
            // Try to recover from some issues
            this.attemptRecovery(issues);
        }
    }
    
    attemptRecovery(issues) {
        console.log('Attempting system recovery...');
        
        // Try to reinitialize systems that failed
        issues.forEach(issue => {
            if (issue.includes('not properly initialized')) {
                const systemName = issue.match(/System (\w+)/)?.[1];
                if (systemName && this.systems[systemName]) {
                    console.log(`Attempting to reinitialize ${systemName}...`);
                    if (this.systems[systemName].init) {
                        this.systems[systemName].init();
                    }
                }
            }
        });
        
        // Notify user if UI is available
        if (this.systems.ui && this.systems.ui.showNotification) {
            this.systems.ui.showNotification(
                'System recovery attempted. Some features may need refresh.',
                'warning',
                5000
            );
        }
    }
    
    handleInitializationError(error) {
        console.error('Initialization error:', error);
        
        // Show error message in DOM if possible
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--error-color);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10000;
            text-align: center;
            font-family: 'Courier Prime', monospace;
        `;
        
        errorDiv.innerHTML = `
            <h2>SBURB.PRIME Initialization Failed</h2>
            <p>Error: ${error.message}</p>
            <p>Please refresh the page to try again.</p>
            <button onclick="location.reload()" style="
                background: white;
                color: var(--error-color);
                border: none;
                padding: 10px 20px;
                margin-top: 10px;
                border-radius: 5px;
                cursor: pointer;
                font-family: inherit;
            ">Refresh Page</button>
        `;
        
        document.body.appendChild(errorDiv);
    }
    
    handleRuntimeError(error) {
        console.error('Runtime error:', error);
        
        // Show notification if UI is available
        if (this.systems.ui && this.systems.ui.showNotification) {
            this.systems.ui.showNotification(
                'A cosmic anomaly occurred. Check console for details.',
                'error',
                5000
            );
        }
        
        // Log to Book of Numbers if core is available
        if (this.systems.core && this.systems.core.addBookEntry) {
            this.systems.core.addBookEntry(
                'System Error',
                `Runtime error occurred: ${error.message}`,
                'error'
            );
        }
    }
    
    // Public API methods
    getSystemStatus() {
        const status = {
            version: this.version,
            initialized: this.initialized,
            systems: {}
        };
        
        Object.entries(this.systems).forEach(([name, system]) => {
            status.systems[name] = {
                available: !!system,
                initialized: system ? system.initialized : false
            };
        });
        
        return status;
    }
    
    restart() {
        console.log('Restarting SBURB.PRIME...');
        
        // Save current state
        if (this.systems.core) {
            this.systems.core.saveGame();
        }
        
        // Reload the page
        location.reload();
    }
    
    exportDebugInfo() {
        const debugInfo = {
            version: this.version,
            timestamp: Date.now(),
            systemStatus: this.getSystemStatus(),
            gameState: this.systems.core ? this.systems.core.debug() : null,
            commandHistory: this.systems.commands ? this.systems.commands.commandHistory.slice(-50) : null,
            errorLog: this.errorLog || []
        };
        
        const dataStr = JSON.stringify(debugInfo, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `sburb_prime_debug_${Date.now()}.json`;
        link.click();
    }
}

// Initialize the application when the script loads
console.log('Loading SBURB.PRIME...');
window.sburbApp = new SburbApplication();

// Expose global functions for debugging
window.SBURB = {
    version: '2.0.1',
    app: window.sburbApp,
    core: window.sburbCore,
    markov: window.markovEngine,
    echo: window.echoSystem,
    land: window.landSystem,
    commands: window.commandSystem,
    ui: window.uiManager,
    
    // Utility functions
    status: () => window.sburbApp.getSystemStatus(),
    restart: () => window.sburbApp.restart(),
    debug: () => window.sburbApp.exportDebugInfo(),
    save: () => window.sburbCore.saveGame(),
    load: () => window.sburbCore.loadGame(),
    reset: () => window.sburbCore.resetGame()
};

console.log('SBURB.PRIME loaded. Access via window.SBURB object.');
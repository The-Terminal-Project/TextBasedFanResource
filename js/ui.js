// UI Management System - Terminal Interface Controller
class UIManager {
    constructor() {
        this.terminalOutput = null;
        this.commandInput = null;
        this.playerInfo = {};
        this.landInfo = {};
        this.echoList = null;
        this.initialized = false;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupUI());
        } else {
            this.setupUI();
        }
    }
    
    setupUI() {
        console.log('Initializing UI Manager...');
        
        // Get DOM elements
        this.terminalOutput = document.getElementById('terminal-output');
        this.commandInput = document.getElementById('command-input');
        
        // Player info elements
        this.playerInfo = {
            name: document.getElementById('player-name'),
            classpect: document.getElementById('player-classpect'),
            lunar: document.getElementById('player-lunar'),
            hp: document.getElementById('player-hp'),
            level: document.getElementById('player-level')
        };
        
        // Land info elements
        this.landInfo = {
            name: document.getElementById('land-name'),
            theme: document.getElementById('land-theme'),
            consorts: document.getElementById('land-consorts'),
            map: document.getElementById('land-map')
        };
        
        // Other UI elements
        this.echoList = document.getElementById('echo-list');
        this.sessionStatus = document.getElementById('session-status');
        this.echoCount = document.getElementById('echo-count');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup core event listeners
        this.setupCoreEventListeners();
        
        this.initialized = true;
        console.log('UI Manager initialized');
    }
    
    setupEventListeners() {
        // Command input handling
        if (this.commandInput) {
            this.commandInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.handleCommand();
                }
            });
            
            // Focus input on page load
            this.commandInput.focus();
        }
        
        // Terminal controls
        const clearBtn = document.getElementById('clear-terminal');
        const saveBtn = document.getElementById('save-session');
        const loadBtn = document.getElementById('load-session');
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearTerminal());
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.executeCommand('save'));
        }
        
        if (loadBtn) {
            loadBtn.addEventListener('click', () => this.executeCommand('load'));
        }
        
        // Keep input focused
        document.addEventListener('click', () => {
            if (this.commandInput) {
                this.commandInput.focus();
            }
        });
    }
    
    setupCoreEventListeners() {
        // Listen to core game events
        if (window.sburbCore) {
            sburbCore.on('player:name_set', (name) => this.updatePlayerName(name));
            sburbCore.on('player:classpect_set', (classpect) => this.updatePlayerClasspect(classpect));
            sburbCore.on('player:lunar_sway_set', (sway) => this.updatePlayerLunar(sway));
            sburbCore.on('session:started', (session) => this.updateSessionStatus(true, session.id));
            sburbCore.on('land:current_changed', (land) => this.updateLandInfo(land));
            sburbCore.on('echo:activated', (echo) => this.updateEchoList());
            sburbCore.on('echo:deactivated', (echo) => this.updateEchoList());
            sburbCore.on('echo:generated', (echo) => this.updateEchoCount());
        }
    }
    
    handleCommand() {
        const input = this.commandInput.value.trim();
        if (!input) return;
        
        // Clear input
        this.commandInput.value = '';
        
        // Display command in terminal
        this.addToTerminal(`> ${input}`, 'command-line');
        
        // Process command
        if (window.commandSystem && commandSystem.initialized) {
            const response = commandSystem.processCommand(input);
            this.addToTerminal(response.message, this.getResponseClass(response.type));
        } else {
            this.addToTerminal('> GAMZEE H: hold on there, the cosmic machinery is still warming up', 'warning-text');
        }
        
        // Scroll to bottom
        this.scrollToBottom();
    }
    
    executeCommand(command) {
        if (window.commandSystem && commandSystem.initialized) {
            const response = commandSystem.processCommand(command);
            this.addToTerminal(`> ${command}`, 'command-line');
            this.addToTerminal(response.message, this.getResponseClass(response.type));
            this.scrollToBottom();
        }
    }
    
    addToTerminal(message, className = 'response-text') {
        if (!this.terminalOutput) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = className;
        messageElement.textContent = message;
        
        // Handle multiline messages
        if (message.includes('\n')) {
            messageElement.innerHTML = message.split('\n').map(line => 
                `<div>${this.escapeHtml(line)}</div>`
            ).join('');
        }
        
        this.terminalOutput.appendChild(messageElement);
        
        // Limit terminal history
        const maxMessages = 1000;
        while (this.terminalOutput.children.length > maxMessages) {
            this.terminalOutput.removeChild(this.terminalOutput.firstChild);
        }
    }
    
    clearTerminal() {
        if (this.terminalOutput) {
            // Keep the startup message
            const startupMessage = this.terminalOutput.querySelector('.startup-message');
            this.terminalOutput.innerHTML = '';
            if (startupMessage) {
                this.terminalOutput.appendChild(startupMessage);
            }
        }
        
        this.addToTerminal('> GAMZEE H: terminal cleared, fresh slate for fresh miracles', 'response-text');
    }
    
    scrollToBottom() {
        if (this.terminalOutput) {
            this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
        }
    }
    
    getResponseClass(type) {
        const classMap = {
            'success': 'response-text',
            'error': 'error-text',
            'warning': 'warning-text',
            'info': 'response-text'
        };
        
        return classMap[type] || 'response-text';
    }
    
    // Player info updates
    updatePlayerName(name) {
        if (this.playerInfo.name) {
            this.playerInfo.name.textContent = name;
        }
    }
    
    updatePlayerClasspect(classpect) {
        if (this.playerInfo.classpect) {
            this.playerInfo.classpect.textContent = classpect;
        }
    }
    
    updatePlayerLunar(sway) {
        if (this.playerInfo.lunar) {
            this.playerInfo.lunar.textContent = sway;
        }
    }
    
    updatePlayerHP(hp, maxHp) {
        if (this.playerInfo.hp) {
            this.playerInfo.hp.textContent = `${hp}/${maxHp}`;
        }
    }
    
    updatePlayerLevel(level) {
        if (this.playerInfo.level) {
            this.playerInfo.level.textContent = level;
        }
    }
    
    // Session status updates
    updateSessionStatus(active, sessionId = null) {
        if (this.sessionStatus) {
            if (active) {
                this.sessionStatus.textContent = `SESSION: ACTIVE${sessionId ? ` (${sessionId})` : ''}`;
                this.sessionStatus.style.color = 'var(--accent-color)';
            } else {
                this.sessionStatus.textContent = 'SESSION: INACTIVE';
                this.sessionStatus.style.color = 'var(--warning-color)';
            }
        }
    }
    
    // Land info updates
    updateLandInfo(land) {
        if (this.landInfo.name) {
            this.landInfo.name.textContent = land.name;
        }
        
        if (this.landInfo.theme) {
            this.landInfo.theme.textContent = land.themes.join(', ');
        }
        
        if (this.landInfo.consorts) {
            this.landInfo.consorts.textContent = land.consorts.map(c => c.name).join(', ');
        }
        
        if (this.landInfo.map && land.asciiMap) {
            // Show a small section of the map
            const mapSection = this.getMapPreview(land.asciiMap);
            this.landInfo.map.textContent = mapSection;
        }
    }
    
    getMapPreview(fullMap, size = 10) {
        const lines = fullMap.split('\n');
        const centerY = Math.floor(lines.length / 2);
        const centerX = Math.floor((lines[0] || '').length / 2);
        
        const preview = [];
        for (let y = Math.max(0, centerY - size/2); 
             y < Math.min(lines.length, centerY + size/2); y++) {
            if (lines[y]) {
                const line = lines[y].substring(
                    Math.max(0, centerX - size),
                    Math.min(lines[y].length, centerX + size)
                );
                preview.push(line);
            }
        }
        
        return preview.join('\n');
    }
    
    // Echo management
    updateEchoList() {
        if (!this.echoList || !window.echoSystem) return;
        
        const activeEchoes = echoSystem.getActiveEchoes();
        
        if (activeEchoes.length === 0) {
            this.echoList.innerHTML = '<p class="no-echoes">No active echoes</p>';
            return;
        }
        
        this.echoList.innerHTML = '';
        
        activeEchoes.forEach(echo => {
            const echoElement = document.createElement('div');
            echoElement.className = 'echo-item';
            echoElement.innerHTML = `
                <div class="echo-name">${echo.name}</div>
                <div class="echo-type">${echo.type}</div>
                <div class="echo-power">Power: ${echo.power}</div>
            `;
            
            echoElement.addEventListener('click', () => {
                this.showEchoDetails(echo);
            });
            
            this.echoList.appendChild(echoElement);
        });
    }
    
    updateEchoCount() {
        if (this.echoCount && window.echoSystem) {
            const totalEchoes = echoSystem.getAllEchoes().length;
            this.echoCount.textContent = `ECHOES: ${totalEchoes}`;
        }
    }
    
    showEchoDetails(echo) {
        const modal = document.getElementById('echo-modal');
        const details = document.getElementById('echo-details');
        
        if (modal && details) {
            const cooldownRemaining = echoSystem.getCooldownRemaining(echo.id);
            const cooldownText = cooldownRemaining > 0 ? 
                `(Cooldown: ${cooldownRemaining} turns)` : '';
            
            details.innerHTML = `
                <h3>${echo.name}</h3>
                <p><strong>Type:</strong> ${echo.type}</p>
                <p><strong>Power:</strong> ${echo.power}</p>
                <p><strong>Description:</strong> ${echo.description}</p>
                <p><strong>Commands:</strong> ${echo.commands.join(', ')}</p>
                <p><strong>Classpect Affinity:</strong> ${echo.classpectAffinity.join(', ') || 'None'}</p>
                ${cooldownText ? `<p><strong>Status:</strong> ${cooldownText}</p>` : ''}
            `;
            
            modal.classList.remove('hidden');
        }
    }
    
    // Modal management
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }
    
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }
    
    // Book of Numbers
    showBookOfNumbers() {
        const modal = document.getElementById('book-modal');
        const content = document.getElementById('book-content');
        
        if (modal && content && window.sburbCore) {
            const bookEntries = sburbCore.getNarrative().bookOfNumbers;
            
            if (bookEntries.length === 0) {
                content.innerHTML = '<p>The Book of Numbers is empty. Your story awaits...</p>';
            } else {
                const entriesHtml = bookEntries.map(entry => `
                    <div class="book-entry">
                        <h4>${entry.title}</h4>
                        <p class="book-timestamp">${new Date(entry.timestamp).toLocaleString()}</p>
                        <p>${entry.content}</p>
                        <span class="book-type">[${entry.type.toUpperCase()}]</span>
                    </div>
                `).join('');
                
                content.innerHTML = entriesHtml;
            }
            
            modal.classList.remove('hidden');
        }
    }
    
    // Utility functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    formatTimestamp(timestamp) {
        return new Date(timestamp).toLocaleTimeString();
    }
    
    // Animation helpers
    typewriterEffect(element, text, speed = 50) {
        element.textContent = '';
        let i = 0;
        
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, speed);
    }
    
    glowEffect(element, duration = 2000) {
        element.classList.add('glow-text');
        setTimeout(() => {
            element.classList.remove('glow-text');
        }, duration);
    }
    
    // Periodic updates
    startPeriodicUpdates() {
        // Update player stats every 5 seconds
        setInterval(() => {
            if (window.sburbCore) {
                const player = sburbCore.getPlayer();
                this.updatePlayerHP(player.hp, player.maxHp);
                this.updatePlayerLevel(player.level);
            }
        }, 5000);
        
        // Update echo cooldowns every second
        setInterval(() => {
            this.updateEchoList();
        }, 1000);
    }
    
    // Notification system
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--secondary-bg);
            border: 1px solid var(--accent-color);
            color: var(--text-primary);
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Fade in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Fade out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
}

// Global UI functions for HTML onclick handlers
window.executeCommand = function(command) {
    if (window.uiManager) {
        uiManager.executeCommand(command);
    }
};

window.closeModal = function(modalId) {
    if (window.uiManager) {
        uiManager.hideModal(modalId);
    }
};

window.showBookOfNumbers = function() {
    if (window.uiManager) {
        uiManager.showBookOfNumbers();
    }
};

// Initialize global UI manager
window.uiManager = new UIManager();
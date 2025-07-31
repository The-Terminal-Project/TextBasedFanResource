# SBURB.PRIME - Terminal Simulation v2.0.1

A comprehensive text-based simulation inspired by Homestuck's SBURB game mechanics, featuring advanced narrative generation, procedural content creation, and an immersive terminal interface guided by Gamzee H (The First Mate).

## 🎮 Features

### Core Systems
- **LocalStorage Save System** - Persistent game state across sessions
- **L.A.S.T. Markov Engine** - Advanced narrative generation with Hussie Codex patterns
- **Echo System** - Core, Fan, and Developer echoes with command-triggered powers
- **Procedural Land Generation** - ASCII-mapped worlds based on player interests
- **Interactive Terminal** - Full command-line interface with Gamzee H narrator
- **Book of Numbers** - Persistent event logging and lore archive

### Gameplay Elements
- **Classpect System** - 12 classes × 12 aspects with unique descriptions
- **Lunar Sway** - Prospit/Derse dreamer mechanics
- **Land Exploration** - Procedural quests with consort species
- **Echo Management** - Activate and use supernatural abilities
- **Session Management** - Full SBURB session simulation

## 🚀 Getting Started

1. Open `index.html` in a modern web browser
2. Wait for all systems to initialize
3. Type `help` to see available commands
4. Type `begin` to start your SBURB session
5. Set your name with `name [your name]`
6. Discover your classpect with `classpect`
7. Explore your land with `explore` and `map`

## 📋 Commands

### Session Management
- `begin` - Start your SBURB session
- `name [name]` - Set your player name
- `classpect [class] [aspect]` - Set or discover your classpect
- `lunar` - Determine your lunar sway (Prospit/Derse)

### Exploration
- `look` - Examine your surroundings
- `explore [area]` - Explore areas of your land
- `map` - View ASCII map of your land
- `go [location]` - Attempt to travel

### Player Status
- `status` - Check your current status
- `inventory` - View your items
- `level` - Check experience and level

### Echo Management
- `echoes` - List active echoes
- `generate [type]` - Generate new echoes (fan/developer/temporal)
- `activate [echo_id]` - Activate an echo
- `deactivate [echo_id]` - Deactivate an echo

### Land & Quests
- `land` - Get information about your current land
- `quest` - Check quest progress
- `consorts` - Interact with consort species

### Narrative
- `story [theme]` - Generate narrative content
- `book` - Access the Book of Numbers
- `lore [topic]` - Access lore information

### System
- `help [command]` - Show help information
- `save` - Save your game
- `load` - Load your game
- `debug` - Access debug information

## 🎭 Echo System

Echoes are supernatural abilities that can be activated and used:

### Core Echoes
- **Alchemical Synthesis** - Combine items
- **Strife Engagement** - Enter combat
- **Dimensional Exploration** - Discover secrets
- **Sprite Prototyping** - Prototype kernelsprites
- **Temporal Manipulation** - Control time (Time aspect)
- **Spatial Distortion** - Bend space (Space aspect)

### Fan Echoes
- **Narrative Intervention** - Influence story outcomes
- **Character Summon** - Invoke beloved characters
- **Meme Reality** - Make fan theories real

### Developer Echoes
- **Debug Console** - Access system information
- **State Manipulation** - Modify game variables
- **Narrative Override** - Control story generation

## 🗺️ Land Generation

Lands are procedurally generated based on:
- **Player Interests** - Hobbies and dreams influence themes
- **Terrain Types** - Unique ASCII-mapped environments
- **Consort Species** - Interactive NPCs with specialties
- **Quest Systems** - Multi-objective challenges
- **Denizen Encounters** - Powerful land rulers

### Available Land Themes
- Clockwork and Melody
- Frost and Frogs
- Heat and Clockwork
- Light and Rain
- Wind and Shade
- Pulse and Haze

## 🧠 L.A.S.T. Markov Engine

The Language Analysis and Synthesis Technology generates contextual narratives using:
- **Hussie Codex** - Core narrative patterns
- **Template System** - Structured story generation
- **Context Memory** - Maintains narrative continuity
- **Weighted Random** - Balanced content selection

## 💾 Save System

Game state is automatically saved:
- Every 30 seconds (auto-save)
- On command execution
- When tab loses focus
- Before page unload

Manual save with `save` command or Ctrl+S.

## 🎯 Keyboard Shortcuts

- **Ctrl+S** - Save game
- **Ctrl+L** - Clear terminal
- **F1** - Show help
- **Escape** - Close modals
- **Enter** - Execute command

## 🔧 Technical Details

### Architecture
- **Modular Design** - Separate systems for each major component
- **Event-Driven** - Systems communicate via events
- **Error Handling** - Comprehensive error recovery
- **Performance** - Optimized for smooth operation

### Browser Compatibility
- Modern browsers with ES6+ support
- LocalStorage support required
- Tested on Chrome, Firefox, Safari, Edge

### File Structure
```
├── index.html          # Main interface
├── styles.css          # Terminal styling
├── js/
│   ├── core.js         # Game state management
│   ├── markov.js       # Narrative generation
│   ├── echo.js         # Echo system
│   ├── land.js         # Land generation
│   ├── commands.js     # Command processing
│   ├── ui.js           # Interface management
│   └── main.js         # Application controller
```

## 🎪 Easter Eggs & Secrets

- Hidden meta-locations (Office of Paradoxes, The Grey)
- Secret echo call files
- Archive 413 lore fragments
- Developer commands
- Narrative easter eggs

## 🐛 Debugging

Access debug information:
- `debug` command for system status
- `window.SBURB` object for direct access
- Browser console for detailed logs
- Export debug data with `window.SBURB.debug()`

## 📚 Lore Integration

Based on Homestuck universe concepts:
- Canonical classpect mechanics
- SBURB session structure
- Paradox space terminology
- Character references (Gamzee H narrator)
- Fan community elements

## 🚧 Future Development

Planned features:
- Strife mechanics implementation
- Advanced meta-locations
- SBURB entry sequences
- ACT NULL endgame scenarios
- NEOQUEST awakening protocol
- Discord/Reddit integration

## 📄 License

This is a fan project inspired by Homestuck. Not affiliated with Andrew Hussie or official Homestuck properties.

---

**> GAMZEE H: welcome to the grand performance, player. the miracles never end in paradox space :o)**

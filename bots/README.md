# Bot Configurations

This folder contains bot-specific configurations and assets organized by client/bot name.

## Structure

Each bot has its own folder containing:
- Configuration files (`config.*.json`)
- Assistant instructions (`.md` files)
- Bot-specific assets (logos, images)
- Setup documentation

## Available Bots

### groenvastbouw
- **Config**: `config.groenvastbouw.json`
- **Logo**: `groenvastbouw-logo.png`
- **Instructions**: `ASSISTANT_INSTRUCTIONS_GROENVASTBOUW.md`
- **Setup Guide**: `GROENVASTBOUW_SETUP.md`

### chatbot-website
- **Config**: `config.json` (default)
- **Demo Config**: `config.demo.json`
- **Chatmate Config**: `config.chatmate.json`
- **Logo**: `chatbot-logo.png`

## Usage

To use a specific bot configuration, reference the config file path:

```html
<script src="chatbot.js" data-config="bots/groenvastbouw/config.groenvastbouw.json"></script>
```

## Backward Compatibility

Symlinks are maintained in the root directory for backward compatibility:
- `config.groenvastbouw.json` → `bots/groenvastbouw/config.groenvastbouw.json`
- `config.json` → `bots/chatbot-website/config.json`
- `groenvastbouw-logo.png` → `bots/groenvastbouw/groenvastbouw-logo.png`
- `chatbot-logo.png` → `bots/chatbot-website/chatbot-logo.png`

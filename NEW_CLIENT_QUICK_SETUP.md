# Quick Setup: New Client Config with Claude Code

## Copy-Paste This Prompt to Claude Code

```
Create a new config file for my client with these details:

CLIENT INFO:
- Client ID: [clientname] (lowercase, no spaces)
- Company Name: [Full Company Name]
- Website: [https://client.com]

BRANDING:
- Primary Color: [#HEX]
- Secondary Color: [#HEX]
- Logo URL: [https://client.com/logo.png]

CONTACT:
- Email: [contact@client.com]
- WhatsApp: [+31612345678]

LANGUAGE:
- Default Language: [nl or en]
- Show Language Selector: [yes/no]

WELCOME MESSAGE:
- [Write the welcome message or use "..."]

BUSINESS HOURS:
- Start: [09:00]
- End: [17:00]
- Days: [1,2,3,4,5] (1=Monday, 0=Sunday)
- Timezone: [Europe/Amsterdam]

Use config.template.json as the base and create config.[clientname].json
```

## Example Usage

**Input:**
```
Create a new config file for my client with these details:

CLIENT INFO:
- Client ID: techstartup
- Company Name: TechStartup Inc
- Website: https://techstartup.io

BRANDING:
- Primary Color: #7C3AED
- Secondary Color: #5B21B6
- Logo URL: https://techstartup.io/logo.png

CONTACT:
- Email: hello@techstartup.io
- WhatsApp: +31687654321

LANGUAGE:
- Default Language: en
- Show Language Selector: yes

WELCOME MESSAGE:
- ...

BUSINESS HOURS:
- Start: 09:00
- End: 18:00
- Days: [1,2,3,4,5]
- Timezone: Europe/Amsterdam
```

**Output:** Claude Code creates `config.techstartup.json` ready to use!

## After Creating Config

Claude Code will:
1. ✅ Create the config file
2. ✅ Commit to git
3. ✅ Push to GitHub
4. Ask if you want to redeploy to Vercel

Then you just:
1. Create OpenAI Assistant (20 min)
2. Set up Make.com webhook (30 min)
3. Add Vercel env vars (5 min)

**Total time: ~1 hour instead of 2-3 hours!** 🚀

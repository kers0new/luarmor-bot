const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const express = require('express');
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Keep-alive server
const app = express();
app.get('/', (req, res) => res.send('Bot is alive!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Minimal DB
let db = { keys: [], users: [], scripts: [] };
if (fs.existsSync('./db.json')) db = JSON.parse(fs.readFileSync('./db.json'));

function saveDB() { fs.writeFileSync('./db.json', JSON.stringify(db, null, 2)); }

// Ready
client.once('ready', () => console.log(`Logged in as ${client.user.tag}`));

// Interaction handler
client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    const name = interaction.commandName;

    if (name === 'mypanel') {
      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setCustomId('get_script').setLabel('Get Script').setStyle(ButtonStyle.Primary),
          new ButtonBuilder().setCustomId('redeem_key').setLabel('Redeem Key').setStyle(ButtonStyle.Success),
          new ButtonBuilder().setCustomId('generate_script').setLabel('Generate Script').setStyle(ButtonStyle.Secondary)
        );
      await interaction.reply({ content: 'Luarmor Panel:', components: [row], ephemeral: true });
    }

    // Handle other commands (you can expand with keys/scripts here)
  }

  if (interaction.isButton()) {
    if (interaction.customId === 'get_script') interaction.reply('Use `/getscript` to fetch a script!');
    if (interaction.customId === 'redeem_key') interaction.reply('Use `/redeemkey` to redeem a key!');
    if (interaction.customId === 'generate_script') interaction.reply('Use `/genscript` to generate a script!');
  }
});
// Login
client.login(process.env.TOKEN);

const commands = [
  // … all your other commands
  new SlashCommandBuilder().setName('generatekey').setDescription('Generate a Luarmor key'),
  new SlashCommandBuilder().setName('redeemkey').setDescription('Redeem a key').addStringOption(opt => opt.setName('key').setDescription('Enter key').setRequired(true)),
  new SlashCommandBuilder().setName('mypanel').setDescription('Open Luarmor panel'),
  
  // ✅ Add this at the end:
  new SlashCommandBuilder()
    .setName('resethwid')
    .setDescription('Reset HWID for a user (admin only)')
    .addUserOption(option => 
      option.setName('user')
            .setDescription('The user to reset HWID for')
            .setRequired(true)
    )
].map(cmd => cmd.toJSON());

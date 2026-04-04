const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const express = require('express');
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Keep-alive server for Render
const app = express();
app.get('/', (req, res) => res.send('Bot is alive!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Minimal DB
let db = { keys: [], users: [], scripts: [], admins: [] };
if (fs.existsSync('./db.json')) db = JSON.parse(fs.readFileSync('./db.json'));
function saveDB() { fs.writeFileSync('./db.json', JSON.stringify(db, null, 2)); }

// Commands
const commands = [
  new SlashCommandBuilder().setName('generatekey').setDescription('Generate a Luarmor key'),
  new SlashCommandBuilder().setName('redeemkey').setDescription('Redeem a key').addStringOption(opt => opt.setName('key').setDescription('Enter key').setRequired(true)),
  new SlashCommandBuilder().setName('mypanel').setDescription('Open Luarmor panel'),
  new SlashCommandBuilder().setName('mykeys').setDescription('List your redeemed keys'),
  new SlashCommandBuilder().setName('myscripts').setDescription('List your scripts'),
  new SlashCommandBuilder().setName('getscript').setDescription('Get a script').addStringOption(opt => opt.setName('name').setDescription('Script name').setRequired(true)),
  new SlashCommandBuilder().setName('addscript').setDescription('Add a script (admin)').addStringOption(opt => opt.setName('name').setDescription('Script name').setRequired(true)).addStringOption(opt => opt.setName('link').setDescription('Script URL').setRequired(true)),
  new SlashCommandBuilder().setName('removescript').setDescription('Remove a script (admin)').addStringOption(opt => opt.setName('name').setDescription('Script name').setRequired(true)),
  new SlashCommandBuilder().setName('listscripts').setDescription('List all scripts'),
  new SlashCommandBuilder().setName('genscript').setDescription('Generate a Roblox Lua script').addStringOption(opt => opt.setName('prompt').setDescription('Describe the script').setRequired(true)),
  new SlashCommandBuilder().setName('setadmin').setDescription('Give a user admin rights').addUserOption(opt => opt.setName('user').setDescription('User to promote').setRequired(true)),
  new SlashCommandBuilder().setName('removeadmin').setDescription('Remove admin rights').addUserOption(opt => opt.setName('user').setDescription('User to demote').setRequired(true)),
  new SlashCommandBuilder().setName('broadcast').setDescription('Send message to all users').addStringOption(opt => opt.setName('message').setDescription('Message to send').setRequired(true)),
  new SlashCommandBuilder().setName('resethwid').setDescription('Reset HWID for a user (admin only)').addUserOption(option => option.setName('user').setDescription('User to reset').setRequired(true))
].map(cmd => cmd.toJSON());

// Auto-register commands on startup
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, '1489796548576415900'), // your Guild ID
      { body: commands }
    );
    console.log('Commands registered!');
  } catch (err) { console.error(err); }
})();

// Panel buttons and command handling
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
      await interaction.reply({ content: 'Luarmor Panel (click a button):', components: [row], ephemeral: true });
    }

    if (name === 'generatekey') {
      db.keys.push({ key: `LM-${Date.now()}`, userId: null, hwid: null });
      saveDB();
      interaction.reply({ content: '✅ Key generated!', ephemeral: true });
    }

    if (name === 'redeemkey') {
      const key = interaction.options.getString('key');
      const k = db.keys.find(k => k.key === key);
      if (!k) return interaction.reply({ content: '❌ Invalid key.', ephemeral: true });
      if (k.userId) return interaction.reply({ content: '❌ Key already used.', ephemeral: true });
      k.userId = interaction.user.id;
      saveDB();
      interaction.reply({ content: '✅ Key redeemed!', ephemeral: true });
    }

    if (name === 'resethwid') {
      if (!db.admins.includes(interaction.user.id)) return interaction.reply({ content: '❌ Not admin.', ephemeral: true });
      const targetUser = interaction.options.getUser('user');
      const keyIndex = db.keys.findIndex(k => k.userId === targetUser.id);
      if (keyIndex === -1) return interaction.reply({ content: '❌ User has no key/HWID.', ephemeral: true });
      db.keys[keyIndex].hwid = null;
      saveDB();
      interaction.reply({ content: `✅ HWID reset for ${targetUser.username}.`, ephemeral: true });
    }

    // You can add the other commands logic (getscript, addscript, genscript, etc.) here
  }

  if (interaction.isButton()) {
    if (interaction.customId === 'get_script') interaction.reply({ content: 'Use `/getscript name:`', ephemeral: true });
    if (interaction.customId === 'redeem_key') interaction.reply({ content: 'Use `/redeemkey key:`', ephemeral: true });
    if (interaction.customId === 'generate_script') interaction.reply({ content: 'Use `/genscript prompt:`', ephemeral: true });
  }
});

client.once('ready', () => console.log(`Logged in as ${client.user.tag}`));
client.login(process.env.TOKEN);

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  // Key system
  new SlashCommandBuilder().setName('generatekey').setDescription('Generate a Luarmor key'),
  new SlashCommandBuilder()
    .setName('redeemkey')
    .setDescription('Redeem a key')
    .addStringOption(opt => opt.setName('key').setDescription('Enter key').setRequired(true)),
  new SlashCommandBuilder()
    .setName('deletekey')
    .setDescription('Delete a key (admin only)')
    .addStringOption(opt => opt.setName('key').setDescription('Enter key').setRequired(true)),

  // Script system
  new SlashCommandBuilder()
    .setName('addscript')
    .setDescription('Add a script (admin)')
    .addStringOption(opt => opt.setName('name').setDescription('Script name').setRequired(true))
    .addStringOption(opt => opt.setName('link').setDescription('Script URL').setRequired(true)),
  new SlashCommandBuilder()
    .setName('getscript')
    .setDescription('Get a script')
    .addStringOption(opt => opt.setName('name').setDescription('Script name').setRequired(true)),
  new SlashCommandBuilder().setName('listscripts').setDescription('List all scripts'),
  new SlashCommandBuilder()
    .setName('removescript')
    .setDescription('Remove a script (admin)')
    .addStringOption(opt => opt.setName('name').setDescription('Script name').setRequired(true)),

  // User panel
  new SlashCommandBuilder().setName('mypanel').setDescription('Open the Luarmor panel'),
  new SlashCommandBuilder().setName('mykeys').setDescription('List your redeemed keys'),
  new SlashCommandBuilder().setName('myscripts').setDescription('List scripts you have access to'),

  // Optional AI generator
  new SlashCommandBuilder()
    .setName('genscript')
    .setDescription('Generate a Roblox Lua script')
    .addStringOption(opt => opt.setName('prompt').setDescription('Describe the script').setRequired(true)),

  // Admin / utility
  new SlashCommandBuilder()
    .setName('setadmin')
    .setDescription('Give a user admin rights')
    .addUserOption(opt => opt.setName('user').setDescription('User to promote').setRequired(true)),
  new SlashCommandBuilder()
    .setName('removeadmin')
    .setDescription('Remove admin rights')
    .addUserOption(opt => opt.setName('user').setDescription('User to demote').setRequired(true)),
  new SlashCommandBuilder()
    .setName('broadcast')
    .setDescription('Send message to all users')
    .addStringOption(opt => opt.setName('message').setDescription('Message to send').setRequired(true))
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('Luarmor commands registered');
  } catch (err) { console.error(err); }
})();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Test command')
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands('1490036330296643584'),
      { body: commands }
    );
    console.log('Commands registered');
  } catch (err) { console.error(err); }
})();

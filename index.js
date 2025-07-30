// Importamos discord.js
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ]
});

// Emojis que quieres poner
const emojis = [
  'w_:1400143891620954164',
  'f_:1400143924814811267',
  '__:1400143957974847641'
];

// Cuando el bot se conecta
client.once('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

// Añade automáticamente las reacciones en cada mensaje nuevo
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.name === '「🤩」win-or-lose') {
    for (const emoji of emojis) {
      await message.react(emoji).catch(console.error);
    }
  }
});

// Maneja las reacciones para que solo quede 1 por usuario
client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;

  if (reaction.partial) await reaction.fetch();

  if (reaction.message.channel.name === '「🤩」win-or-lose') {
    const userReactions = reaction.message.reactions.cache.filter(r =>
      r.users.cache.has(user.id)
    );

    if (userReactions.size > 1) {
      for (const r of userReactions.values()) {
        if (r.emoji.id !== reaction.emoji.id && r.emoji.name !== reaction.emoji.name) {
          await r.users.remove(user.id);
        }
      }
    }
  }
});

// Inicia el bot
client.login(process.env.TOKEN);


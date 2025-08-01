const { Client, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// Configuración
const CHANNEL_NAME = '「🤩」win-or-lose'; // Pon aquí el nombre exacto del canal

// Lista de emojis válidos en formato nombre:id
const validEmojis = [
  'w_:1400143891620954164',
  '__:1400143957974847641',
  'f_:1400143924814811267',
  
];

client.once('ready', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

// Añade reacciones automáticamente en cada mensaje nuevo del canal
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.name === CHANNEL_NAME) {
    for (const emoji of validEmojis) {
      await message.react(emoji).catch(console.error);
    }
  }
});

// Maneja reacciones
client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;
  if (reaction.partial) await reaction.fetch();

  const message = reaction.message;
  if (message.channel.name !== CHANNEL_NAME) return;

  // 🔹 Formato del emoji que reaccionó el usuario
  const emojiKey = reaction.emoji.id
    ? `${reaction.emoji.name}:${reaction.emoji.id}`
    : reaction.emoji.name;

  // 1️⃣ Si el emoji no está en la lista de permitidos, eliminarlo
  if (!validEmojis.includes(emojiKey)) {
    await reaction.users.remove(user.id).catch(console.error);
    return;
  }

  // 2️⃣ Eliminar otras reacciones válidas previas del mismo usuario
  for (const r of message.reactions.cache.values()) {
    const rKey = r.emoji.id ? `${r.emoji.name}:${r.emoji.id}` : r.emoji.name;

    // Si es un emoji válido, el usuario lo puso y NO es el que acaba de poner → se borra
    if (validEmojis.includes(rKey) && rKey !== emojiKey && r.users.cache.has(user.id)) {
      await r.users.remove(user.id).catch(console.error);
    }
  }
});

client.login(process.env.TOKEN);

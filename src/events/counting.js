import { Events } from 'discord.js';
import fs from 'fs';

const DATA_FILE = './countData.json';

// ✏️ Paste your bypass role ID here
const BYPASS_ROLE_ID = '1520940490449489991';

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    return { currentCount: 0, lastUserId: null };
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export default {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {

    const COUNTING_CHANNEL_ID = '1514793182951379014';

    if (message.channel.id !== COUNTING_CHANNEL_ID) return;
    if (message.author.bot) return;
    if (message.member.roles.cache.has(BYPASS_ROLE_ID)) return;

    const data = loadData();
    const input = message.content.trim();
    const number = parseInt(input, 10);
    const expectedNumber = data.currentCount + 1;

    if (isNaN(number) || input !== String(number)) {
      await message.delete();
      const warn = await message.channel.send(`❌ <@${message.author.id}> Only send numbers in this channel!`);
      setTimeout(() => warn.delete(), 5000);
      return;
    }

    if (number !== expectedNumber) {
      await message.delete();
      const warn = await message.channel.send(`❌ <@${message.author.id}> Wrong number! The next number is **${expectedNumber}**.`);
      setTimeout(() => warn.delete(), 5000);
      return;
    }

    if (message.author.id === data.lastUserId) {
      await message.delete();
      const warn = await message.channel.send(`❌ <@${message.author.id}> You can't count twice in a row!`);
      setTimeout(() => warn.delete(), 5000);
      return;
    }

    data.currentCount = number;
    data.lastUserId = message.author.id;
    saveData(data);
    await message.react('✅');
  },
};
// counting.js - place this in your events folder

const fs = require('fs');

// Simple JSON file to persist count across restarts
const DATA_FILE = './countData.json';

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    return { currentCount: 0, lastUserId: null };
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    // ✏️ Replace with your actual counting channel ID
    const COUNTING_CHANNEL_ID = 'YOUR_CHANNEL_ID_HERE';

    if (message.channel.id !== COUNTING_CHANNEL_ID) return;
    if (message.author.bot) return;

    const data = loadData();
    const input = message.content.trim();
    const number = parseInt(input, 10);
    const expectedNumber = data.currentCount + 1;

    // Check 1: Must be a valid number (nothing else in the message)
    if (isNaN(number) || input !== String(number)) {
      await message.delete();
      const warn = await message.channel.send(
        `❌ <@${message.author.id}> Only send numbers in this channel!`
      );
      setTimeout(() => warn.delete(), 5000);
      return;
    }

    // Check 2: Must be the correct next number
    if (number !== expectedNumber) {
      await message.delete();
      const warn = await message.channel.send(
        `❌ <@${message.author.id}> Wrong number! The next number is **${expectedNumber}**.`
      );
      setTimeout(() => warn.delete(), 5000);
      return;
    }

    // Check 3 (optional): Prevent the same person counting twice in a row
    if (message.author.id === data.lastUserId) {
      await message.delete();
      const warn = await message.channel.send(
        `❌ <@${message.author.id}> You can't count twice in a row!`
      );
      setTimeout(() => warn.delete(), 5000);
      return;
    }

    // ✅ Valid count — save and react
    data.currentCount = number;
    data.lastUserId = message.author.id;
    saveData(data);

    await message.react('✅');
  },
};
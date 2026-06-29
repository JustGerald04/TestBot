import fs from 'fs';
import { EmbedBuilder } from 'discord.js';

const DATA_FILE = './countData.json';

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export default {
  name: 'counting_reset',
  async execute(interaction) {
    saveData({ currentCount: 0, lastUserId: null });

    const embed = new EmbedBuilder()
      .setTitle('🔢 Counting Dashboard')
      .setColor(0x57F287)
      .addFields({ name: 'Current Count', value: '**0**', inline: true })
      .setFooter({ text: 'Count has been reset to 0' })
      .setTimestamp();

    await interaction.update({ embeds: [embed] });
  },
};
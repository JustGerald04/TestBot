import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import fs from 'fs';

const DATA_FILE = './countData.json';

function loadData() {
  if (!fs.existsSync(DATA_FILE)) return { currentCount: 0, lastUserId: null };
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

export default {
  data: new SlashCommandBuilder()
    .setName('countdash')
    .setDescription('Manage the counting channel'),

  async execute(interaction) {
    const data = loadData();

    const embed = new EmbedBuilder()
      .setTitle('🔢 Counting Dashboard')
      .setColor(0x5865F2)
      .addFields({ name: 'Current Count', value: `**${data.currentCount}**`, inline: true })
      .setFooter({ text: 'Use the buttons below to manage the count' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('counting_reset')
        .setLabel('Reset to 0')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🔄'),
      new ButtonBuilder()
        .setCustomId('counting_set')
        .setLabel('Set Count')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('✏️')
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  },
};
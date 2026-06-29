import fs from 'fs';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

const DATA_FILE = './countData.json';

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export default {
  name: 'counting_set_modal',
  async execute(interaction) {
    const input = interaction.fields.getTextInputValue('counting_set_input');
    const number = parseInt(input, 10);

    if (isNaN(number) || number < 0) {
      return interaction.reply({ content: '❌ Please enter a valid positive number.', ephemeral: true });
    }

    saveData({ currentCount: number, lastUserId: null });

    const embed = new EmbedBuilder()
      .setTitle('🔢 Counting Dashboard')
      .setColor(0x57F287)
      .addFields({ name: 'Current Count', value: `**${number}**`, inline: true })
      .setFooter({ text: `Count has been set to ${number}` })
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
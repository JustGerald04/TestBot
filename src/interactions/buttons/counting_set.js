import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

export default {
  name: 'counting_set',
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('counting_set_modal')
      .setTitle('Set Count');

    const input = new TextInputBuilder()
      .setCustomId('counting_set_input')
      .setLabel('What number should the count be set to?')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('e.g. 50')
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder().addComponents(input));
    await interaction.showModal(modal);
  },
};
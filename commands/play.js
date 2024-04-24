const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require("../mongoDB");

let selectedThumbnailURL;

module.exports = {
  name: "play",
  description: "Come on, let's hear some music!",
  permissions: "0x0000000000000800",
  options: [{
    name: 'name',
    description: 'Type the name of the music you want to play.',
    type: ApplicationCommandOptionType.String,
    required: true
  }],
  voiceChannel: true,
  run: async (client, interaction) => {
    try {
      const name = interaction.options.getString('name');
      if (!name) return interaction.reply({ content: `❌ Enter a valid song name.`, ephemeral: true });

      let res;
      try {
        res = await client.player.search(name, {
          member: interaction.member,
          textChannel: interaction.channel,
          interaction
        });
      } catch (e) {
        console.error(e);
        return interaction.reply({ content: `❌ Error occurred while searching.`, ephemeral: true });
      }

      if (!res || res.length === 0) {
        return interaction.reply({ content: `❌ No results`, ephemeral: true });
      }

      const maxTracks = res.slice(0, 10);
      const embed = new EmbedBuilder()
        .setColor(client.config.embedColor)
        .setTitle(`Found: ${name}`)
        .setDescription(maxTracks.map((song, i) => `**${i + 1}**. [${song.name}](${song.url}) | \`${song.uploader.name}\``).join('\n') + "\n\n✨Choose a song from below!!");
      
      const track_button_creator = maxTracks.map((song, index) =>
        new ButtonBuilder()
          .setLabel(`${index + 1}`)
          .setStyle(ButtonStyle.Secondary)
          .setCustomId(`${index + 1}`)
      );

      const buttons = [];
      for (let i = 0; i < track_button_creator.length; i += 5) {
        buttons.push(new ActionRowBuilder().addComponents(track_button_creator.slice(i, i + 5)));
      }

      buttons.push(new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
            .setCustomId('cancel')
        )
      );

      interaction.reply({ embeds: [embed], components: buttons }).then(async Message => {
        const filter = i => i.user.id === interaction.user.id;
        const collector = await Message.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (button) => {
          if (button.customId === 'cancel') {
            await interaction.editReply({ content: `Search interrupted`, components: [] });
            return collector.stop();
          }
          
          selectedThumbnailURL = maxTracks[Number(button.customId) - 1].thumbnail;
          embed.setThumbnail(selectedThumbnailURL);
          embed.setDescription(`**${res[Number(button.customId) - 1].name}**`);
          await interaction.editReply({ embeds: [embed], components: [] });

          try {
            await client.player.play(interaction.member.voice.channel, res[Number(button.customId) - 1].url, {
              member: interaction.member,
              textChannel: interaction.channel,
              interaction
            });
          } catch (e) {
            console.error(e);
            await interaction.editReply({ content: `❌ Error occurred while playing the song.`, ephemeral: true });
          }
          collector.stop();
        });

        collector.on('end', (msg, reason) => {
          if (reason === 'time') {
            embed.setDescription(`Search timed out.`);
            interaction.editReply({ embeds: [embed], components: [] });
          }
        });
      });
    } catch (e) {
      console.error(e);
    }
  },
};

module.exports.selectedThumbnailURL = selectedThumbnailURL;

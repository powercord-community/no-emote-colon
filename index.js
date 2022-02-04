const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');

module.exports = class NoEmoteColon extends Plugin {
  async startPlugin () {
    // messages webpack module is gay, need to import it manually
    const messages = await getModule([ 'sendMessage', 'editMessage', 'deleteMessage' ]);
    const emojiStore = await getModule([ 'getGuildEmoji' ]);
    const guildsStore = await getModule([ 'getSortedGuilds' ]);

    inject('noEmoteColon-msg', messages, 'sendMessage', (args) => {
      const emotes = Object.values(emojiStore.getGuilds()).flatMap(g => g.emojis);
      args[1].content = args[1].content.split(' ').map(word => {
        const emote = emotes.find(e => e.name === word);
        if (emote) {
          return `<${emote.animated ? 'a' : ''}:${emote.name}:${emote.id}>`;
        }
        return word;
      }).join(' ');
      return args;
    }, true);
  }

  pluginWillUnload () {
    uninject('noEmoteColon-msg');
  }
};

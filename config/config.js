const { Intents } = require('discord.js');
const {
    DIRECT_MESSAGES,
    GUILD_MESSAGES,
    GUILDS,
} = Intents.FLAGS;

const config = {
    prefix: '!',
};

const botIntents = [
    DIRECT_MESSAGES,
    GUILD_MESSAGES,
    GUILDS,
];

const commands = {
    introduce: 'introduce',
    bot: 'bot',
    getName: 'get-name',
    tellJoke: 'tell-a-joke',
    sad: 'sad',
    lastMsgs: 'last-messages',
    test: 'test',
    randomnumber: 'random',
    teach: 'teach',
    teachsimilarword: 'teachsw',
    help: 'help'
};

module.exports = { botIntents ,config ,commands };
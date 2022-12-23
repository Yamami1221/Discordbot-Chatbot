require(`dotenv`).config();
const { Client, MessageEmbed } = require(`discord.js`);
const { dockStart } = require('@nlpjs/basic');
const { botIntents ,config ,commands } = require(`./config/config`);
const client = new Client({intents: botIntents,partials: ['CHANNEL', 'MESSAGE', 'REACTION'],});
const minified = true;//for nlp.save
let botstat = `1`;

client.on(`ready`, () => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.user.setActivity(`${config.prefix}help`, { type: `PLAYING`});
})
client.on(`reconnecting`, () => {
    console.log(`Reconnecting!`);
});
client.on(`disconnect`, () => {
    console.log(`Disconnect!`);
});

client.on(`messageCreate`, async (msg) => {
    const forbids = await forbid(msg);
    if (forbids == `0`) return;
    const dock = await dockStart({ use: ['Basic']});
    //const dock = await dockStart();
    const nlp = dock.get('nlp');
    await nlp.load('./model.nlp');
    if (msg.author.bot) return;
    if (msg.content.startsWith(`${config.prefix}`)) {
        const cmdArray = msg.content.slice(config.prefix.length).split(` `);
        if (cmdArray[0] == commands.bot) {
            if (cmdArray[1] == `stop`) {
                botstat = `0`;
                msg.reply({ embeds: [{
                    color: 0xff8800,
                    title: `Bot Status`,
                    description: "`Bot Stoped`",
                }]});
            } else if (cmdArray[1] == `start`) {
                botstat = `1`;
                msg.reply({ embeds: [{
                    color: 0xff8800,
                    title: `Bot Status`,
                    description: "`Bot Started`",
                }]});
            } else if (cmdArray[1] == `status`||cmdArray[1] == `stat`) {
                if (botstat == `1`) {
                    msg.reply({ embeds: [{
                        color: 0xff8800,
                        title: `Bot Status`,
                        description: "`Bot Started`",
                    }]});
                } else if (botstat == `0`) {
                    msg.reply({ embeds: [{
                        color: 0xff8800,
                        title: `Bot Status`,
                        description: "`Bot Stoped`",
                    }]});
                }
            } else {
                msg.reply(`what?`);
            }
        } else if (cmdArray[0] == commands.getName) {
            msg.reply(`Your discord username is ${msg.author.username}`);
        } else if (cmdArray[0] === commands.introduce) {
            msg.reply("BOT AI เพื่อชาว ENTANEER CLUB คำสั่งพื้นฐานดูได้ที่ `!help`");
        } else if (cmdArray[0] === commands.tellJoke) {
            msg.channel.send("**HTML** is a programming language.\nI really don't have a joke"); // bad joke i guess, unless i don't have any jokes
        } else if (cmdArray[0] === commands.sad) {
            msg.reply("Don't be sad! This is not the end of the road");
        } else if (cmdArray[0] === commands.randomnumber) {
            if (cmdArray[1] > cmdArray[2]) {
                const invalidargreply = await invalidarg();
                msg.reply({ embeds: invalidargreply });
                return;
            }
            const random = getRnd(cmdArray[1], cmdArray[2])
            msg.reply(`${random}`);
        } else if (cmdArray[0] === commands.test) {
            msg.reply(`1`);
        } else if (cmdArray[0] === commands.lastMsgs) {
            const reply = await getLastMsgs(msg);
            msg.author.send({ embeds: reply });
        } else if (cmdArray[0] === commands.teach) {
            if (!cmdArray[2]) {
                const invalidargreply = await invalidarg();
                msg.reply({ embeds: invalidargreply });
                return;
            }
            nlp.addLanguage('th');
            nlp.addDocument('th', `${cmdArray[1]}`, `${cmdArray[1]}`);
            nlp.addAnswer('th', `${cmdArray[1]}`, `${cmdArray[2]}`);
            await nlp.train();
            await nlp.save();
            //await nlp.export(minified);
            //await nlp.save(modelbeta)
        } else if (cmdArray[0] === commands.teachsimilarword) {
            if (!cmdArray[2]) {
                const invalidargreply = await invalidarg();
                msg.reply({ embeds: invalidargreply });
                return;
            }
            nlp.addLanguage('th');
            nlp.addDocument('th', `${cmdArray[1]}`, `${cmdArray[2]}`);
            await nlp.train();
            await nlp.save();
        } else if (cmdArray[0] === commands.help) {
            const helpreply = await help();
            msg.channel.send({ embeds: helpreply});
        } else {
            msg.reply({ embeds: [{
                color: 0xff8800,
                title: `Invalid Command!`,
                description: "For more info`!help`",
            }]});
        }//add command here
    } else if (!msg.content.startsWith(`${config.prefix}`)&&!msg.content.startsWith(`#`)&&!msg.content.startsWith(`<@`)&&!msg.content.startsWith('`')) {
        if (botstat == `1`) {
            await nlp.load('./model.nlp');
            //await nlp.import('./model.nlp');
            const response = await nlp.process(`th`, `${msg.content}`);
            if (!response.answer) {
                msg.reply('เรายังไม่เข้าใจ\nสอนเราได้นะ ใช้คำสั่ง`!teach`ดูข้อมูลเพิ่มเติมได้จาก`!help`');
            } else {
                msg.reply(`${response.answer}`);
            }
        } else if (botstat == `0`) {
            
        }
    } else {

    }
})

client.on(`messageDelete`, async (msgdel) => {
    const forbids = await forbid(msg);
    if (forbids == `0`) return;
    if (botstat == `1`) {
        msgdel.channel.send(`ฮั่นแน่ ลบไรอะ`);
    } else if (botstat == `0`) {
        
    }
})

const getLastMsgs = async (msg) => {
    // fetching the last 10 messages
    const res = await msg.channel.messages.fetch({ limit: 10 });
  
    const lastTenMsgs = res.map((message) => {
        return message.content;
    });

    const embeds = [];

    lastTenMsgs.forEach((msg, index) => {
        const embed = new MessageEmbed()
            .setColor('ORANGE') // can be hex like #3caf50
            .setTitle(`Message ${index + 1}`)
            .setDescription(`${msg}`)
            .setFooter('Buddy says Hi');
        embeds.push(embed);
    });
    return embeds;
};
const help = async () => {
    const helpembeds = [{
        color: 0xff8800,
        author: {
            name: `Dukdui Bot`,
            icon_url: `https://cdn.discordapp.com/attachments/976085250511867904/977546401544290334/square.jpg`
        },
        thumbnail: {
            url: `https://cdn.discordapp.com/attachments/976085250511867904/977546401544290334/square.jpg`
        },
        title: `วิธีใช้บอท`,
        description: `วิธีใช้นั่นแหละ อ่านๆดูเอาเองละกัน`,
        fields: [{
            name: `!bot`,
            value: "ตั้งสถานะบอทหรือตรวจสอบสถานะ\nวิธีใช้\n\`!bot [start,stop,status,stat]\`\nตัวอย่าง\n\`!bot status\`",
            inline: false
        },
        {
            name: `!teach`,
            value: "สอนน้อง\nวิธีใช้\n\`!teach [inputเช่น สวัสดี] [Outputเช่น ดีจ้า]\`\nตัวอย๋าง\n\`!teach เธอชื่อไร เราชื่อประยุทธ์\`",
            inline: false
        },
        {
            name: `!teachsw`,
            value: "สำหรับการเพิ่มคำคล้าย หรือ ต้องการให้ตอบสนองเหมือนกัน\nวิธีใช้\n\`!teachsw [inputใหม่] [inputที่เคยเพิ่มแล้ว]\`\nตัวอย่าง\n\`!teachsw ชื่อไรอะ เธอชื่อไร\`",
            inline: false
        },
        {
            name: `!random`,
            value: "สุ่มเลข\nวิธีใช้\n\`!random [ค่าต่ำสุด] [ค่าสูงสุด]\`\nตัวอย่าง\n\`!random 1 10\`",
            inline: false
        },
        {
            name: "More Info",
            value: "[Click Here](https://youtu.be/dQw4w9WgXcQ)",
            inline: false
        },],
        timestamp: new Date(),
        footer: {
            text: "ตอนนี้รองรับแค่ภาษาไทยนะ"
        }
    }];
    return helpembeds;
};
const invalidarg = async () => {
    const invalidargembed = [{
        color: 0xff8800,
        title: `Invalid Argument!`,
        description: "More info in `!help`",
    }];
    return invalidargembed;
};

function getRnd(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
};
const forbid = async (msg) => {
    if (msg.guild.id == '954215674887168000') {
        const forbidstat = `0`//entaneer club
        return forbidstat;
    } else if (msg.channel.id == '954221697828016148') {
        const forbidstat = `0`//อยู่สาขาอะไรกันบ้าง
        return forbidstat;
    } else if (msg.channel.id == '977443129517047858') {
        const forbidstat = `0`//แนะนำเพลง
        return forbidstat;
    } else if (msg.guild.id == '975448733103816805') {
        const forbidstat = `0`//dukduibottester
        return forbidstat;
    } else {
        const forbidstat = `1`
        return forbidstat;
    }
};

client.login(process.env.DISCORD_TOKEN);
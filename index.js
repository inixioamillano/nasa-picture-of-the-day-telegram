const TelegramBot = require('node-telegram-bot-api');
const CronJob = require('cron').CronJob;
const axios = require('axios');
require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});

function sendPhoto() {
    axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`).then(res => {
        const {data} = res;
        const url = data.hdurl ? data.hdurl : data.url;
        const caption = `🚀 ${data.title} 🪐${data.copyright ? `\n\nCopyright: ${data.copyright}` : ''}`;
        if (data.media_type === 'video'){
            bot.sendMessage(`@${process.env.TELEGRAM_CHANNEL_ID}`, `${caption}\n${url}`);
        } else {
            bot.sendPhoto(`@${process.env.TELEGRAM_CHANNEL_ID}`, url, {caption});
        }
    })
    .catch(e => console.log(e));
}

var job = new CronJob('0 21 * * *', function() {
    sendPhoto();
}, null, true, 'Europe/Madrid');

job.start();

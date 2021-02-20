const TelegramBot = require('node-telegram-bot-api');
const CronJob = require('cron').CronJob;
const axios = require('axios');
require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});

function sendPhoto(dateStr) {
    axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}${dateStr ? `&date=${dateStr}` : ''}`).then(res => {
        const {data} = res;
        const url = data.hdurl ? data.hdurl : data.url;
        const caption = `${dateStr ? `On this day ${dateStr.split('-')[0]}\n\n` : ''}🚀 ${data.title} 🪐${data.copyright ? `\n\nCopyright: ${data.copyright}` : ''}`;
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

const onThisDayJob = new CronJob('0 13 * * *', () => {
    const year = Math.floor(Math.random()*20)+1; // Number between 1 and 20
    const today = new Date();
    const month = date.getMonth()+1;
    const day = date.getDate();
    const date = `200${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
    sendPhoto(date);
}, null, true, 'Europe/Madrid');

onThisDayJob.start();

bot.on('polling_error', (err) => console.log(err))
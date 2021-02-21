const TelegramBot = require('node-telegram-bot-api');
const CronJob = require('cron').CronJob;
const axios = require('axios');
require('dotenv').config();

const {NASA_API_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL_ID, HOUR, MINUTES, OTD_HOUR, OTD_MINUTES} = process.env;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {polling: true});

function sendPhoto(dateStr) {
    axios.get(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}${dateStr ? `&date=${dateStr}` : ''}`).then(res => {
        const {data} = res;
        const url = data.hdurl ? data.hdurl : data.url;
        const caption = `${dateStr ? `On this day in ${dateStr.split('-')[0]}\n\n` : ''}🚀 ${data.title} 🪐${data.copyright ? `\n\nCopyright: ${data.copyright}` : ''}`;
        if (data.media_type === 'video'){
            bot.sendMessage(`@${TELEGRAM_CHANNEL_ID}`, `${caption}\n${url}`);
        } else {
            bot.sendPhoto(`@${TELEGRAM_CHANNEL_ID}`, url, {caption});
        }
    })
    .catch(e => console.log(e));
}

var job = new CronJob(`${MINUTES} ${HOUR} * * *`, function() {
    sendPhoto();
}, null, true, 'Europe/Madrid');

job.start();

const onThisDayJob = new CronJob(`${OTD_MINUTES} ${OTD_HOUR} * * *`, () => {
    const year = Math.floor(Math.random()*20)+1; // Number between 1 and 20
    const today = new Date();
    const month = today.getMonth()+1;
    const day = today.getDate();
    const date = `20${year < 10 ? `0${year}` : year}-${month}-${day}`;
    sendPhoto(date);
}, null, true, 'Europe/Madrid');

onThisDayJob.start();

bot.on('polling_error', (err) => console.log(err))
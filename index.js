const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require ('./options')

const token = '6083288138:AAEUs91wHkT1401l_Ni-z-SCLhZjcgd5HxE'

const bot = new TelegramApi(token, {polling: true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен её отгдать')
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай!', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description:'greeting'},
        {command: '/info', description:'info about u'},
        {command: '/game', description:'game'}
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if (text === '/start') {
            return bot.sendMessage(chatId, `Хаю хай`)
        }
    
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, `Я тебя не понимаю, попробуй ещё раз!`)
        
    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Ты угадал! Я загадал ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Ты лох! Я загадал ${chats[chatId]}`, againOptions)
        }
    })
}

start();
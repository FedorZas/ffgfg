const fs = require('fs'); // Импортируем модуль fs
const { Telegraf, Markup } = require('telegraf'); // Импортируем Telegraf и Markup
const path = 'progress.json';
const bot = new Telegraf('7202172646:AAFiZmfZtlN3LeIU2sMvlShxcWRddGkZMS8'); // Замените на ваш токен
const { ChartJSNodeCanvas } = require('chartjs-node-canvas'); // Импорт библиотеки
const userData = {};
const users = 'users.json';
const { createCanvas, loadImage } = require('canvas');
const famrs = 0;
const userBalances = {};
const userFarms = {};
const userBanks = {};
const userProfiles = {};
const levl_mining = {}; // Изменено на объект
const currencyName = "КриптоМонеты";
const experience = {};
const salary = {};

const lvljob = 1;

const balmining = {};
// Инициализация объектов для хранения данных пользователей

const nameJob = {}; // Пример инициализации переменной nameJob


async function deleteMessage(chatId, messageId) {
    try {
        if (!chatId || !messageId) {
            throw new Error('Chat ID or Message ID is not defined');
        }
        await bot.telegram.deleteMessage(chatId, messageId);
    } catch (error) {
        console.error('Ошибка при удалении сообщения:', error);
    }
}
// Функция для проверки наличия файла и создания его при отсутствии


// Пример функции для сохранения прогресса

// Функция для загрузки прогресса
function loadProgress() {
    try {
        if (fs.existsSync('progress.json')) {
            const data = fs.readFileSync('progress.json', 'utf8');
            if (data.trim() === '') {
                console.log('Файл прогресса пуст, начинается новая сессия.');
                return;
            }
            const progress = JSON.parse(data);
            Object.assign(userBalances, progress.userBalances || {});
           
            Object.assign(userFarms, progress.userFarms || {});
            Object.assign(userBanks, progress.userBanks || {});
            Object.assign(userProfiles, progress.userProfiles || {});
            console.log('Прогресс загружен.');
        } else {
            console.log('Файл прогресса не найден, начинается новая сессия.');
        }
    } catch (err) {
        console.error('Ошибка загрузки прогресса:', err);
    }
}

// Загружаем прогресс
loadProgress();

// Обработка команды "профиль"
bot.hears(/профиль/i, (ctx) => {
    const userId = ctx.from.id;
    const username = ctx.from.first_name;
    const userBalance = userBalances[userId] || 0; // Получаем баланс пользователя
    const mininglvl = levl_mining[userId] || 1; // Получаем уровень майнинга
    const tapperId = ctx.from.id;

    loadProgress(); // Загрузка прогресса
    const userExperience = experience[tapperId] || 0; // Получаем опыт пользователя
    saveProgress(); // Сохранение прогресса

    // Проверьте, что famrs и nameJob определены
    const userFamrs = famrs[userId] || "Нет данных"; // Пример получения данных для famrs
    const userNameJob = nameJob[userId] || "Нет данных"; // Пример получения данных для nameJob

    ctx.reply(`Имя: ${username}
        
    Баланс: ${userBalance} КриптоМонет
    Фермы: ${userFamrs}
    Уровень майнинга: ${mininglvl}
    Уровень Работы: ${userExperience}
    Ваша работа: ${userNameJob}`);
});

// Запуск бота и загрузка прогресса

// Обработка команды "майнинг"
bot.hears(/майнинг/i, (ctx) => {
    const userId = ctx.from.id;
    const username = ctx.from.username;

    // Устанавливаем базовую скорость майнинга
    levl_mining[userId] = levl_mining[userId];
    userBalances[userId] = userBalances[userId] || 0;

    const keyboard = Markup.inlineKeyboard([
        Markup.button.callback('Начать майнинг', `start_mining_${userId}`),
        Markup.button.callback('Остановить майнинг', `stop_mining_${userId}`)
    ]);

    ctx.reply(`@${username}, меню для майнинга. Нажмите кнопку ниже, чтобы начать майнинг.`, keyboard);
    console.log(`Сообщение написал пользователь с ID ${userId}`);
});

// Функция для генерации случайного изменения цены
function generateRandomPriceChange() {
    const change = Math.floor(Math.random() * 200) - 10; // Случайное изменение от -100 до +100
    return change; // Возвращаем новое изменение
}

// Функция для обновления курса биткоина каждую минуту
setInterval(() => {
    const newPrice = generateRandomPriceChange();
    console.log(`Текущий курс биткоина: ${newPrice}`);
}, 60000); // 60000 миллисекунд = 1 минута

// Функция для создания графика


async function createChart() {
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 600 });
    const bitcoinPrices = Array.from({ length: 10 }, () => generateRandomPriceChange());

    const configuration = {
        type: 'line',
        data: {
            labels: bitcoinPrices.map((_, index) => `Точка ${index + 1}`),
            datasets: [{
                label: 'Курс Биткоина(Криптомонеты)',
                data: bitcoinPrices,
                borderColor: 'rgb(6, 10, 231)',
                borderWidth: 2,
                fill: false,
            }],
        },
        options: {
            responsive: false,
            scales: {
                y: {
                    beginAtZero: false,
                },
            },
        },
    };

    return await chartJSNodeCanvas.renderToBuffer(configuration);
}

// Команда для получения текущего курса
bot.command('price', (ctx) => {
    const newPrice = generateRandomPriceChange();
    ctx.reply(`Текущий курс биткоина: ${newPrice}`);
});

// Обработка команды "купить биткоин"
bot.hears(/купить биткоин/i, async (ctx) => {
    const amount = parseFloat(ctx.message.text.split(' ')[3]); // Получаем количество биткоинов из команды
    const userId = ctx.from.id;

    if (!amount || amount <= 0) {
        ctx.reply('Пожалуйста, укажите корректное количество биткоинов для покупки (например, /купить биткоин 0.1).');
        return;
    }

    // Проверяем, достаточно ли средств для покупки
    if (amount * currentPrice > (userBalances[userId] || 0)) {
        ctx.reply('Недостаточно средств для покупки. Проверьте ваш баланс.');
    } else {
        userBalances[userId] = (userBalances[userId] || 0) - amount * currentPrice; // Уменьшаем баланс пользователя
        BTC += amount; // Увеличиваем количество биткоинов у пользователя
        ctx.reply(`Вы купили ${amount} биткоинов. Ваш новый баланс: $${userBalances[userId].toFixed(2)}.`);
    }
});

// Обработка команды "продать биткоин"
bot.hears(/продать биткоин/i, async (ctx) => {
    const amount = parseFloat(ctx.message.text.split(' ')[2]); // Получаем количество биткоинов из команды
    const userId = ctx.from.id;

    if (!amount || amount <= 0) {
        ctx.reply('Пожалуйста, укажите корректное количество биткоинов для продажи (например, /продать биткоин 0.1).');
        return;
    }

    // Проверяем, достаточно ли биткоинов для продажи
    if (amount > (BTC || 0)) {
        ctx.reply('Недостаточно биткоинов для продажи. Проверьте ваше количество биткоинов.');
        return;
    }

    userBalances[userId] = (userBalances[userId] || 0) + amount * currentPrice; // Увеличиваем баланс пользователя
    BTC -= amount; // Уменьшаем количество биткоинов у пользователя
    ctx.reply(`Вы продали ${amount} биткоинов. Ваш новый баланс: $${userBalances[userId].toFixed(2)}.`);
});
// Обработка команды "график биткоина"
bot.hears(/график биткоина/i, async (ctx) => {
    try {
        const chartBuffer = await createChart(); // Получаем буфер изображения
        await ctx.replyWithPhoto({ source: chartBuffer }); // Отправляем изображение
    } catch (error) {
        console.error('Ошибка при создании графика:', error);
        ctx.reply('Не удалось создать график. Пожалуйста, попробуйте еще раз.');
    }
});

bot.hears(/майнер место|майнер бегом на место/i, async (ctx) => {
    try {
        
        const memberId = ctx.from.id; // ID пользователя
        const chatId = ctx.chat.id; // ID чата (группы)

        // Получаем информацию о члене чата
        

        // Получаем информацию о члене чата
        const member = await ctx.getChatMember(memberId);
        // Проверяем статус пользователя
        if (member.status === creator) {
            const chartBuffer = await createChart(); // Получаем буфер изображения
            await ctx.replyWithPhoto({ source: chartBuffer }); // Отправляем изображение
            saveProgress(); // Сохраняем прогресс
            // Убедитесь, что вам действительно нужно останавливать бота
            // bot.stop(); // Закомментируйте или удалите, если это не нужно
        } else {
            ctx.reply('У вас нет прав для выполнения этой команды.');
        }
    } catch (error) {
        console.error('Ошибка при создании графика:', error);
        ctx.reply('Слушаюсь, мой хозяин Иду на место');
        ctx.answerCbQuery(`Бот отключился`)
    }
});

bot.hears(/Майнер Взять/i, async (ctx) => {
            
       // Проверяем, является ли отправитель администратором
    const member = await ctx.getChatMember(ctx.from.id);
    if (member.status !== 'administrator' && member.status !== 'creator') {
        return ctx.reply('У вас нет прав для этой команды');
    }

    // Получаем упоминание пользователя, которого нужно кикнуть
    const userToKick = ctx.message.reply_to_message?.from;
    if (!userToKick) {
        return ctx.reply('Пожалуйста, ответьте на сообщение пользователя, чтобы майнер мог его взять');
    }

    try {
        // Кикаем пользователя
        await ctx.kickChatMember(userToKick.id);
        ctx.reply(`Майнер бот взял ${userToKick.first_name}`);
    } catch (error) {
        console.error('Ошибка при кике пользователя:', error);
        ctx.reply('Не удалось взять этого пользователя');
    }
});
bot.action(/start_mining_(\d+)/, (ctx) => {
    const userId = parseInt(ctx.match[1]);

    // Проверяем, существует ли пользователь
    if (!userData[userId]) {
        // Инициализируем пользователя, если его нет
        userData[userId] = {
            miningLevel: 1, // начальное значение
            balance: 0,
            miningIntervalId: null,
            miningMessageId: null
        };
    }

    loadProgress();
    const user = userData[userId];

    // Проверяем, запущен ли майнинг
    if (user.miningIntervalId) {
        ctx.answerCbQuery('Майнинг уже запущен!');
        return;
    }

    const username = ctx.from.username;
    ctx.answerCbQuery('Майнинг начат!');

    // Старт майнинга
    ctx.reply(`@${username} начал майнинг!`).then((msg) => {
        user.miningMessageId = msg.message_id;

        user.miningIntervalId = setInterval(() => {
            // Используем user.miningLevel вместо miningLevel
            user.balance += user.miningLevel; // Обновляем баланс пользователя
            saveProgress(); // Сохранение прогресса после начисления

            // Обновляем сообщение
            if (user.miningMessageId) {
                ctx.telegram.editMessageText(ctx.chat.id, user.miningMessageId, null, `@${username}, вы намайнили ${user.miningLevel} КриптоМонет. Текущий баланс: ${user.balance} КриптоМонет.`);
            }
        }, 2500);
    });
});


// Обработка остановки майнинга
bot.action(/stop_mining_(\d+)/, (ctx) => {
    const userId = parseInt(ctx.match[1]);

    if (!userData[userId].miningIntervalId) {
        ctx.answerCbQuery('Майнинг уже остановлен!');
        return;
    }

    clearInterval(userData[userId].miningIntervalId);
    userData[userId].miningIntervalId = null;

    ctx.answerCbQuery('Майнинг остановлен!');
    ctx.telegram.editMessageText(ctx.chat.id, userData[userId].miningMessageId, null, `Майнинг остановлен. Ваш баланс: ${userData[userId].balance} КриптоМонет.`);
    userBalances[userId] = userBalances[userId] + userData[userId]
    saveProgress(); // Сохранение прогресса
});
function loadProgress() {
    try {
        const data = JSON.stringify({
        famrs,
 userBalances ,
userFarms,
 userBanks ,
 userProfiles ,
 levl_mining , // Изменено на объект
 currencyName ,
 lvljob, 
 salary,
 balmining ,
 nameJob
            // Добавьте другие необходимые данные для сохранения
        }, null, 2); // Форматируем JSON с отступами

        fs.writeFileSync(path, data); // Записываем данные в файл
        console.log('Прогресс загружен.');
    } catch (error) {
        console.error('Ошибка при сохранении прогресса:', error.message);
    }
}

// Функция сохранения прогресса
function saveProgress() {
    try {
        const data = JSON.stringify({
        famrs,
 userBalances ,
userFarms,
 userBanks ,
 userProfiles ,
 levl_mining , // Изменено на объект
 currencyName ,
experience ,
salary,
 balmining ,
 nameJob
            // Добавьте другие необходимые данные для сохранения
        }, null, 2); // Форматируем JSON с отступами

        fs.writeFileSync(path, data); // Записываем данные в файл
        console.log('Прогресс сохранен.');
    } catch (error) {
        console.error('Ошибка при сохранении прогресса:', error.message);
    }
}


// Обработка других команд
bot.hears(/купить ферму/i, (ctx) => {
    const userId = ctx.from.id;
    const cost = 100; // Стоимость фермы
    if ((userBalances[userId] || 0) >= cost) {
        userBalances[userId] -= cost;
        userFarms[userId] = (userFarms[userId] || 0) + 1;
        levl_mining[userId][userId] += 1; // Увеличиваем скорость майнинга
        ctx.reply(`Вы купили ферму! Теперь у вас ${userFarms[userId]} ферма(ы).`);
    } else {
        ctx.reply(`У вас недостаточно средств для покупки фермы. Вам нужно ${cost} ${currencyName}.`);
    }
    saveProgress();
});
bot.hears(/Использовать фермы/i, (ctx) => {
    // Получаем количество ферм для пользователя
    let farms = getFarmsForUser (ctx.from.id); // Здесь farms - это объект, например, { count: 5 }
    let dohodferms = 0; // Инициализация переменной

    // Проверяем, что farms - это объект и у него есть свойство count
    if (farms && farms.count > 0) {  // Изменено на правильную проверку
        dohodferms = farms.count * 0.5; // Расчет дохода от ферм
        ctx.reply(`Вы активировали свои фермы, и они приносят вам ${dohodferms} за 15 минут.`);

        setInterval(() => {
            // Обновляем доход
            dohodferms += farms.count * 0.5; // Обновляем доход
            ctx.reply(`Ваш доход от ферм за 15 минут: ${dohodferms}`);
        }, 900000); // Каждые 15 минут

        saveProgress(); // Сохранение прогресса
    } else {
        // Проверяем, если farms существует и выводим количество ферм
        ctx.reply(`У вас нет ферм. У вас ферм: ${farms ? farms.count : 0}`);
    }
});

// Функция для получения количества ферм
function getFarmsForUser (userId) {
    // Логика для получения количества ферм для данного пользователя
    // Например, из базы данных или объекта
    return { count: 0 }; // Замените на реальную логику
}

// Обработка команды для улучшения майнера
bot.hears(/улучшить майнер/, (ctx) => {
    const userId = ctx.from.id;
    const upgradeCost = levl_mining * 250; // Стоимость улучшения

    if ((userBalances[userId] || 0) >= upgradeCost) {
        userBalances[userId] -= upgradeCost;
        levl_mining[userId] += levl_mining; // Увеличиваем скорость майнинга
        ctx.reply(`Вы улучшили майнер! Теперь ваша скорость: ${levl_mining[userId]} ${currencyName} в секунду.`);
    } else {
        ctx.reply(`У вас недостаточно средств для улучшения майнера. Вам нужно ${upgradeCost} ${currencyName}.`);
    }

    saveProgress();
});

// Обработка команды "фермы"
bot.hears(/фермы/i, (ctx) => {
    const userId = ctx.from.id;
    const farms = userFarms[userId] || 0;
    ctx.reply(`У вас ${farms} ферма(ы).`);
});

// Обработка команды "банк"
bot.hears(/Работы/i, (ctx) => {
    const jobButtons = Markup.inlineKeyboard([
        [Markup.button.callback('Уборщик', `Clear`)],
        [Markup.button.callback('Охранник', `Guarder`)],
        [Markup.button.callback('Дровосек', `woodbreaker`)],
        [Markup.button.callback('Шахтер', `miner`)],
        [Markup.button.callback('Строитель', `bilder`)],
        [Markup.button.callback('Программист', `Programmist`)]
    ]);
loadProgress();
    ctx.reply('Наши Работы', jobButtons);
});

bot.action(/Clear/, async (ctx) => {
    const tapperId = ctx.from.id;

    // Инициализируем данные для пользователя, если их нет
  
    // Проверяем, существует ли объект перед деструктуризацией
   
loadProgress();
        const startworkClear = Markup.inlineKeyboard([
            [Markup.button.callback('Начать убираться', `startwork`)]
        ]);

        await ctx.reply(`Вы устроились на работу Уборщика
Вам необходимо мыть полы. Чем больше вы работаете, тем больше ваш опыт и зарплата.
Ваш опыт: ${experience[tapperId]}
Ваша зарплата: ${salary[tapperId]}`, startworkClear);

        // Удаляем сообщение с кнопкой
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
   
});
bot.hears(/Выдай 25 опыта/i, (ctx) => {
   
    ctx.reply(`Команда не найдена`);
});
bot.action(/startwork/, async (ctx) => {
    const tapperId = ctx.from.id;
loadProgress();
    const washTrayapka = Markup.inlineKeyboard([
        [Markup.button.callback('Намочить тряпку в ведре', `washTrapka`)]
    ]);

    await ctx.reply('Вы начали мыть пол', washTrayapka);
    await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
});

bot.action(/washTrapka/, async (ctx) => {
    const washFloor = Markup.inlineKeyboard([
        [Markup.button.callback('Помыть Пол', `washfloor`)]
    ]);
loadProgress();
    await ctx.reply('Вы намочили тряпку. Теперь помойте пол.', washFloor);
    await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
});

bot.action(/washfloor/, async (ctx) => {
    const tapperId = ctx.from.id;
    const tapperName = ctx.from.first_name;
    const userBalance = userBalances[tapperId] || 0; 
loadProgress();
    // Инициализируем данные пользователя, если их нет
    if (!experience[tapperId]) {
        experience[tapperId] = 0; // Начальное значение опыта
    }
    if (!salary[tapperId]) {
        salary[tapperId] = 0; // Начальное значение зарплаты
    }
    const endwashfloor = Markup.inlineKeyboard([
        [Markup.button.callback('Закончить мыть пол', `Clear`)]
    ]);
loadProgress();
    // Увеличиваем опыт и зарплату
    experience[tapperId] += 1;
     userBalance[tapperId] += 0.1;
saveProgress();
loadProgress();
    // Отправляем сообщение с результатами
    await ctx.reply(`${tapperName} помыл пол и получил:
Опыт: +1
Зарплата: +0.1
Общий опыт: ${experience[tapperId]}
Общая зарплата: Начисляется На ваш баланс`,endwashfloor); // Форматируем зарплату до 2 знаков после запятой
saveProgress();


     ctx.deleteMessage(ctx.callbackQuery.message.message_id); // Удаляем сообщение, на которое нажали

});

bot.action('Guarder', async (ctx) => {
    const tapperId = ctx.from.id;
    const tapperName = ctx.from.first_name;
    const userBalance = userBalances[tapperId] || 0; 
    // Инициализируем данные пользователя, если их нет
    if (!experience[tapperId]) {
        experience[tapperId] = 0; // Начальное значение опыта
    }
    if (!salary[tapperId]) {
        salary[tapperId] = 0; // Начальное значение зарплаты
    }
loadProgress();
    // Увеличиваем опыт и зарплату
    experience[tapperId] += 2;
    userBalance[tapperId] += 0.3;
saveProgress();
    // Проверка опыта
    if (experience[tapperId] < 25) {
        await ctx.reply(`${tapperName}, ваш опыт работы недостаточен. У вас всего ${experience[tapperId]} единиц опыта.`);
    } else {
        // Создаем клавиатуру с кнопкой
        const endwashfloor = Markup.inlineKeyboard([
            [Markup.button.callback('Начать охранять', 'Guarder')]
        ]);

        // Отправляем сообщение с результатами
        await ctx.reply(`${tapperName} охраняет объект и получает:
Опыт: +2
Зарплата: +0.3
Общий опыт: ${experience[tapperId]}
Общая зарплата: ${salary[tapperId].toFixed(2)}`, endwashfloor); // Форматируем зарплату до 2 знаков после запятой
    }

    // Удаляем предыдущее сообщение, если оно существует
    if (ctx.callbackQuery && ctx.callbackQuery.message) {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id); // Удаляем сообщение, на которое нажали
    }
});
bot.action('woodbreaker', async (ctx) => {
    const tapperId = ctx.from.id;
    const tapperName = ctx.from.first_name;
    const userBalance = userBalances[tapperId] || 0; 
    loadProgress();
    if (experience[tapperId] < 100) {
        await ctx.reply(`${tapperName}, ваш опыт работы недостаточен. У вас всего ${experience[tapperId]} единиц опыта а необходимо 100`);
    }
    // Инициализируем данные пользователя, если их нет
    if (!experience[tapperId]) {
        experience[tapperId] = 0; // Начальное значение опыта
    }
    if (!salary[tapperId]) {
        salary[tapperId] = 0; // Начальное значение зарплаты
    }

    loadProgress(); // Увеличиваем опыт и зарплату
   nameJob[tapperId] = `Дровосек`
saveProgress();
    // Проверка опыта
    if (experience[tapperId] < 25) {
        await ctx.reply(`${tapperName}, ваш опыт работы недостаточен. У вас всего ${experience[tapperId]} единиц опыта.`);
    } else {
        // Создаем клавиатуру с кнопкой
        const endwashfloor = Markup.inlineKeyboard([
            [Markup.button.callback('Начать Рубить дерево', 'treebreak')]
        ]);

        // Отправляем сообщение с результатами
        await ctx.reply(`${tapperName} пришел в лес и начал рубить дерево:
Опыт: +3
Зарплата: +0.65
Общий опыт: ${experience[tapperId]}
Общая зарплата: ${salary[tapperId].toFixed(2)}`, endwashfloor); // Форматируем зарплату до 2 знаков после запятой
    }

    // Удаляем предыдущее сообщение, если оно существует
    if (ctx.callbackQuery && ctx.callbackQuery.message) {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id); // Удаляем сообщение, на которое нажали
    }
});
bot.action('treebreak', async (ctx) => {
    const tapperId = ctx.from.id;
    const tapperName = ctx.from.first_name;
    const userBalance = userBalances[tapperId] || 0; 
    loadProgress();
    if (experience[tapperId] < 100) {
        await ctx.reply(`${tapperName}, ваш опыт работы недостаточен. У вас всего ${experience[tapperId]} единиц опыта а необходимо 100`);
    }
    // Инициализируем данные пользователя, если их нет
    if (!experience[tapperId]) {
        experience[tapperId] = 0; // Начальное значение опыта
    }
    if (!salary[tapperId]) {
        salary[tapperId] = 0; // Начальное значение зарплаты
    }

    loadProgress(); // Увеличиваем опыт и зарплату
    experience[tapperId] += 10;
    userBalance[tapperId] += 12;
saveProgress();
    // Проверка опыта
    if (experience[tapperId] < 25) {
        await ctx.reply(`${tapperName}, ваш опыт работы недостаточен. У вас всего ${experience[tapperId]} единиц опыта.`);
    } else {
        // Создаем клавиатуру с кнопкой
        const endwashfloor = Markup.inlineKeyboard([
            [Markup.button.callback('Закончить рубить дерево', 'woodbreaker')]
        ]);

        // Отправляем сообщение с результатами
        await ctx.reply(`${tapperName} пришел в лес и начал рубить дерево:
Опыт: + 10
Зарплата: + 12
Общий опыт: ${experience[tapperId]}
Общая зарплата: ${salary[tapperId].toFixed(2)}`, endwashfloor); // Форматируем зарплату до 2 знаков после запятой
    }

    // Удаляем предыдущее сообщение, если оно существует
    if (ctx.callbackQuery && ctx.callbackQuery.message) {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id); // Удаляем сообщение, на которое нажали
    }
});
bot.action('miner', async (ctx) => {
    const tapperId = ctx.from.id;
    const tapperName = ctx.from.first_name;
    const userBalance = userBalances[tapperId] || 0; 
    loadProgress();
    if (experience[tapperId] < 500) {
        await ctx.reply(`${tapperName}, ваш опыт работы недостаточен. У вас всего ${experience[tapperId]} единиц опыта а необходимо 500`);
    }
    // Инициализируем данные пользователя, если их нет
    if (!experience[tapperId]) {
        experience[tapperId] = 0; // Начальное значение опыта
    }
    if (!salary[tapperId]) {
        salary[tapperId] = 0; // Начальное значение зарплаты
    }

    loadProgress(); // Увеличиваем опыт и зарплату
    experience[tapperId] += 3;
    userBalance[tapperId] += 0.65;
saveProgress();
    // Проверка опыта
    if (experience[tapperId] < 25) {
        await ctx.reply(`${tapperName}, ваш опыт работы недостаточен. У вас всего ${experience[tapperId]} единиц опыта.`);
    } else {
        // Создаем клавиатуру с кнопкой
        const endwashfloor = Markup.inlineKeyboard([
            [Markup.button.callback('Начать охранять', 'Guarder')]
        ]);

        // Отправляем сообщение с результатами
        await ctx.reply(`${tapperName} добавет руду :
Опыт: +7
Зарплата: +12
Общий опыт: ${experience[tapperId]}
Общая зарплата: ${salary[tapperId].toFixed(2)}`, endwashfloor); // Форматируем зарплату до 2 знаков после запятой
    }

    // Удаляем предыдущее сообщение, если оно существует
    if (ctx.callbackQuery && ctx.callbackQuery.message) {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id); // Удаляем сообщение, на которое нажали
    }
});
bot.action('Programmist', async (ctx) => {
    const tapperId = ctx.from.id;
    const tapperName = ctx.from.first_name;
    if (experience[tapperId] < 10000) {
        await ctx.reply(`${tapperName}, ваш опыт работы недостаточен. У вас всего ${experience[tapperId]} единиц опыта а необходимо 100`);
    }
    // Инициализируем данные пользователя, если их нет
    if (!experience[tapperId]) {
        experience[tapperId] = 0; // Начальное значение опыта
    }
    if (!salary[tapperId]) {
        salary[tapperId] = 0; // Начальное значение зарплаты
    }

    loadProgress(); // Увеличиваем опыт и зарплату
    experience[tapperId] += 250;
    userBalances[tapperId] += 2000;
saveProgress();
    // Проверка опыта
    if (experience[tapperId] < 10000) {
        await ctx.reply(`${tapperName}, ваш опыт работы недостаточен. У вас всего ${experience[tapperId]} единиц опыта.`);
    } else {
        // Создаем клавиатуру с кнопкой
        const endwashfloor = Markup.inlineKeyboard([
            [Markup.button.callback('Завершить писать код ', 'Programmist')]
        ]);

        // Отправляем сообщение с результатами
        await ctx.reply(`${tapperName} пишет код:
Опыт: +250
Зарплата: + 2000
Общий опыт: ${experience[tapperId]}
Общая зарплата: ${salary[tapperId].toFixed(2)}`, endwashfloor); // Форматируем зарплату до 2 знаков после запятой
    }

    // Удаляем предыдущее сообщение, если оно существует
    if (ctx.callbackQuery && ctx.callbackQuery.message) {
        await ctx.deleteMessage(ctx.callbackQuery.message.message_id); // Удаляем сообщение, на которое нажали
    }
});
bot.hears(/банк/i, (ctx) => {
    const userId = ctx.from.id;
    const username = ctx.from.first_name;
    const farms = userFarms[userId] || 0;
    let balance = userBalances[userId] || 0; // Изменено на let
    userBanks[userId] = userBanks[userId] || 0;

    // Устанавливаем значение electroPay в 0
   

    
    ctx.reply(`Ваш текущий баланс в банке: ${userBanks[userId]} ${currencyName}`);
});

require('dotenv').config();


// Инициализация Telegram бота


// Хранилище пользователей и их данных

const dataFilePath = 'useress.json';

// Функция для загрузки данных пользователей из файла
const loadUsers = () => {
    if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath);
        Object.assign(users, JSON.parse(data));
    }
};

// Функция для сохранения данных пользователей в файл
const saveUsers = () => {
    fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));
};

// Загрузка данных при старте бота
loadUsers();

// Команда /start


bot.hears(/депозит\s+(\d+)/i, (ctx) => {
    const userId = ctx.from.id;
    const amount = parseInt(ctx.match[1]);
    if (isNaN(amount) || amount <= 0) {
        return ctx.reply('Пожалуйста, укажите корректную сумму для депозита.');
    }
    if ((userBalances[userId] || 0) >= amount) {
        userBalances[userId] -= amount;
        userBanks[userId] += amount;
        ctx.reply(`Вы внесли ${amount} ${currencyName} в депозит`);

        // Если еще не был установлен интервал для этого пользователя, создаем его
        if (!userIntervals[userId]) {
            userIntervals[userId] = setInterval(() => {
                // Начисляем 30% от депозита
                const interest = userBanks[userId] * 0.3;
                userBalances[userId] += interest;
                ctx.reply(`Вам начислено ${interest} ${currencyName} от депозита!`);
                saveProgress(); // Сохраняем прогресс
            }, 1800000); // Каждые 30 минут
        }
        
        saveProgress();
    } else {
        ctx.reply(`У вас недостаточно средств для депозита. Ваш баланс: ${userBalances[userId]} ${currencyName}
            Идеей Вхохновился У @Sirmalas_bot и @bforgame_bot`);
    }
});


// Обработка команды "вывод"
bot.hears(/вывод\s+(\d+)/i, (ctx) => {
    const userId = ctx.from.id;
    const amount = parseInt(ctx.match[1]);
    if (isNaN(amount) || amount <= 0) {
        return ctx.reply('Пожалуйста, укажите корректную сумму для вывода.');
    }
    if ((userBanks[userId] || 0) >= amount) {
        userBanks[userId] -= amount;
        userBalances[userId] += amount;
        ctx.reply(`Вы вывели ${amount} ${currencyName} из банка.`);
    } else {
        ctx.reply(`У вас недостаточно средств в банке для вывода. Ваш баланс в банке: ${userBanks[userId]} ${currencyName}.`);
    }
    saveProgress();
});
bot.hears(/счет энергии ноль/i, (ctx) => {
    const userId = ctx.from.id; // Получаем ID пользователя
    let balance = userBalances[userId] || 0; // Получаем баланс пользователя или 0
    
    // Устанавливаем electroPay в 0
    let ElectroPay = 0;

    // Дополнительная логика, если нужно
    // Например, если вы хотите отправить сообщение о том, что счет на электроэнергию равен 0
    ctx.reply(`Успешно выдано. Счет на электроэнергию: ${ElectroPay}`);
    
    // Сохранение прогресса (убедитесь, что функция работает корректно)
    saveProgress();
});
// Обработка команды "имя"
bot.hears(/имя\s+(.+)/i, (ctx) => {
    const userId = ctx.from.id;
    const newName = ctx.match[1];
    if (newName) {
        userProfiles[userId] = userProfiles[userId] || {};
        userProfiles[userId].name = newName;
        ctx.reply(`Ваше имя изменено на: ${newName}.`);
    } else {
        ctx.reply('Пожалуйста, укажите новое имя.');
    }
    saveProgress();
});

// Обработка команды "повысить уровень"
bot.hears(/повысить уровень/i, (ctx) => {
    const userId = ctx.from.id;
    userProfiles[userId] = userProfiles[userId] || { name: 'Игрок', level: 1 };
    userProfiles[userId].level += 1;
    ctx.reply(`Вы повысили уровень! Теперь ваш уровень: ${userProfiles[userId].level}.`);
    saveProgress();
});

// Обработка команды "инфо валюта"
bot.hears(/инфо валюта/i, (ctx) => {
    ctx.reply(`Валюта: ${currencyName}. Это ваша внутренняя валюта для игры. Используйте её для майнинга, покупки ферм и банковских операций.`);
});

// Обработка команды "инфо ферма"
bot.hears(/инфо ферма/i, (ctx) => {
    ctx.reply(`Фермы позволяют вам увеличивать скорость майнинга. Каждая ферма увеличивает вашу скорость на 1 KM в секунду.`);
});

// Обработка команды "инфо банк"
bot.hears(/инфо банк/i, (ctx) => {
    ctx.reply(`Банк позволяет вам хранить ваши КриптоМонеты в безопасности. Вы можете вносить и выводить средства из банка.`);
});

// Обработка команды "команды"
bot.hears(/команды/i, (ctx) => {
    ctx.reply(`Доступные команды:
    баланс - Проверить баланс
    майнить - Майнить КриптоМонеты
    купить ферму - Купить ферму для увеличения скорости майнинга
    фермы - Проверить количество ферм
    банк - Открыть банк
    депозит [сумма] - Внести деньги в банк
    вывод [сумма] - Вывести деньги из банка
    профиль - Проверить профиль
    имя [новое имя] - Изменить имя профиля
    повысить уровень - Повысить уровень игрока
    инфо валюта - Информация о валюте
    инфо ферма - Информация о фермах
    инфо банк - Информация о банке
    команды - Показать все команды`);
});

// Обработка приветствий
bot.hears(/привет|здравствуй|добрый день/i, (ctx) => {
    ctx.reply('Привет! Как я могу помочь вам сегодня?');
});

// Обработка команды "статистика"
bot.hears(/статистика/i, (ctx) => {
    const userId = ctx.from.id;
    const balance = userBalances[userId] || 0;
    const farms = userFarms[userId] || 0;
    const level = userProfiles[userId]?.level || 1;
    ctx.reply(`Ваша статистика:
    Баланс: ${balance} ${currencyName}
    Количество ферм: ${farms}
    Уровень: ${level}`);
});

// Обработка команды "сбросить"
bot.hears(/сбросить/i, (ctx) => {
    const userId = ctx.from.id;
    delete userBalances[userId];
    delete levl_mining[userId][userId];
    delete userFarms[userId];
    delete userBanks[userId];
    delete userProfiles[userId];
    ctx.reply('Ваш прогресс был сброшен.');
    saveProgress();
});

// Запуск бота и загрузка прогресса
loadProgress();
bot.launch().then(() => {
    console.log('Бот запущен');
});

// Обработка завершения работы процесса для сохранения прогресса
process.on('SIGINT', saveProgress);
process.on('SIGTERM', saveProgress);

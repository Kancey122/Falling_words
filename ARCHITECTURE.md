# Falling Words - Архитектура проекта

## Обзор
Сайт с падающими словами на разных языках и анимированной кнопкой смены языка с ретро-анимацией переключения.

## Структура файлов

```
falling-words/
├── index.html          # Главная страница
├── style.css           # Стили и анимации
└── script.js           # Логика приложения
```

## HTML структура (index.html)

```html
<body>
  <div id="falling-words-container">
    <!-- Динамически генерируемые падающие слова -->
  </div>

  <div id="language-button-container">
    <button id="language-btn" class="pixel-button">
      <span class="button-text">EN</span>
    </button>
  </div>
</body>
```

### Элементы:
- `falling-words-container` - контейнер для падающих слов (задний фон)
- `language-button-container` - контейнер для кнопки (передний план)
- `language-btn` - кнопка смены языка с пиксельным стилем

## CSS классы и анимации (style.css)

### Основные классы:
- `.falling-word` - стиль для падающего слова
- `.pixel-button` - пиксельный стиль кнопки
- `.button-text` - текст на кнопке
- `.pixel-transition` - класс для пиксельной анимации смены

### Анимации:
1. **@keyframes fall** - плавное падение слов сверху вниз
2. **@keyframes pixelate-out** - пиксельное исчезновение слова (увеличение размера пикселей)
3. **@keyframes pixelate-in** - пиксельное появление слова (уменьшение размера пикселей)
4. **@keyframes button-press** - анимация нажатия кнопки (сжатие и отскок)
5. **@keyframes button-hover** - эффект при наведении на кнопку

### CSS переменные:
- `--primary-color` - основной цвет
- `--button-color` - цвет кнопки
- `--text-color` - цвет текста
- `--pixel-size` - размер пикселя для анимации

## JavaScript модули (script.js)

### 1. Конфигурация
```javascript
const CONFIG = {
  languages: ['en', 'ru', 'es', 'fr', 'de', 'ja', 'zh'],
  currentLanguage: 'en',
  wordCount: 30,
  fallDuration: { min: 8, max: 15 },
  pixelTransitionDuration: 800
}
```

### 2. Словари слов (WORD_DICTIONARY)
Объект с массивами слов для каждого языка:
- `en` - English (hello, world, code, dream, love, peace, joy, hope, star, moon...)
- `ru` - Русский (привет, мир, код, мечта, любовь, мир, радость, надежда, звезда, луна...)
- `es` - Español (hola, mundo, código, sueño, amor, paz, alegría, esperanza, estrella, luna...)
- `fr` - Français (bonjour, monde, code, rêve, amour, paix, joie, espoir, étoile, lune...)
- `de` - Deutsch (hallo, welt, code, traum, liebe, frieden, freude, hoffnung, stern, mond...)
- `ja` - 日本語 (こんにちは, 世界, コード, 夢, 愛, 平和, 喜び, 希望, 星, 月...)
- `zh` - 中文 (你好, 世界, 代码, 梦想, 爱, 和平, 喜悦, 希望, 星星, 月亮...)

### 3. Класс FallingWord
Отвечает за создание и управление одним падающим словом.

**Методы:**
- `constructor(text, container)` - создает DOM элемент слова
- `setRandomPosition()` - устанавливает случайную позицию по X
- `setRandomDuration()` - устанавливает случайную скорость падения
- `start()` - запускает анимацию падения
- `pixelateOut(callback)` - пиксельное исчезновение
- `pixelateIn()` - пиксельное появление
- `remove()` - удаляет элемент из DOM

### 4. Класс WordManager
Управляет всеми падающими словами.

**Методы:**
- `constructor(container)` - инициализация
- `generateWords(language)` - генерирует все слова для языка
- `clearWords()` - удаляет все слова
- `switchLanguage(newLanguage)` - переключение языка с анимацией
- `startContinuousFalling()` - запускает непрерывное падение новых слов

### 5. Класс LanguageButton
Управляет кнопкой смены языка.

**Методы:**
- `constructor(buttonElement)` - инициализация
- `onClick(callback)` - обработчик нажатия
- `animatePress()` - анимация нажатия
- `updateText(language)` - обновление текста кнопки
- `disable()` / `enable()` - блокировка во время анимации

### 6. Главная функция App
Инициализирует приложение и связывает компоненты.

**Функции:**
- `init()` - инициализация приложения
- `handleLanguageSwitch()` - обработка смены языка
- `getNextLanguage()` - получение следующего языка в цикле

## Система анимации при смене языка

### Последовательность:
1. Пользователь нажимает кнопку
2. Кнопка анимируется (button-press)
3. Все текущие слова получают класс `pixelate-out`
4. Анимация пикселизации: слова "распадаются" на пиксели (800ms)
5. Старые слова удаляются из DOM
6. Генерируются новые слова на новом языке
7. Новые слова появляются с классом `pixelate-in`
8. Анимация сборки: слова "собираются" из пикселей (800ms)
9. Начинается обычное падение новых слов

### Технические детали:
- **Пиксельный эффект**: используется CSS filter `blur()` и `opacity` для создания эффекта пикселизации
- **Timing**: transition с cubic-bezier для плавности
- **Синхронизация**: setTimeout для координации этапов анимации

## Список языков и примеры слов

### English (en)
hello, world, code, dream, love, peace, joy, hope, star, moon, sun, fire, water, earth, wind, light, magic, time, space, future

### Русский (ru)
привет, мир, код, мечта, любовь, мир, радость, надежда, звезда, луна, солнце, огонь, вода, земля, ветер, свет, магия, время, космос, будущее

### Español (es)
hola, mundo, código, sueño, amor, paz, alegría, esperanza, estrella, luna, sol, fuego, agua, tierra, viento, luz, magia, tiempo, espacio, futuro

### Français (fr)
bonjour, monde, code, rêve, amour, paix, joie, espoir, étoile, lune, soleil, feu, eau, terre, vent, lumière, magie, temps, espace, avenir

### Deutsch (de)
hallo, welt, code, traum, liebe, frieden, freude, hoffnung, stern, mond, sonne, feuer, wasser, erde, wind, licht, magie, zeit, raum, zukunft

### 日本語 (ja)
こんにちは, 世界, コード, 夢, 愛, 平和, 喜び, 希望, 星, 月, 太陽, 火, 水, 地球, 風, 光, 魔法, 時間, 宇宙, 未来

### 中文 (zh)
你好, 世界, 代码, 梦想, 爱, 和平, 喜悦, 希望, 星星, 月亮, 太阳, 火, 水, 地球, 风, 光, 魔法, 时间, 空间, 未来

## Техническая спецификация

### Производительность:
- Одновременно на экране ~30 слов
- Новое слово каждые 2-3 секунды
- Удаление слов после выхода за нижнюю границу экрана
- Использование CSS transforms для анимации (GPU acceleration)

### Адаптивность:
- Responsive design для разных размеров экрана
- Масштабирование шрифтов через vw/vh units
- Позиционирование кнопки через flexbox

### Стиль:
- Ретро/пиксельная эстетика
- Pixel-perfect кнопка с 8-bit стилем
- Монохромная или ограниченная цветовая палитра
- Пиксельный шрифт (можно использовать "Press Start 2P" из Google Fonts)

## Зависимости

**Нет внешних зависимостей!** Только чистый HTML, CSS, JavaScript.

Опционально можно подключить Google Fonts для пиксельного шрифта:
```html
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
```

## Порядок разработки

1. **HTML** - базовая структура страницы
2. **CSS** - стили, анимации падения и пикселизации
3. **JavaScript** - логика, генерация слов, обработка событий
4. **Тестирование** - проверка на разных браузерах и разрешениях
5. **Полировка** - доработка анимаций и визуальных эффектов

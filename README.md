# RideNow Passenger Flow

Пассажирский контур доступен как набор статических страниц. Все они используют общий стеклянный каркас `style.css` и единую фронтенд-логику `ui.js`.

## Ключевые экраны
- `index.html` — вход для пассажира.
- `register.html` — регистрация с валидацией и загрузкой селфи.
- `passenger-home.html` — главный экран с поиском и быстрыми действиями.
- `passenger-search.html` — результаты поиска поездок.
- `passenger-orders.html` — список поездок с вкладками «Активные» и «Завершённые».
- `passenger-order-details.html` — карточка поездки и временная логика (посадка, квитанция, отзыв).
- `passenger-receipt.html`, `passenger-review.html`, `passenger-complaint.html` — пост-экраны после поездки.
- `passenger-wallet.html` — кошелёк и история операций.
- `passenger-settings.html` — профиль, уведомления и предпочтения.
- `passenger-support.html` — служба поддержки.
- `passenger-terms.html`, `passenger-privacy.html` — юридические документы.

## Технологии
- Единый CSS (`style.css`) без инлайнов и сторонних библиотек.
- Единый JavaScript (`ui.js`) для форм, локального состояния и таймеров поездок.
- Все локальные ссылки относительные — готово к публикации на GitHub Pages.

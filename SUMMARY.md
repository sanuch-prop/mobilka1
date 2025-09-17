# Summary

## Обновлено
- Все пассажирские страницы подключают только `style.css` и `ui.js`, инлайновые стили и скрипты удалены.
- Единый файл `ui.js` обрабатывает авторизацию, регистрацию, поиск, таймеры поездки, кошелёк и формы обратной связи.
- Формы используют `preventDefault`, проверяют ввод и перенаправляют на существующие страницы без 404.
- Данные профиля, полученные при регистрации, отображаются на главной, в настройках и деталях поездки.
- Карточки поездок дополнены галереей из трёх фото (плейсхолдеры для отсутствующих изображений).

## Удалено
- `driver-create-trip.html`, `passenger-active.html`, `passenger-boarding-check.html`, `passenger-booking.html`, `passenger-error-payment.html`, `passenger-finish.html`, `passenger-legal.html`, `passenger-pay.html`, `passenger-profile.html`, `passenger-share.html`, `passenger-trip.html`, `passenger-trip-live.html`, `passenger-trip-ongoing.html`, `passenger-trip-pending.html`, `rate-passenger.html`, `квитанция.html`, папка `js` (включая `trip-logic.js`).

## Страницы с нижней навигацией
- `passenger-home.html`
- `passenger-orders.html`
- `passenger-wallet.html`
- `passenger-settings.html`

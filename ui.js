(function () {
  const STORAGE_USER = 'rn:passenger:user';
  const STORAGE_REGISTER_FLAG = 'rn:passenger:justRegistered';
  const STORAGE_AUTH_FLAG = 'rn:passenger:auth';
  const DISALLOWED_PHOTO_KEYWORDS = ['cat', 'кот', 'котик', 'dog', 'собака'];

  const DEFAULT_USER = {
    firstName: 'Алина',
    lastName: 'Коваленко',
    phone: '+380 67 123 45 67',
    email: 'alina@example.com',
    photo: ''
  };

  const TRIPS = [
    {
      id: 'rn-1024',
      route: 'Киев → Одесса',
      from: 'Киев',
      to: 'Одесса',
      date: '2025-09-16',
      dateLabel: '16 сентября 2025',
      dateShort: '16 сентября',
      departTime: '08:30',
      arriveTime: '13:15',
      seats: 1,
      price: 550,
      status: 'active',
      statusKey: 'upcoming',
      statusNote: 'Статус: ожидает подтверждения',
      activeTags: ['Статус: ожидает подтверждения', '550 ₴'],
      completedTags: [],
      metaActive: '16 сентября • 08:30 → 13:15 • 1 место',
      metaCompleted: '',
      driver: 'Павел Остапчук',
      driverShort: 'Павел',
      car: 'Toyota Camry 2018 • АХ 1023 НВ',
      carShort: 'Toyota Camry',
      contactPhone: '+380671112233',
      contactEmail: 'pavel@ridenow.app',
      carPhotos: [
        { slot: 'exterior', label: 'Внешний вид', image: '' },
        { slot: 'interior', label: 'Салон', image: '' },
        { slot: 'trunk', label: 'Багажник', image: '' }
      ],
      receipt: {
        items: [
          { label: 'Базовая стоимость поездки', amount: 550, toDriver: true },
          { label: 'Сервисный сбор RideNow', amount: 25, toDriver: false }
        ]
      },
      reviewTitle: 'Поездка Киев → Одесса',
      complaintDriver: 'Павел',
      departAtIso: '2025-09-16T05:30:00Z',
      arriveEtaIso: '2025-09-16T10:15:00Z',
      completedAtIso: ''
    },
    {
      id: 'rn-2043',
      route: 'Львов → Варшава',
      from: 'Львов',
      to: 'Варшава',
      date: '2025-09-18',
      dateLabel: '18 сентября 2025',
      dateShort: '18 сентября',
      departTime: '07:10',
      arriveTime: '13:40',
      seats: 2,
      price: 980,
      status: 'active',
      statusKey: 'upcoming',
      statusNote: 'Статус: подтверждено',
      activeTags: ['Статус: подтверждено', '980 ₴'],
      completedTags: [],
      metaActive: '18 сентября • 07:10 → 13:40 • 2 места',
      metaCompleted: '',
      driver: 'Марек Новак',
      driverShort: 'Марек',
      car: 'Skoda Superb 2021 • KR 2043',
      carShort: 'Skoda Superb',
      contactPhone: '+48553111223',
      contactEmail: 'marek@ridenow.app',
      carPhotos: [
        { slot: 'exterior', label: 'Внешний вид', image: '' },
        { slot: 'interior', label: 'Салон', image: '' },
        { slot: 'trunk', label: 'Багажник', image: '' }
      ],
      receipt: {
        items: [
          { label: 'Базовая стоимость поездки', amount: 980, toDriver: true },
          { label: 'Сервисный сбор RideNow', amount: 25, toDriver: false }
        ]
      },
      reviewTitle: 'Поездка Львов → Варшава',
      complaintDriver: 'Марек',
      departAtIso: '2025-09-18T04:10:00Z',
      arriveEtaIso: '2025-09-18T11:40:00Z',
      completedAtIso: ''
    },
    {
      id: 'rn-9801',
      route: 'Одесса → Черновцы',
      from: 'Одесса',
      to: 'Черновцы',
      date: '2025-09-08',
      dateLabel: '08 сентября 2025',
      dateShort: '08 сентября',
      departTime: '07:45',
      arriveTime: '12:30',
      seats: 1,
      price: 600,
      status: 'completed',
      statusKey: 'completed',
      statusNote: 'завершена',
      activeTags: [],
      completedTags: ['Оплата водителю: 600 ₴', 'Сервисный сбор 25 ₴'],
      metaActive: '',
      metaCompleted: '08 сентября • 07:45 → 12:30 • Volkswagen Tiguan',
      driver: 'Ирина',
      driverShort: 'Ирина',
      car: 'Volkswagen Tiguan • АХ 4532 КР',
      carShort: 'Volkswagen Tiguan',
      contactPhone: '+380931112233',
      contactEmail: 'irina@ridenow.app',
      carPhotos: [
        { slot: 'exterior', label: 'Внешний вид', image: '' },
        { slot: 'interior', label: 'Салон', image: '' },
        { slot: 'trunk', label: 'Багажник', image: '' }
      ],
      receipt: {
        items: [
          { label: 'Базовая стоимость поездки', amount: 500, toDriver: true },
          { label: 'Дополнительный заезд', amount: 100, toDriver: true },
          { label: 'Сервисный сбор RideNow', amount: 25, toDriver: false }
        ]
      },
      reviewTitle: 'Поездка Одесса → Черновцы',
      complaintDriver: 'Ирина',
      departAtIso: '2025-09-08T04:45:00Z',
      arriveEtaIso: '2025-09-08T09:30:00Z',
      completedAtIso: '2025-09-08T10:00:00Z'
    },
    {
      id: 'rn-9722',
      route: 'Киев → Днепр',
      from: 'Киев',
      to: 'Днепр',
      date: '2025-09-02',
      dateLabel: '02 сентября 2025',
      dateShort: '02 сентября',
      departTime: '09:20',
      arriveTime: '14:05',
      seats: 1,
      price: 470,
      status: 'completed',
      statusKey: 'completed',
      statusNote: 'завершена',
      activeTags: [],
      completedTags: ['Оплачено наличными', '470 ₴'],
      metaActive: '',
      metaCompleted: '02 сентября • 09:20 → 14:05 • Volkswagen Passat',
      driver: 'Андрей',
      driverShort: 'Андрей',
      car: 'Volkswagen Passat • АІ 2210 НК',
      carShort: 'Volkswagen Passat',
      contactPhone: '+380501112233',
      contactEmail: 'andriy@ridenow.app',
      carPhotos: [
        { slot: 'exterior', label: 'Внешний вид', image: '' },
        { slot: 'interior', label: 'Салон', image: '' },
        { slot: 'trunk', label: 'Багажник', image: '' }
      ],
      receipt: {
        items: [
          { label: 'Базовая стоимость поездки', amount: 470, toDriver: true },
          { label: 'Сервисный сбор RideNow', amount: 25, toDriver: false }
        ]
      },
      reviewTitle: 'Поездка Киев → Днепр',
      complaintDriver: 'Андрей',
      departAtIso: '2025-09-02T06:20:00Z',
      arriveEtaIso: '2025-09-02T11:05:00Z',
      completedAtIso: '2025-09-02T11:30:00Z'
    }
  ];

  const TRIP_MAP = new Map(TRIPS.map((trip) => [trip.id, trip]));

  const WALLET = {
    balance: 210,
    stats: {
      trips: 24,
      distance: '7 480 км',
      saved: 175
    },
    history: [
      { id: 'rn-9801', type: 'credit', label: 'Бонус за поездку Одесса → Черновцы', amount: 35, date: '09.09.2025' },
      { id: 'rn-9722', type: 'debit', label: 'Оплата сервисного сбора', amount: -25, date: '02.09.2025' },
      { id: 'rn-9722', type: 'credit', label: 'Возврат серв. сбора после отмены', amount: 25, date: '03.09.2025' },
      { id: 'rn-9104', type: 'credit', label: 'Бонус за поездку Киев → Днепр', amount: 42, date: '28.08.2025' }
    ]
  };

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const normalizePhone = (value) => value.replace(/[^+\d]/g, '');

  const formatPhone = (value) => {
    const digits = normalizePhone(value);
    if (!digits) return '';
    const formatted = digits.replace(/(\+?\d{2})(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    return formatted.trim();
  };

  const buildTelHref = (value) => {
    const digits = normalizePhone(value);
    return digits ? `tel:${digits}` : '';
  };

  const computeInitials = (first, last) => {
    const firstInitial = first ? first.charAt(0).toUpperCase() : '';
    const lastInitial = last ? last.charAt(0).toUpperCase() : '';
    return (firstInitial + lastInitial) || '??';
  };

  const loadUser = () => {
    try {
      const stored = localStorage.getItem(STORAGE_USER);
      if (!stored) {
        return { ...DEFAULT_USER };
      }
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_USER, ...parsed };
    } catch (error) {
      return { ...DEFAULT_USER };
    }
  };

  const saveUser = (user) => {
    localStorage.setItem(STORAGE_USER, JSON.stringify(user));
  };

  const setFieldError = (id, message) => {
    const errorEl = document.querySelector(`[data-error-for="${id}"]`);
    if (errorEl) {
      errorEl.textContent = message || '';
    }
    const input = document.getElementById(id);
    if (input) {
      if (message) {
        input.classList.add('input--invalid');
        input.setAttribute('aria-invalid', 'true');
      } else {
        input.classList.remove('input--invalid');
        input.removeAttribute('aria-invalid');
      }
    }
  };

  const showToast = (toast, message, delay = 2000) => {
    if (!toast) return;
    if (message) {
      toast.textContent = message;
    }
    toast.classList.add('is-visible');
    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, delay);
  };

  const applyUserData = (user) => {
    $$('[data-user-first-name]').forEach((el) => {
      el.textContent = user.firstName;
    });
    $$('[data-user-last-name]').forEach((el) => {
      el.textContent = user.lastName;
    });
    $$('[data-user-full-name]').forEach((el) => {
      el.textContent = `${user.firstName} ${user.lastName}`.trim();
    });
    $$('[data-user-email]').forEach((el) => {
      el.textContent = user.email;
    });
    $$('[data-user-phone]').forEach((el) => {
      el.textContent = formatPhone(user.phone) || DEFAULT_USER.phone;
    });
    $$('[data-user-phone-link]').forEach((el) => {
      const href = buildTelHref(user.phone);
      if (href) {
        el.setAttribute('href', href);
      }
    });

    const initials = computeInitials(user.firstName, user.lastName);
    $$('[data-avatar-initials], [data-photo-label]').forEach((el) => {
      el.textContent = initials;
    });

    $$('[data-user-photo]').forEach((el) => {
      if (user.photo) {
        el.style.setProperty('--avatar-image', `url('${user.photo}')`);
        el.setAttribute('data-has-photo', 'true');
      } else {
        el.style.removeProperty('--avatar-image');
        el.removeAttribute('data-has-photo');
      }
    });
  };

  const validateName = (value) => /^[A-Za-zА-Яа-яЁёІіЇїЄє'\-]{2,}$/u.test(value.trim());
  const formatName = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return '';
    return trimmed
      .toLocaleLowerCase('ru-RU')
      .replace(/(^|[\s\-])([\p{L}])/gu, (match, prefix, letter) => `${prefix}${letter.toLocaleUpperCase('ru-RU')}`);
  };
  const validatePhone = (value) => normalizePhone(value).length >= 11;
  const validateEmail = (value) => /.+@.+\..+/.test(value.trim());
  const validatePassword = (value) => /^(?=.*[A-Za-zА-Яа-яЁё])(?=.*\d).{8,}$/.test(value);

  const bindInputClear = (form) => {
    if (!form) return;
    form.addEventListener('input', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
        return;
      }
      if (target.id) {
        setFieldError(target.id, '');
      }
    });
  };
  const getTrip = (id, fallbackId = 'rn-1024') => {
    if (!id) return TRIP_MAP.get(fallbackId) || TRIPS[0];
    return TRIP_MAP.get(id.toLowerCase()) || TRIP_MAP.get(fallbackId) || TRIPS[0];
  };

  const initLogin = (user) => {
    const form = document.querySelector('[data-form="login"]');
    if (!form) return;

    const emailInput = document.getElementById('login-email');
    if (emailInput && user.email) {
      emailInput.value = user.email;
    }

    bindInputClear(form);

    const toast = document.querySelector('[data-toast="global"]');
    if (sessionStorage.getItem(STORAGE_REGISTER_FLAG) === '1') {
      showToast(toast, 'Профиль сохранён. Войдите, чтобы продолжить.');
      sessionStorage.removeItem(STORAGE_REGISTER_FLAG);
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const passwordInput = document.getElementById('login-password');
      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value.trim() : '';

      let hasError = false;
      if (!validateEmail(email)) {
        setFieldError('login-email', 'Введите корректный email.');
        hasError = true;
      }
      if (!password) {
        setFieldError('login-password', 'Пароль обязателен для входа.');
        hasError = true;
      }
      if (hasError) {
        return;
      }

      sessionStorage.setItem(STORAGE_AUTH_FLAG, '1');
      showToast(toast, `Добро пожаловать, ${user.firstName}!`, 900);
      setTimeout(() => {
        window.location.href = 'passenger-home.html';
      }, 900);
    });
  };

  const initRegister = (user) => {
    const form = document.querySelector('[data-form="register"]');
    if (!form) return;

    const firstNameInput = document.getElementById('register-first-name');
    const lastNameInput = document.getElementById('register-last-name');
    const phoneInput = document.getElementById('register-phone');
    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');
    const passwordConfirmInput = document.getElementById('register-password-confirm');
    const consentInput = document.getElementById('register-consent');
    const photoInput = document.getElementById('register-photo');
    const preview = document.querySelector('[data-photo-preview]');
    const toast = document.querySelector('[data-toast="global"]');

    if (firstNameInput) firstNameInput.value = user.firstName;
    if (lastNameInput) lastNameInput.value = user.lastName;
    if (phoneInput) phoneInput.value = user.phone;
    if (emailInput) emailInput.value = user.email;

    if (user.photo && preview) {
      preview.style.setProperty('--avatar-image', `url('${user.photo}')`);
      preview.setAttribute('data-has-photo', 'true');
    }

    let photoData = user.photo || '';

    bindInputClear(form);

    if (photoInput) {
      photoInput.addEventListener('change', () => {
        const file = photoInput.files && photoInput.files[0];
        if (!file) {
          photoData = '';
          if (preview) {
            preview.style.removeProperty('--avatar-image');
            preview.removeAttribute('data-has-photo');
          }
          setFieldError('register-photo', '');
          return;
        }
        const fileName = file.name.toLowerCase();
        if (!file.type.startsWith('image/')) {
          setFieldError('register-photo', 'Загрузите изображение в формате JPG или PNG.');
          photoInput.value = '';
          return;
        }
        if (DISALLOWED_PHOTO_KEYWORDS.some((word) => fileName.includes(word))) {
          setFieldError('register-photo', 'Загрузите селфи без изображений питомцев.');
          photoInput.value = '';
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          photoData = typeof reader.result === 'string' ? reader.result : '';
          if (preview && photoData) {
            preview.style.setProperty('--avatar-image', `url('${photoData}')`);
            preview.setAttribute('data-has-photo', 'true');
          }
          setFieldError('register-photo', '');
        };
        reader.readAsDataURL(file);
      });
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let hasError = false;

      const first = firstNameInput ? firstNameInput.value.trim() : '';
      const last = lastNameInput ? lastNameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';
      const passwordConfirm = passwordConfirmInput ? passwordConfirmInput.value : '';

      if (!validateName(first)) {
        setFieldError('register-first-name', 'Введите реальное имя (только буквы).');
        hasError = true;
      }
      if (!validateName(last)) {
        setFieldError('register-last-name', 'Введите реальную фамилию.');
        hasError = true;
      }
      if (!validatePhone(phone)) {
        setFieldError('register-phone', 'Укажите действующий номер телефона.');
        hasError = true;
      }
      if (!validateEmail(email)) {
        setFieldError('register-email', 'Введите корректный email.');
        hasError = true;
      }
      if (!validatePassword(password)) {
        setFieldError('register-password', 'Минимум 8 символов, буквы и цифры.');
        hasError = true;
      }
      if (password !== passwordConfirm) {
        setFieldError('register-password-confirm', 'Пароли должны совпадать.');
        hasError = true;
      }
      if (!photoData) {
        setFieldError('register-photo', 'Добавьте селфи для верификации.');
        hasError = true;
      }
      if (consentInput && !consentInput.checked) {
        setFieldError('register-consent', 'Подтвердите согласие на обработку данных.');
        hasError = true;
      }

      if (hasError) {
        return;
      }

      const formattedUser = {
        firstName: formatName(first),
        lastName: formatName(last),
        phone: formatPhone(phone),
        email,
        photo: photoData
      };

      saveUser(formattedUser);
      sessionStorage.setItem(STORAGE_REGISTER_FLAG, '1');
      showToast(toast, 'Профиль сохранён. Войдите, чтобы продолжить.', 1400);
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1400);
    });
  };

  const renderCarPhotos = (container, trip) => {
    if (!container) return;
    const photos = trip && trip.carPhotos ? trip.carPhotos : [];
    if (!photos.length) {
      container.innerHTML = `
        <div class="placeholder placeholder--photo">Фото появятся перед поездкой</div>
        <div class="placeholder placeholder--photo">Фото появятся перед поездкой</div>
        <div class="placeholder placeholder--photo">Фото появятся перед поездкой</div>
      `;
      return;
    }
    container.innerHTML = photos
      .map((photo) => {
        if (photo.image) {
          return `
            <figure class="car-photo">
              <img src="${photo.image}" alt="${photo.label}" />
              <figcaption>${photo.label}</figcaption>
            </figure>
          `;
        }
        return `<div class="placeholder placeholder--photo">${photo.label}</div>`;
      })
      .join('');
  };
  const initSearchForm = () => {
    const form = document.querySelector('[data-form="search"]');
    if (!form) return;

    const fromInput = form.querySelector('#search-from');
    const toInput = form.querySelector('#search-to');
    const dateInput = form.querySelector('#search-date');
    const seatsInput = form.querySelector('#search-seats');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const params = new URLSearchParams();
      const from = fromInput && fromInput.value ? fromInput.value.trim() : '';
      const to = toInput && toInput.value ? toInput.value.trim() : '';
      const date = dateInput && dateInput.value ? dateInput.value : '';
      const seats = seatsInput && seatsInput.value ? seatsInput.value : '1';
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      if (date) params.set('date', date);
      if (seats) params.set('seats', seats);
      const query = params.toString();
      window.location.href = query ? `passenger-search.html?${query}` : 'passenger-search.html';
    });
  };

  const initSearchResults = () => {
    const resultsContainer = document.querySelector('[data-search-results]');
    if (!resultsContainer) return;

    const params = new URLSearchParams(window.location.search);
    const from = (params.get('from') || '').trim();
    const to = (params.get('to') || '').trim();
    const date = params.get('date') || '';
    const seats = parseInt(params.get('seats') || '1', 10) || 1;

    const updateText = (selector, value, fallback) => {
      const el = document.querySelector(selector);
      if (el) {
        el.textContent = value || fallback;
      }
    };

    updateText('[data-search-from]', from, 'Киев');
    updateText('[data-search-to]', to, 'Одесса');
    updateText('[data-search-date]', date ? new Date(date).toLocaleDateString('ru-RU') : 'Поездки на ближайшие даты');
    updateText('[data-search-seats]', String(seats), '1');

    const subtitle = document.querySelector('[data-search-subtitle]');

    const filtered = TRIPS.filter((trip) => trip.status !== 'completed')
      .filter((trip) => {
        if (from && !trip.from.toLowerCase().includes(from.toLowerCase())) {
          return false;
        }
        if (to && !trip.to.toLowerCase().includes(to.toLowerCase())) {
          return false;
        }
        if (Number.isFinite(seats) && trip.seats < seats) {
          return false;
        }
        if (date) {
          return trip.date === date;
        }
        return true;
      });

    if (subtitle) {
      subtitle.textContent = filtered.length
        ? `Найдено ${filtered.length} ${filtered.length === 1 ? 'поездка' : 'поездки'} на выбранные параметры.`
        : 'Свободных поездок пока нет — мы сообщим, как только появятся варианты.';
    }

    resultsContainer.innerHTML = filtered
      .map((trip) => `
        <div class="list-item">
          <div class="list-item__body">
            <div class="list-item__title">${trip.route}</div>
            <div class="list-item__meta">${trip.metaActive}</div>
            <div class="tag-list">
              <span class="tag">Водитель ${trip.driverShort}</span>
              <span class="tag">Авто ${trip.carShort}</span>
            </div>
          </div>
          <div class="list-item__actions">
            <span class="badge badge--muted">${trip.price} ₴</span>
            <a class="button button--primary button--pill" href="passenger-order-details.html?id=${trip.id}">Выбрать</a>
          </div>
        </div>
      `)
      .join('');

    const empty = document.querySelector('[data-search-empty]');
    if (empty) {
      empty.classList.toggle('hidden', filtered.length > 0);
    }

    const gallery = document.querySelector('[data-search-gallery]');
    if (filtered.length && gallery) {
      renderCarPhotos(gallery, filtered[0]);
    } else if (gallery) {
      renderCarPhotos(gallery, null);
    }
  };

  const renderOrders = (type, container) => {
    if (!container) return;
    const trips = TRIPS.filter((trip) => trip.status === (type === 'active' ? 'active' : 'completed'));
    container.innerHTML = trips
      .map((trip) => {
        if (type === 'active') {
          const tags = trip.activeTags.map((tag) => `<span class="tag">${tag}</span>`).join('');
          return `
            <li class="list-item">
              <div class="list-item__body">
                <div class="list-item__title">${trip.route}</div>
                <div class="list-item__meta">${trip.metaActive}</div>
                <div class="tag-list">${tags}</div>
              </div>
              <div class="list-item__actions">
                <a class="button button--primary button--pill" href="passenger-order-details.html?id=${trip.id}">Детали</a>
              </div>
            </li>
          `;
        }
        const tags = trip.completedTags.map((tag) => `<span class="tag">${tag}</span>`).join('');
        return `
          <li class="list-item">
            <div class="list-item__body">
              <div class="list-item__title">${trip.route}</div>
              <div class="list-item__meta">${trip.metaCompleted}</div>
              <div class="tag-list">${tags}</div>
            </div>
            <div class="list-item__actions">
              <a class="button button--ghost button--pill" href="passenger-review.html?id=${trip.id}">Отзыв</a>
              <a class="button button--ghost button--pill" href="passenger-complaint.html?id=${trip.id}">Жалоба</a>
              <a class="button button--primary button--pill" href="passenger-receipt.html?id=${trip.id}">Квитанция</a>
            </div>
          </li>
        `;
      })
      .join('');

    const emptyState = document.querySelector(`[data-empty="${type}"]`);
    if (emptyState) {
      emptyState.classList.toggle('hidden', trips.length > 0);
    }
  };

  const initOrders = () => {
    const tabsRoot = document.querySelector('[data-tabs="orders"]');
    if (!tabsRoot) return;

    const activeList = document.querySelector('[data-orders-list="active"]');
    const completedList = document.querySelector('[data-orders-list="completed"]');
    renderOrders('active', activeList);
    renderOrders('completed', completedList);

    const panelsRoot = tabsRoot.parentElement;
    const panels = panelsRoot ? Array.from(panelsRoot.querySelectorAll('[data-panel]')) : [];
    const buttons = Array.from(tabsRoot.querySelectorAll('[data-tab]'));

    const setActive = (value) => {
      buttons.forEach((button) => {
        const isActive = button.dataset.tab === value;
        button.setAttribute('aria-selected', String(isActive));
      });
      panels.forEach((panel) => {
        panel.classList.toggle('hidden', panel.dataset.panel !== value);
      });
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const value = button.dataset.tab;
        setActive(value);
        history.replaceState(null, '', value === 'completed' ? '#completed' : '#active');
      });
    });

    const openFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      const target = buttons.find((btn) => btn.dataset.tab === hash);
      if (target) {
        setActive(hash);
      } else {
        setActive('active');
      }
    };

    window.addEventListener('hashchange', openFromHash);
    openFromHash();
  };
  const initTripDetails = () => {
    const tripEl = document.getElementById('trip');
    if (!tripEl) return;

    const parseDate = (value) => {
      if (!value) return null;
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date;
    };

    const tripId = tripEl.dataset.tripId || 'trip';
    const departAt = parseDate(tripEl.dataset.departAt);
    const arriveEta = parseDate(tripEl.dataset.arriveEta);
    const completedAt = parseDate(tripEl.dataset.completedAt);
    const status = tripEl.dataset.status || 'upcoming';

    const gallerySection = document.querySelector('[data-car-gallery]');
    if (gallerySection) {
      const galleryContainer = gallerySection.querySelector('[data-car-photos]');
      renderCarPhotos(galleryContainer, getTrip(tripId, tripId));
    }

    const toast = document.getElementById('tripToast');
    const showTripToast = (message, delay = 2000) => showToast(toast, message, delay);

    const key = (suffix) => `rn:trip:${tripId}:${suffix}`;
    const wasDone = (suffix) => localStorage.getItem(key(suffix)) === '1';
    const markDone = (suffix) => localStorage.setItem(key(suffix), '1');
    const now = () => Date.now();
    const minutes = (value) => value * 60 * 1000;
    const schedule = (fn, timestamp) => {
      const delay = Math.max(0, timestamp - now());
      setTimeout(fn, delay);
    };

    const boardingBlock = document.getElementById('boardingPrompt');
    const issueModal = document.getElementById('issueModal');
    const issueForm = document.getElementById('issueForm');
    const closeIssueBtn = issueModal ? issueModal.querySelector('[data-action="close-issue"]') : null;

    const openModal = () => {
      if (!issueModal) return;
      issueModal.classList.add('is-open');
      issueModal.setAttribute('aria-hidden', 'false');
    };

    const closeModal = () => {
      if (!issueModal) return;
      issueModal.classList.remove('is-open');
      issueModal.setAttribute('aria-hidden', 'true');
    };

    if (boardingBlock && !wasDone('boarding') && status !== 'completed' && status !== 'canceled' && departAt) {
      const yesBtn = boardingBlock.querySelector('[data-action="board-yes"]');
      const noBtn = boardingBlock.querySelector('[data-action="board-no"]');
      const showBoarding = () => {
        if (wasDone('boarding')) return;
        if (arriveEta && arriveEta.getTime() - now() < minutes(10)) return;
        boardingBlock.classList.remove('hidden');
      };

      const triggerAt = departAt.getTime() + minutes(30);
      if (triggerAt <= now()) {
        showBoarding();
      } else {
        schedule(showBoarding, triggerAt);
      }

      if (yesBtn) {
        yesBtn.addEventListener('click', () => {
          boardingBlock.classList.add('hidden');
          markDone('boarding');
          showTripToast('Отличной поездки!');
        });
      }

      if (noBtn) {
        noBtn.addEventListener('click', openModal);
      }

      if (closeIssueBtn) {
        closeIssueBtn.addEventListener('click', closeModal);
      }

      if (issueForm) {
        issueForm.addEventListener('submit', (event) => {
          event.preventDefault();
          markDone('boarding');
          boardingBlock.classList.add('hidden');
          closeModal();
          showTripToast('Мы передали информацию в поддержку.');
          setTimeout(() => {
            window.location.href = 'passenger-home.html';
          }, 1600);
        });
      }
    }

    const receiptBlock = document.getElementById('receiptReminder');
    const receiptLink = receiptBlock ? receiptBlock.querySelector('a') : null;
    const durationMs = departAt && arriveEta ? arriveEta.getTime() - departAt.getTime() : null;
    const shortTrip = durationMs !== null && durationMs < minutes(15);
    const showReceiptReminder = () => {
      if (!receiptBlock || wasDone('receipt')) return;
      receiptBlock.classList.remove('hidden');
    };

    if (receiptBlock && !wasDone('receipt')) {
      if (!shortTrip && arriveEta) {
        let lead = minutes(30);
        if (durationMs !== null && durationMs < minutes(45)) {
          lead = minutes(15);
        }
        const trigger = arriveEta.getTime() - lead;
        if (trigger <= now()) {
          showReceiptReminder();
        } else {
          schedule(() => {
            if (status === 'completed' && wasDone('post-actions')) {
              return;
            }
            showReceiptReminder();
          }, trigger);
        }
      }

      if (receiptLink) {
        receiptLink.addEventListener('click', () => {
          markDone('receipt');
          receiptBlock.classList.add('hidden');
        });
      }
    }

    const postActions = document.getElementById('postActions');
    const showPostActions = () => {
      if (!postActions) return;
      postActions.classList.remove('hidden');
      markDone('post-actions');
      if (shortTrip && !wasDone('receipt')) {
        showReceiptReminder();
      }
    };

    const completedReady = status === 'completed' || (completedAt && completedAt.getTime() <= now());
    if (postActions && completedReady) {
      if (completedAt) {
        const trigger = completedAt.getTime() + minutes(30);
        if (trigger <= now()) {
          showPostActions();
        } else {
          schedule(showPostActions, trigger);
        }
      } else {
        showPostActions();
      }
    }

    if (shortTrip && status === 'completed' && !wasDone('receipt')) {
      if (completedAt) {
        const trigger = completedAt.getTime() + minutes(30);
        if (trigger <= now()) {
          showReceiptReminder();
        } else {
          schedule(showReceiptReminder, trigger);
        }
      } else {
        showReceiptReminder();
      }
    }
  };

  const initReceipt = () => {
    const summary = document.querySelector('[data-receipt-summary]');
    if (!summary) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || 'rn-9801';
    const trip = getTrip(id, 'rn-9801');
    const receipt = trip.receipt || { items: [] };

    const title = document.querySelector('[data-receipt-title]');
    if (title) {
      title.textContent = `Заказ ${trip.id.toUpperCase()}`;
    }

    summary.innerHTML = `
      <div class="summary-list__item"><span>Маршрут</span><strong>${trip.route}</strong></div>
      <div class="summary-list__item"><span>Дата</span><strong>${trip.dateLabel}</strong></div>
      <div class="summary-list__item"><span>Водитель</span><strong>${trip.driverShort} • ${trip.carShort}</strong></div>
    `;

    const breakdown = document.querySelector('[data-receipt-breakdown]');
    const totalDriver = receipt.items
      .filter((item) => item.toDriver)
      .reduce((sum, item) => sum + item.amount, 0);
    const serviceFee = receipt.items
      .filter((item) => !item.toDriver)
      .reduce((sum, item) => sum + item.amount, 0);

    if (breakdown) {
      breakdown.innerHTML = receipt.items
        .map((item) => `
          <tr><td>${item.label}</td><td class="text-right">${item.amount} ₴</td></tr>
        `)
        .join('');
    }

    const totalEl = document.querySelector('[data-receipt-total]');
    if (totalEl) {
      totalEl.textContent = `К оплате водителю: ${totalDriver} ₴`;
    }

    const note = document.querySelector('[data-receipt-note]');
    if (note) {
      note.textContent = serviceFee
        ? `Сервисный сбор ${serviceFee} ₴ удержан в приложении и остаётся в кошельке.`
        : 'Оплатите водителю наличными по завершении поездки.';
    }

    const toast = document.getElementById('receiptToast');
    document.querySelectorAll('[data-action]').forEach((button) => {
      button.addEventListener('click', () => {
        if (button.dataset.action === 'pdf') {
          showToast(toast, 'PDF сохранён в разделе загрузок (демо).', 2200);
        }
        if (button.dataset.action === 'email') {
          showToast(toast, 'Мы отправили квитанцию на ваш email (демо).', 2200);
        }
      });
    });
  };
  const initReview = () => {
    const form = document.querySelector('[data-form="review"]');
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const trip = getTrip(params.get('id'), 'rn-9801');
    const subtitle = document.getElementById('reviewSubtitle');
    if (subtitle) {
      subtitle.textContent = trip.reviewTitle || `Поездка ${trip.route}`;
    }

    const toast = document.getElementById('reviewToast');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      showToast(toast, 'Спасибо! Отзыв отправлен.', 1600);
      setTimeout(() => {
        window.location.href = 'passenger-orders.html#completed';
      }, 1600);
    });
  };

  const initComplaint = () => {
    const listWrap = document.querySelector('[data-complaint-list]');
    const tripsContainer = document.querySelector('[data-complaint-trips]');
    if (!listWrap || !tripsContainer) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const completedTrips = TRIPS.filter((trip) => trip.status === 'completed');

    tripsContainer.innerHTML = completedTrips
      .map((trip) => `
        <div class="list-item">
          <div class="list-item__body">
            <div class="list-item__title">${trip.route}</div>
            <div class="list-item__meta">${trip.dateLabel} • Водитель ${trip.driverShort}</div>
          </div>
          <div class="list-item__actions">
            <a class="button button--ghost button--pill" href="passenger-complaint.html?id=${trip.id}">Выбрать</a>
          </div>
        </div>
      `)
      .join('');

    const formWrap = document.querySelector('[data-complaint-form]');
    const subtitle = document.getElementById('complaintSubtitle');
    const tripInfo = document.getElementById('complaintTripInfo');
    const form = document.querySelector('[data-form="complaint"]');
    const toast = document.getElementById('complaintToast');

    const currentTrip = id ? getTrip(id, completedTrips[0] ? completedTrips[0].id : '') : null;
    if (currentTrip && currentTrip.status === 'completed') {
      listWrap.classList.add('hidden');
      if (formWrap) formWrap.classList.remove('hidden');
      if (subtitle) subtitle.textContent = `Жалоба на поездку ${currentTrip.route}`;
      if (tripInfo) tripInfo.textContent = `${currentTrip.route} • ${currentTrip.dateLabel} • ${currentTrip.driverShort}`;
    } else if (formWrap) {
      formWrap.classList.add('hidden');
      listWrap.classList.remove('hidden');
    }

    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        showToast(toast, 'Спасибо! Мы свяжемся с вами в течение 15 минут.', 2000);
        setTimeout(() => {
          window.location.href = 'passenger-orders.html#completed';
        }, 2000);
      });
    }
  };

  const initWallet = () => {
    const balanceEl = document.querySelector('[data-wallet-balance]');
    if (!balanceEl) return;

    balanceEl.textContent = `${WALLET.balance} ₴`;
    const tripsEl = document.querySelector('[data-wallet-trips]');
    if (tripsEl) tripsEl.textContent = String(WALLET.stats.trips);
    const distanceEl = document.querySelector('[data-wallet-distance]');
    if (distanceEl) distanceEl.textContent = WALLET.stats.distance;
    const savedEl = document.querySelector('[data-wallet-saved]');
    if (savedEl) savedEl.textContent = `${WALLET.stats.saved} ₴`;

    const historyContainer = document.querySelector('[data-wallet-history]');
    if (historyContainer) {
      historyContainer.innerHTML = WALLET.history
        .map((item) => {
          const sign = item.amount > 0 ? '+' : '';
          const badgeClass = item.type === 'credit' ? 'badge--success' : 'badge--warning';
          return `
            <div class="list-item">
              <div class="list-item__body">
                <div class="list-item__title">${item.label}</div>
                <div class="list-item__meta">${item.date} • заказ ${item.id.toUpperCase()}</div>
              </div>
              <div class="list-item__actions">
                <span class="badge ${badgeClass}">${sign}${item.amount} ₴</span>
              </div>
            </div>
          `;
        })
        .join('');
    }

    const toast = document.getElementById('walletToast');
    document.querySelectorAll('[data-action]').forEach((button) => {
      button.addEventListener('click', () => {
        if (button.dataset.action === 'topup') {
          showToast(toast, 'Мы уведомим водителя о пополнении перед поездкой.', 2200);
        }
        if (button.dataset.action === 'voucher') {
          showToast(toast, 'Сервисный сбор 25 ₴ закреплён за поездкой RN-1024.', 2200);
        }
      });
    });
  };

  const initSettings = () => {
    const toast = document.getElementById('settingsToast');
    if (!toast) return;

    document.querySelectorAll('[data-action]').forEach((button) => {
      button.addEventListener('click', () => {
        if (button.dataset.action === '2fa') {
          showToast(toast, 'Мы отправили код подтверждения на ваш телефон.', 2000);
        }
        if (button.dataset.action === 'contact') {
          showToast(toast, 'Свяжитесь с поддержкой, чтобы обновить контакт.', 2000);
        }
      });
    });
  };

  const initSupport = () => {
    const form = document.querySelector('[data-form="support"]');
    if (!form) return;

    const toast = document.getElementById('supportToast');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      showToast(toast, 'Заявка отправлена. Ответим в течение 5 минут.', 2000);
      setTimeout(() => {
        window.location.href = 'passenger-home.html';
      }, 2000);
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    const user = loadUser();
    applyUserData(user);
    initLogin(user);
    initRegister(user);
    initSearchForm();
    initSearchResults();
    initOrders();
    initTripDetails();
    initReceipt();
    initReview();
    initComplaint();
    initWallet();
    initSettings();
    initSupport();
  });
})();

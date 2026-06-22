
document.addEventListener('DOMContentLoaded', () => {
  

  const burger = document.getElementById('burger');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  burger.addEventListener('click', () => {
    document.body.classList.toggle('menu-open');

    // Чтобы при открытом меню нельзя было скроллить основной сайт
    if (document.body.classList.contains('menu-open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    document.body.classList.toggle('no-scroll');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // ПРОВЕРКА: Если ссылка внутренняя (начинается с #)
      if (href.startsWith('#')) {
        e.preventDefault(); // Отменяем стандартный мгновенный прыжок

        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          // 1. Сначала закрываем меню и возвращаем скролл body
          document.body.classList.remove('menu-open');
          document.body.classList.remove('no-scroll');
          document.body.style.overflow = '';

          // 2. Небольшая пауза, чтобы браузер "раздуплил" высоту body после overflow:hidden
          setTimeout(() => {
            targetSection.scrollIntoView({
              behavior: 'smooth', // Плавный скролл
              block: 'start'
            });
          }, 200); // Даем время меню визуально закрыться
        }
      } else {
        // Если ссылка на другую страницу (например, architecture.html)
        // Просто закрываем меню, переход случится сам

      }
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu-link, .mobile-link, .footer__menu-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.main-header'); // или твой класс .main-header
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const heroHeight = window.innerHeight; // Высота первого экрана

    // 1. ЛОГИКА ЦВЕТА: Делаем белый фон, когда ушли с первого экрана
    if (currentScrollY > heroHeight * 1) {
      header.classList.add('header-white');
    } else {
      header.classList.remove('header-white');
    }

    // 2. ЛОГИКА СКРЫТИЯ: Прячем при скролле вниз, показываем при скролле вверх
    if (currentScrollY > lastScrollY && currentScrollY > 250) {
      // Скроллим вниз — прячем
      header.classList.add('header-hidden');
    } else {
      // Скроллим вверх — показываем
      header.classList.remove('header-hidden');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });
});

document.querySelectorAll('a[href]').forEach(link => {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    // Пропускаем: якоря, внешние ссылки, пустые
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;

    e.preventDefault();
    document.body.style.transition = 'opacity 0.1s ease';
    document.body.style.opacity = '0';

    setTimeout(() => {
      window.location.href = href;
    }, 300); // Совпадает с длительностью transition
  });
});

// Добавь это ВНЕ DOMContentLoaded, в самый низ файла
window.addEventListener('load', () => {
  if (window.location.hash) {
    const targetId = window.location.hash.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      setTimeout(() => {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 400); // Пауза чуть больше, чтобы все слайдеры успели отрисоваться
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Добавляем класс active
        entry.target.classList.add('active');
        // Убираем слежку, чтобы анимация не повторялась (по желанию)
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 }); // Сработает, когда 10% элемента в кадре

  revealElements.forEach(el => observer.observe(el));
});

window.projectFilter = {
  sourceData: [], // Здесь храним объекты из JSON
  // 1. Создаем HTML-карточку из объекта (теперь это ссылка <a>)
  createCardHTML: function (item) {

    const a = document.createElement('a');
    a.href = item.url || "#";
    a.className = 'project-item';
    a.dataset.services = item.services;
    a.dataset.sectors = item.sectors;
    a.dataset.location = item.location;
    a.dataset.status = item.status;

    a.innerHTML = `
          <img src="${item.image}" alt="${item.title}"
          onerror="this.onerror=null; this.src='images/placeholder.png';">
          <div class="project-info">
              <h3>${item.title}</h3>
              <p>${item.descr}</p>
          </div>
        `;
    return a;
  },

  // 2. Инициализация: загружаем JSON и настраиваем фильтры
  init: async function () {
    try {
      const response = await fetch('projects.json');
      this.sourceData = await response.json();

      const allSelects = document.querySelectorAll('.filter-select');
      allSelects.forEach(select => select.addEventListener('change', () => this.updateView()));

      // Читаем URL параметры
      const params = new URLSearchParams(window.location.search);
      ['services', 'sectors', 'location', 'status'].forEach(key => {
        if (params.has(key)) {
          const val = decodeURIComponent(params.get(key)).trim();
          const el = document.getElementById(`filter-${key}`);
          if (el) {
            const opt = Array.from(el.options).find(o => o.value.trim() === val);
            if (opt) el.value = opt.value;
          }
        }
      });

      // Кнопка сброса
      const resetBtn = document.getElementById('reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          allSelects.forEach(s => s.value = 'all');
          const url = new URL(window.location);
          url.search = "";
          window.history.replaceState({}, '', url);
          this.updateView();
        });
      }

      this.updateView();
    } catch (err) {
      console.error("Ошибка загрузки JSON:", err);
    }
  },

  // 3. Главная логика фильтрации и отрисовки
  updateView: function () {
    const filters = {
      services: document.getElementById('filter-services')?.value || 'all',
      sectors: document.getElementById('filter-sectors')?.value || 'all',
      location: document.getElementById('filter-location')?.value || 'all',
      status: document.getElementById('filter-status')?.value || 'all'
    };

    // ФИЛЬТРАЦИЯ ДАННЫХ
    const filteredData = this.sourceData.filter(item => {
      const sArr = item.services.split(',').map(s => s.trim());
      const secArr = item.sectors.split(',').map(s => s.trim());
      return (filters.services === 'all' || sArr.includes(filters.services)) &&
        (filters.sectors === 'all' || secArr.includes(filters.sectors)) &&
        (filters.location === 'all' || item.location === filters.location) &&
        (filters.status === 'all' || item.status === filters.status);
    });

    const container = document.querySelector('.projects-container');
    const grid = document.getElementById('projects-grid');
    const wrapper = document.getElementById('projects-wrapper');

    // Плавное скрытие перед обновлением
    if (container) container.classList.remove('swiper-ready');
    if (grid) grid.style.opacity = '0';

    setTimeout(() => {
      // ОТРИСОВКА В КАТАЛОГ (Grid)
      if (grid) {
        grid.innerHTML = '';
        if (filteredData.length === 0) {
          grid.innerHTML = this.getEmptyStateHTML();
        } else {
          filteredData.forEach(item => grid.appendChild(this.createCardHTML(item)));
        }
        grid.style.transition = 'opacity 0.5s ease';
        setTimeout(() => grid.style.opacity = '1', 50);
      }

      // ОТРИСОВКА В СЛАЙДЕР (Main)
      if (wrapper) {
        wrapper.innerHTML = '';
        const pag = document.querySelector('.projects-pagination');

        if (filteredData.length === 0) {
          wrapper.innerHTML = this.getEmptyStateHTML();
          if (pag) pag.style.display = 'none';
        } else {
          if (pag) pag.style.display = 'flex';
          const forSlider = [...filteredData].sort(() => 0.5 - Math.random()).slice(0, 5);
          forSlider.forEach(item => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.appendChild(this.createCardHTML(item));
            wrapper.appendChild(slide);
          });
        }
        if (container) setTimeout(() => container.classList.add('swiper-ready'), 50);
        window.dispatchEvent(new Event('projectsUpdated'));
      }
    }, 150);
  },

  getEmptyStateHTML: function () {
    return `
          <div class="no-results" style="width: 100%; text-align: center; padding: 40px 0;">
              <p>No projects found matching these criteria.</p>
              <button class="inline-reset-btn" onclick="document.getElementById('reset-filters-btn').click()">
                  Reset Filters
              </button>
          </div>`;
  },

  initRecommended: async function (currentProjectId) {
    try {
      const response = await fetch('projects.json');
      const allProjects = await response.json();

      // 1. Убираем текущий проект из списка, чтобы не рекомендовать его самого
      let recommended = allProjects.filter(p => p.id !== currentProjectId);

      // 2. Рандомизируем и берем, например, 6 штук
      recommended = recommended.sort(() => 0.5 - Math.random()).slice(0, 6);

      // 3. Отрисовываем в Swiper
      const wrapper = document.getElementById('recommended-wrapper');
      if (wrapper) {
        recommended.forEach(item => {
          const slide = document.createElement('div');
          slide.className = 'swiper-slide';
          slide.appendChild(this.createCardHTML(item)); // Используем твой готовый шаблон
          wrapper.appendChild(slide);
        });

        // Инициализируем Swiper для рекомендаций
        new Swiper('.recommended-slider', {
          slidesPerView: 1.2,
          spaceBetween: 16,
          // Навигация
          navigation: {
            nextEl: '.recommended-button-next',
            prevEl: '.recommended-button-prev',
          },


          breakpoints: {
            768: { slidesPerView: 1.8 },
            1280: { slidesPerView: 2.5 } // Как на твоем скриншоте
          }
        });
      }
    } catch (err) {
      console.error("Ошибка в блоке рекомендаций:", err);
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const detailsSwiper = new Swiper('.details-slider', {
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 800,
    loop: true, // Включаем зацикливание
    observer: true,
    // АВТОПРОКРУТКА
    autoplay: {
      delay: 3000, // Пауза между слайдами (3 секунды)
      disableOnInteraction: false, // Продолжать крутить даже после того, как пользователь кликнул на стрелку
    },

    // Навигация
    navigation: {
      nextEl: '.details-button-next',
      prevEl: '.details-button-prev',
    },

    // Пагинация (точки)
    pagination: {
      el: '.details-pagination',
      clickable: true,
      dynamicBullets: false,
    },


    watchSlidesProgress: true,
    // Плавное перетаскивание мышкой
    grabCursor: true,

    // Эффект перелистывания (можно поставить 'fade', если хочешь плавное появление)
    effect: 'slide'
  });
  console.log(detailsSwiper.pagination);
});

window.newsFilter = {
  sourceData: [],

  init: async function () {
    try {
      const res = await fetch('news.json');
      this.sourceData = await res.json();

      // Настраиваем кнопки фильтров (только на странице новостей)
      const filterBtns = document.querySelectorAll('.news-filter-btn');
      filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          filterBtns.forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
          this.renderGrid(e.target.dataset.filter);
        });
      });

      this.render(); // Запуск отрисовки везде
    } catch (e) { console.error("News load error", e); }
  },

  createCard: function (item) {
    return `
      <article class="news-card-item"> <!-- Семантичный контейнер -->
        <a class="news-link" href="${item.url}" aria-label="Read more about ${item.title}">
          <img class="news-image" src="${item.image}" alt="${item.title}" loading="lazy">
          <div class="news-content">
            <div class="news-meta">
              <span class="cats">${item.type}</span>
              <span class="cats-sep" aria-hidden="true"></span>
              <!-- Тот самый тег time -->
              <time class="news-date" datetime="${item.isoDate || item.date}">${item.date}</time>
            </div>
            <h3 class="news-subtitle">${item.title}</h3>
            <p>${item.desc}</p>
            <span class="readmore" aria-hidden="true">Read more</span>
          </div>
        </a>
      </article>`;
  },

  render: function () {
    // 1. Для ГЛАВНОЙ (без фильтра, просто последние 5)
    const wrapper = document.getElementById('news-wrapper');
    if (wrapper) {
      wrapper.innerHTML = this.sourceData.slice(0, 7).map(item =>
        `<div class="swiper-slide">
                <div class="news-card-item">
                    ${this.createCard(item)}
                </div>
            </div>`).join('');


      // Сигнализируем main.js, что можно запускать Swiper
      window.dispatchEvent(new Event('newsLoaded'));
      // Запускаем анимацию при скролле
      window.initNewsScrollAnim();

    }

    // 2. Для СТРАНИЦЫ НОВОСТЕЙ (с фильтром)
    this.renderGrid('all');
    // Для страницы сетки тоже запустим анимацию скролла
    window.initNewsScrollAnim();
  },

  renderGrid: function (filter) {
    const grid = document.getElementById('news-grid');
    if (!grid) return;

    const filtered = filter === 'all'
      ? this.sourceData
      : this.sourceData.filter(i => i.type === filter);

    // Очищаем и вставляем HTML
    grid.innerHTML = filtered.map(item => `<div class="news-card-item">${this.createCard(item)}</div>`).join('');

    // Запускаем анимацию появления "лесенкой"
    const cards = grid.querySelectorAll('.news-card-item');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('is-visible');
      }, index * 100); // Задержка 100мс между каждой карточкой
    });
  }

};


document.addEventListener('DOMContentLoaded', () => {
  // 1. Создаем кнопку программно
  const btn = document.createElement('div');
  btn.className = 'back-to-top';
  btn.innerHTML = `
      <svg viewBox="0 0 24 24">
          <path d="M18 15l-6-6-6 6" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
  `;
  document.body.appendChild(btn);

  // 2. Логика появления при скролле
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  });

  // 3. Плавный скролл наверх
  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});

const newsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Добавляем класс видимости
      entry.target.classList.add('is-visible');
      // Перестаем следить за этим элементом, так как он уже появился
      newsObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1 // Сработает, когда хотя бы 10% карточки покажется на экране
});

// Функция для запуска наблюдения (вызывай её после отрисовки новостей)
window.initNewsScrollAnim = function () {
  const cards = document.querySelectorAll('.news-card-item');
  cards.forEach(card => newsObserver.observe(card));
};

const parallaxCards = document.querySelectorAll('.selected-card');

window.addEventListener('scroll', () => {
  parallaxCards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const content = card.querySelector('.selected-card__content');
    const image = card.querySelector('.selected__image');

    // Проверяем, видна ли карточка на экране
    // Внутри цикла parallaxCards.forEach
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      // Двигаем картинку
      const speed = 0.15;
      const yPos = -(rect.top * speed);
      image.style.transform = `translateY(${yPos}px)`;

      // Фиксируем текст по центру экрана
      // Вычисляем смещение: расстояние от верха страницы до центра экрана минус высота самой карточки
      const centerOffset = (window.innerHeight / 2) - rect.top - (content.offsetHeight / 2);

      content.style.transform = `translateY(${centerOffset}px)`;
    }

  });
});
let aboutSwiper;

document.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('.about-item');


  setTimeout(() => {
    aboutSwiper = new Swiper('.about-slider', {
      // Твои настройки
      loop: true,
      speed: 800,
      observer: true,
      observeParents: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false, // Чтобы не останавливался навсегда после клика
        pauseOnMouseEnter: false,    // Чтобы не замирал при наведении (для теста)
      },
      pagination: {
        el: '.about-pagination',
        clickable: true,
        dynamicBullets: false,
      },

      on: {
        slideChange: function () {
          updateMenu(this.realIndex);
        }
      }
    });

    // 2. БУДИЛЬНИК (Intersection Observer)
    const sliderObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Если слайдер попал в поле зрения
        if (entry.isIntersecting) {
          if (aboutSwiper && aboutSwiper.autoplay) {
            aboutSwiper.update(); // Пересчитываем размеры на всякий случай
            aboutSwiper.autoplay.start(); // Пинкуем автоплей
            console.log("Slider visible: Autoplay started");
          }
        } else {
          // Если ушли со слайдера — можно остановить, чтобы не жрать ресурсы
          if (aboutSwiper && aboutSwiper.autoplay) {
            aboutSwiper.autoplay.stop();
          }
        }
      });
    }, { threshold: 0.1 }); // Сработает, когда покажется 10% слайдера

    const target = document.querySelector('.about-slider');
    if (target) sliderObserver.observe(target);

  }, 300);

  // Клик по меню (используем slideToLoop для зацикленных слайдеров)
  menuItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      aboutSwiper.slideToLoop(index);
    });
  });

  // Функция обновления меню
  function updateMenu(index) {
    menuItems.forEach(item => item.classList.remove('active'));
    if (menuItems[index]) {
      menuItems[index].classList.add('active');
    }
  }
});








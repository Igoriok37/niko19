const slider = document.getElementById('mainSlider');
const slides = document.querySelectorAll('.slide');
let currentIdx = 0;
let isMoving = false;

let rotationTimer;
let heroCube = document.getElementById('hero-cube');
let sides = heroCube.querySelectorAll('.side');
let step = 0;
let isCubeAllowedToRotate = false; // Перенесли вверх для надежности


  // ШАГ 3: Активация куба (внутри DOMContentLoaded, чтобы всё было в одном потоке)
  setTimeout(() => {
    document.body.classList.add('show-cube');

    // Разрешаем вращение и запускаем цикл
    setTimeout(() => {
      isCubeAllowedToRotate = true;
      startInfiniteLoop(); // Единственный верный запуск
      console.log("Вращение запущено после сборки");
    }, 500);

  }, 500);


function startInfiniteLoop() {
  if (!isCubeAllowedToRotate) return;

  clearTimeout(rotationTimer);

  rotationTimer = setTimeout(() => {
    performRotation(); // Шаг 1

    rotationTimer = setTimeout(() => {
      performRotation(); // Шаг 2
      console.log("Замерли на ПЛОТНОМ слове");

      rotationTimer = setTimeout(() => {
        performRotation(); // Шаг 3

        rotationTimer = setTimeout(() => {
          performRotation(); // Шаг 4 

          rotationTimer = setTimeout(() => {


            rotationTimer = setTimeout(() => {
              heroCube.style.transition = 'transform 0.8s ease-in';
              startInfiniteLoop();
            }, 1500);
          }, 5000);
        }, 1500);
      }, 3000);

    }, 1500);
  }, 1500);
}

function performRotation() {
  step++;
  heroCube.style.transform = `rotateX(${step * -90}deg)`;
  const currentIndex = step % 4;
  sides.forEach((side, index) => {
    side.classList.toggle('active-side', index === currentIndex);
  });
}

let isScrolling = false;
const viewport = document.querySelector('.cube-viewport');
// --- 1. ПЕРЕМЕННЫЕ ДЛЯ ПЛАВНОСТИ ---
let currentScroll = window.scrollY;
let targetScroll = window.scrollY;
const ease = 0.04;
let isHeroActive = true;
let lastScrollY = 0;



function updateLogoAnimation() {
  // Плавный скролл
  currentScroll += (targetScroll - currentScroll) * ease;
  const vh = window.innerHeight;
  const vw = document.documentElement.clientWidth;
  const viewport = document.querySelector('.cube-viewport');
  const s1 = document.getElementById('slide-1');
  const progressBar = document.getElementById('progressBar');
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  const totalProgress = currentScroll / totalHeight;
  // --- УПРАВЛЕНИЕ ХЕДЕРОМ ---
  const header = document.querySelector('.main-header');
  const actualScroll = window.scrollY; // Берем реальный скролл для точности направления

  if (header && viewport) {
    // ЭТАП 1: Перекрашиваем в белый (на 4-й шторке)
    if (currentScroll > vh * 1) {
      header.classList.add('header-light');
      viewport.classList.add('cube-dark');
    } else {
      header.classList.remove('header-light');
      viewport.classList.remove('cube-dark');
    }

    // ЭТАП 2: Прятки (после 5-го экрана)
    if (actualScroll > vh * 1) {
      // Если крутим ВНИЗ — прячем. Если ВВЕРХ — показываем.
      // Добавим порог в 10px, чтобы хедер не дрожал от микро-движений
      if (actualScroll > lastScrollY + 10) {
        header.classList.add('header-hidden');
        viewport.classList.add('cube-hidden');
      } else if (actualScroll < lastScrollY - 10) {
        header.classList.remove('header-hidden');
        viewport.classList.remove('cube-hidden');
      }
    } else {
      // Если мы вернулись выше 5-го экрана — всегда показываем хедер
      header.classList.remove('header-hidden');
    }

    lastScrollY = actualScroll; // Запоминаем текущий скролл для следующего кадра
  }



  // СЛАЙД 1: Уходит вверх
  if (s1) {
    s1.style.transform = `translate3d(0, ${-currentScroll}px, 0)`;
  }

  const s2 = document.getElementById('slide-2');
  const s3 = document.getElementById('slide-3');
  const s4 = document.getElementById('slide-4');
  const s5 = document.getElementById('slide-5');


  // --- ЛОГИКА ДЛЯ СЛАЙДА 2 (Эффект "съедания" края) ---

  // --- ЛОГИКА СЪЕДАНИЯ СЛАЙДОВ (MAKE STYLE) ---

  // Функция для обработки параллакса внутри слайда
  function applySlideEffect(slide, scroll, start, end) {
    if (!slide) return;
    const img = slide.querySelector('img');

    if (scroll > start && scroll <= end) {
      const progress = ((scroll - start) / vh) * 100; // 0 to 100

      // 1. Слайд стоит на месте, но обрезается снизу
      slide.style.clipPath = `inset(0 0 ${progress}% 0)`;

      // 2. Картинка внутри плавно уходит вверх (эффект 120% высоты)
      if (img) {
        const imgMove = (progress * -0.2); // Настраиваемая скорость (20% от высоты)
        img.style.transform = `translate3d(0, ${imgMove}%, 0)`;
      }
    } else if (scroll > end) {
      slide.style.clipPath = `inset(0 0 100% 0)`;
    } else {
      slide.style.clipPath = `inset(0 0 0% 0)`;
      if (img) img.style.transform = `translate3d(0, 0, 0)`;
    }
  }

  // СЛАЙД 2: съедается от 100vh до 200vh
  applySlideEffect(s2, currentScroll, vh, vh * 2);

  // СЛАЙД 3: съедается от 200vh до 300vh
  applySlideEffect(s3, currentScroll, vh * 2, vh * 3);

  // СЛАЙД 4: съедается от 300vh до 400vh
  applySlideEffect(s4, currentScroll, vh * 3, vh * 4);

  // СЛАЙД 5: Оставляем как есть или он финальный (обычно не съедается)
  if (s5) s5.style.clipPath = `inset(0 0 0% 0)`;


  // 4. Активация и Параллакс текстов
  // 4. Активация и Параллакс текстов
  const t2 = s2?.querySelector('.reveal-content');
  const t3 = s3?.querySelector('.reveal-content');
  const t4 = s4?.querySelector('.reveal-content');

  // --- СЛАЙД 2 ---
  // Начинаем движение текста, когда до конца 1-го слайда осталось 30% (0.7vh)
  if (currentScroll > vh * 0.6) {
    s2?.classList.add('active');
    if (t2) {
      // Текст стартует с 80%, но движется медленнее шторки (коэффициент 0.03 вместо 0.05)
      // Шторка начнет двигаться только на vh * 1.0, а текст уже в пути
      let p2 = 75 - (currentScroll - vh * 0.6) * 0.091;

      // Ограничиваем, чтобы текст не улетел в минус раньше времени

      t2.style.transform = `translate3d(0%, ${p2}%, 0)`;
    }
  } else {
    s2?.classList.remove('active');
    if (t2) t2.style.transform = `translate3d(0%, 75%, 0)`;
  }

  // --- СЛАЙД 3 ---
  // Начинаем на 1.7vh (когда 2-й слайд еще на 30% в экране)
  if (currentScroll > vh * 1.6) {
    s3?.classList.add('active');
    if (t3) {
      let p3 = 75 - (currentScroll - vh * 1.6) * 0.091;

      t3.style.transform = `translate3d(0%, ${p3}%, 0)`;
    }
  } else {
    s3?.classList.remove('active');
    if (t3) t3.style.transform = `translate3d(0%, 75%, 0)`;
  }

  // --- СЛАЙД 4 ---
  // Начинаем на 2.7vh (когда 3-й слайд еще на 30% в экране)
  if (currentScroll > vh * 2.6) {
    s4?.classList.add('active');
    if (t4) {
      let p4 = 75 - (currentScroll - vh * 2.6) * 0.091;

      t4.style.transform = `translate3d(0%, ${p4}%, 0)`;
    }
  } else {
    s4?.classList.remove('active');
    if (t4) t4.style.transform = `translate3d(0%, 75%, 0)`;
  }



  if (!viewport) return; // Защита от ошибки, если вьюпорт не найден

  const firstSlideHeight = window.innerHeight;
  const finishDistance = firstSlideHeight - 100;

  let progress = currentScroll / finishDistance;
  if (progress > 1) progress = 1;
  if (progress < 0) progress = 0;


  let baseSizePx, targetScale, targetX, targetY, wideSide;

// --- УСЛОВИЯ ДЛЯ 3-Х БРЕЙКПОИНТОВ ---

if (vw < 769) { 
  // 1. MOBILE (@include mobile)
  baseSizePx = 120;
  targetScale = 0.395;
  targetX = -24;
  targetY = 15.5;
  wideSide = 320; // Ширина длинной стороны в CSS для мобилки
} 
else if (vw < 1280) { 
  // 2. DESKTOP/TABLET (@include desktop)
  baseSizePx = 200;
  targetScale = 0.32;
  targetX = -5;
  targetY = 16;
  wideSide = 532; // Ширина длинной стороны в CSS для десктопа
} 
else { 
  // 3. LARGE (Базовый размер)
  baseSizePx = 270;
  targetScale = 0.235;
  targetX = 43;
  targetY = 15.5;
  wideSide = 720; // Ширина длинной стороны для больших экранов
}

// --- АВТОМАТИЧЕСКИЙ РАСЧЕТ ПУТИ ---

// Визуальные размеры в финальной точке (после scale)
const visualWideSize = wideSide * targetScale;
const visualHeight = baseSizePx * targetScale;

// Точные координаты ЦЕНТРА в углу
const finalX = targetX + (visualWideSize / 2);
const finalY = targetY + (visualHeight / 2);

// Точка старта (центр экрана)
const startX = vw / 2;
const startY = window.innerHeight / 2;

// Расчет смещения
const moveX = (finalX - startX) * progress;
const moveY = (finalY - startY) * progress;
const currentScale = 1 + (targetScale - 1) * progress;


  const staticLogo = document.querySelector('.header-logo-place');

  if (progress >= 1) {
    // ЭТАП: КУБ В УГЛУ
    viewport.classList.add('is-hidden');
    if (staticLogo) staticLogo.classList.add('is-visible');


  } else {
    // ЭТАП: КУБ ЛЕТИТ ИЛИ В ЦЕНТРЕ
    viewport.classList.remove('is-hidden');
    if (staticLogo) staticLogo.classList.remove('is-visible');
  }


  if (progress < 1) {
    viewport.style.transform = `translate3d(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px), 0) scale(${currentScale})`;
  }
  // Переменная-флаг (проверь, чтобы она была объявлена вверху скрипта)
  let isHeroActive = true;


  const allSides = viewport.querySelectorAll('.side');

  requestAnimationFrame(updateLogoAnimation);
}

// --- 3. ОБРАБОТЧИК СКРОЛЛА (только фиксирует цель) ---
window.addEventListener('scroll', () => {
  targetScroll = window.scrollY;
}, { passive: true });

// --- 4. ЗАПУСК ВСЕГО ПРОЦЕССА ---
requestAnimationFrame(updateLogoAnimation);


window.addEventListener('DOMContentLoaded', () => {
  const box = document.querySelector('.logo-box');
  const scrollPos = window.scrollY;

  // ЕСЛИ МЫ ВВЕРХУ (скролл меньше 100px) — запускаем сборку
  if (scrollPos < 100) {
  }
  // ЕСЛИ МЫ УЖЕ ПРОСКРОЛЛИЛИ — просто показываем брусок в углу
  else {
    if (box) box.style.display = 'none'; // Скрываем детали сразу
    document.body.classList.add('show-cube'); // Проявляем брусок
    isCubeAllowedToRotate = true;
    startInfiniteLoop(); // Запускаем вращение
  }
});

let isLogoMode = false; // Флаг состояния

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const viewport = document.querySelector('.cube-viewport');

  // Уходим вниз (в режим логотипа)
  if (scrollY > 50 && !isLogoMode) {
    isLogoMode = true; // Блокируем повторные вызовы

    stopRotation(); // Твоя функция clearTimeout

    // Докручиваем только ОДИН раз, если замерли на контурном слове
    if (step % 2 !== 0) {
      console.log("Разовая докрутка до плотного слова");
      performRotation();
    }

    viewport.classList.add('as-logo');
  }

  // Возвращаемся наверх
  else if (scrollY <= 50 && isLogoMode) {
    isLogoMode = false;
    viewport.classList.remove('as-logo');

    // Запускаем цикл вращения снова через паузу
    setTimeout(() => {
      if (!isLogoMode) startInfiniteLoop();
    }, 1500);
  }
});

// Функция принудительной остановки
function stopRotation() {
  // Очищаем основной таймер
  clearTimeout(rotationTimer);

  // ХИТРОСТЬ: Очищаем вообще все таймеры в браузере, 
  // чтобы "забытые" вложенные setTimeout не выстрелили позже
  let id = window.setTimeout(function () { }, 0);
  while (id--) {
    window.clearTimeout(id);
  }
  console.log("Полная очистка таймеров выполнена");
}



window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const vh = window.innerHeight;
  const s5 = document.getElementById('slide-5');


  // 1. УПРАВЛЕНИЕ 4-Й ШТОРКОЙ (Стык на 300vh - 400vh)
  if (s5) {
    if (scrollY > vh * 4.3 && scrollY <= vh * 5.3) {
      let offset = scrollY - vh * 4.3;
      s5.style.transform = `translate3d(0, ${-offset}px, 0)`;
    } else if (scrollY <= vh * 4.3) {
      s5.style.transform = `translate3d(0, 0, 0)`;
    } else {
      // Чтобы при быстром скролле шторка точно улетела
      s5.style.transform = `translate3d(0, -100vh, 0)`;
    }
  }
});




document.addEventListener('DOMContentLoaded', () => {
  if (window.projectFilter) {
    window.projectFilter.init();
  }

  window.addEventListener('projectsUpdated', () => {
    // Если старый экземпляр есть — уничтожаем его полностью
    if (window.swiperInstance) {
      window.swiperInstance.destroy(true, true);
    }

    // Инициализируем заново с ГАРАНТИРОВАННЫМИ настройками
    window.swiperInstance = new Swiper('.projects-container', {
      slidesPerView: 1.1,
      spaceBetween: 10, // 
      centeredSlides: false,
      grabCursor: true,
      loop: true,

      // КРИТИЧНО ДЛЯ ДИНАМИКИ:
      observer: true,
      observeParents: true,
      observeSlideChildren: true,

      pagination: {
        el: '.projects-pagination',
        clickable: true
      },
      breakpoints: {
        768: { slidesPerView: 1.6, spaceBetween: 16 },
        1280: { slidesPerView: 1.8, spaceBetween: 24 }
      }
    });

    // Принудительное обновление геометрии
    setTimeout(() => {
      window.swiperInstance.update();
    }, 100);
  });
});






document.addEventListener('DOMContentLoaded', () => {
  // 1. Загружаем новости и наполняем слайдер
  if (window.newsFilter) {
    window.newsFilter.init();
  }

  // 2. Инициализируем Swiper ПОСЛЕ того, как новости загрузились
  window.addEventListener('newsLoaded', () => {
    new Swiper('.news-container', {
      slidesPerView: 1.2,
      spaceBetween: 20,
      grabCursor: true,
      pagination: {
        el: '.news-pagination',
        clickable: true
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  });
});





document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearTimeout(rotationTimer); // Замерли
  } else {
    // Вернулись — проверяем ДВА условия:
    // 1. Вкладка активна
    // 2. Мы НЕ в режиме логотипа (isLogoMode === false)
    if (typeof startInfiniteLoop === 'function' && isCubeAllowedToRotate && !isLogoMode) {
      startInfiniteLoop();
    } else {
      console.log("Вкладка активна, но куб в режиме логотипа — вращение не запускаем");
    }
  }
});




document.addEventListener('DOMContentLoaded', () => {
  // Просто запускаем — всё остальное (URL и Grid) сделает common.js
  if (window.projectFilter) {
      window.projectFilter.init();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (window.newsFilter) {
      window.newsFilter.init();
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.main-header');
  let lastScrollY = window.scrollY;

  if (header) {
      // 1. Сразу делаем хедер белым
      header.classList.add('header-static-light');

      // 2. Логика пряток при скролле
      window.addEventListener('scroll', () => {
          const currentScrollY = window.scrollY;

          // Если скроллим вниз и ушли ниже 50px — прячем
          if (currentScrollY > lastScrollY && currentScrollY > 50) {
              header.classList.add('header-hidden');
          } 
          // Если скроллим вверх — показываем
          else if (currentScrollY < lastScrollY) {
              header.classList.remove('header-hidden');
          }

          lastScrollY = currentScrollY;
      }, { passive: true });
  }
});

function initAutoWidthSelects() {
  const wrappers = document.querySelectorAll('.select-wrapper');
  
  

  wrappers.forEach(wrapper => {
    const select = wrapper.querySelector('select');
    const resizer = wrapper.querySelector('.select-resizer');

    if (!select || !resizer) return;

    function updateWidth() {
      const selectedText = select.options[select.selectedIndex].text;
      resizer.textContent = selectedText;
      
      // Замеряем ширину текста + запас под паддинги и стрелку
      const paddingForArrow = 90; 
  const newWidth = resizer.offsetWidth + paddingForArrow; 
      
      
      
      wrapper.style.width = newWidth + 'px';
    }

    select.addEventListener('change', updateWidth);

     // 2. ЗАПУСКАЕМ СРАЗУ при загрузке, чтобы подогнать ширину под дефолтные слова
  updateWidth();
  });

  const resetBtn = document.getElementById('reset-filters-btn');

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      // 1. Даем браузеру мгновение, чтобы сбросить значения селектов
      setTimeout(() => {
        const wrappers = document.querySelectorAll('.select-wrapper');
        
        wrappers.forEach(wrapper => {
          const select = wrapper.querySelector('select');
          const resizer = wrapper.querySelector('.select-resizer');
          
          if (select && resizer) {
            // 2. Берем текст дефолтного пункта (например, "Services")
            resizer.textContent = select.options[select.selectedIndex].text;
            
            // 3. Пересчитываем ширину заново
            const paddingForArrow = 90; 
            const newWidth = resizer.offsetWidth + paddingForArrow;
            
            wrapper.style.width = newWidth + 'px';
          }
        });
      }, 10); // Задержка 10мс достаточна
    });
  }
} 

// Запуск
document.addEventListener('DOMContentLoaded', initAutoWidthSelects);



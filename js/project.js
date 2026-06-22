document.addEventListener('DOMContentLoaded', () => {
  // Передаем ID текущего проекта, чтобы он не попал в рекомендации
  if (window.projectFilter) {
      window.projectFilter.initRecommended(1); // 1 - это ID текущей виллы
  }
});

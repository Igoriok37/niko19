const filterButtons = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.news-link');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectItems.forEach(item => {
            const itemType = item.getAttribute('data-type');

            if (filterValue === 'all' || itemType === filterValue) {
                item.classList.remove('hide');
            } else {
                item.classList.add('hide');
            }
        });
    });
});

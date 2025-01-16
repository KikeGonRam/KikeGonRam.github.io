document.querySelectorAll('.social').forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.7)';
    });
    link.addEventListener('mouseleave', () => {
        link.style.boxShadow = 'none';
    });
});

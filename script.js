// Animación de entrada para el título
document.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelector(".hero h1");
    title.style.opacity = "0";
    title.style.transform = "translateY(-20px)";

    setTimeout(() => {
        title.style.transition = "opacity 1.5s ease, transform 1.5s ease";
        title.style.opacity = "1";
        title.style.transform = "translateY(0)";
    }, 500);
});

// Efecto de resaltado en redes sociales
const socialLinks = document.querySelectorAll(".social");
socialLinks.forEach(link => {
    link.addEventListener("mouseenter", () => {
        link.style.background = "linear-gradient(45deg, #ff00cc, #3333ff)";
        link.style.boxShadow = "0 6px 20px rgba(255, 0, 204, 0.6)";
    });

    link.addEventListener("mouseleave", () => {
        link.style.background = "linear-gradient(45deg, #00c6ff, #0072ff)";
        link.style.boxShadow = "0 4px 15px rgba(0, 255, 255, 0.3)";
    });
});

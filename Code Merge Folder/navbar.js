function setupCollapseNavbar() {
    const navbar = document.getElementById("site-navbar");

    if (!navbar) return;

    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.classList.add("nav-hidden");
        } else {
            navbar.classList.remove("nav-hidden");
        }

        lastScrollY = currentScrollY;
    });
}

function setActiveNavbarLink() {
    const currentPage = window.location.pathname.split("/").pop();
    const links = document.querySelectorAll(".Navbarheader nav ul li a");

    links.forEach(link => {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupCollapseNavbar();
    setActiveNavbarLink();
});
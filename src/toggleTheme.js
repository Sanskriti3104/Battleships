export default function toggleTheme() {

    const themeToggle = document.querySelector(".theme-toggle");

    // Apply saved theme
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        themeToggle.classList.replace("fa-moon", "fa-sun");
    }

    themeToggle.addEventListener("click", () => {

        const isDark = document.documentElement.getAttribute("data-theme") === "dark";

        if (isDark) {
            document.documentElement.removeAttribute("data-theme");
            themeToggle.classList.replace("fa-sun", "fa-moon");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            themeToggle.classList.replace("fa-moon", "fa-sun");
            localStorage.setItem("theme", "dark");
        }

    });

}
'use strict';

document.addEventListener('DOMContentLoaded', function () {
    // Get all dark-light switchers
    var switchers = document.querySelectorAll('.dark-light-switcher');

    // Function to update checkbox state and theme
    function updateTheme(isDarkMode) {
        switchers.forEach(function (switcher) {
            var checkbox = switcher.querySelector('#switch');

            if (checkbox) {
                checkbox.checked = isDarkMode;
            }
        });

        document.documentElement.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
    }

    // Get theme from localStorage first, then fallback to WordPress config or default
    var savedTheme = localStorage.getItem('theme');
    var defaultTheme = 'light';

    if (window.idekoThemeConfig && window.idekoThemeConfig.defaultDarkMode) {
        defaultTheme = 'dark';
    }

    // Priority: localStorage > current attribute > WordPress config > default
    var currentTheme;
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
        currentTheme = savedTheme;
    } else {
        var currentThemeAttr = document.documentElement.getAttribute('data-bs-theme');
        currentTheme = currentThemeAttr || defaultTheme;
    }

    var isDarkMode = currentTheme === 'dark';

    // Apply theme immediately if different from current
    if (document.documentElement.getAttribute('data-bs-theme') !== currentTheme) {
        document.documentElement.setAttribute('data-bs-theme', currentTheme);
    }

    // Initialize checkbox state based on current theme
    updateTheme(isDarkMode);

    // Add event listeners to all switchers
    switchers.forEach(function (switcher) {
        switcher.addEventListener('click', function () {
            var checkbox = switcher.querySelector('#switch');

            if (checkbox) {
                // Get current state from checkbox
                var isDarkMode = checkbox.checked;

                // Save theme to localStorage
                var newTheme = isDarkMode ? 'dark' : 'light';
                localStorage.setItem('theme', newTheme);

                // Update data-bs-theme attribute
                document.documentElement.setAttribute('data-bs-theme', newTheme);
            }
        });
    });
});

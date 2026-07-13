// ponytail: extracted from inline <head> to drop 'unsafe-inline' on the static SPA
(function () {
  try {
    var savedTheme = localStorage.getItem('ilkom-theme');
    var isDark =
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();

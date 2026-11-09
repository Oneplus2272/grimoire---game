if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.disableVerticalSwipes();

    // Пробуем запросить полный экран
    if (tg.requestFullscreen) {
        tg.requestFullscreen().catch((err) => {
            console.log("Fullscreen failed:", err);
        });
    } else {
        console.log("requestFullscreen not supported on this Telegram version");
    }
}

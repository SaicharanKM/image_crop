export const pageView = (url) => {
    if (window.gtag) {
      window.gtag('config', 'G-DR1CN3SX5K', {
        page_path: url,
      });
    }
  };
  
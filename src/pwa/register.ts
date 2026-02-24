import { registerSW } from 'virtual:pwa-register';

export const registerPwa = (): void => {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) {
    return;
  }

  registerSW({
    immediate: true,
    onNeedRefresh() {
      console.info('Selain Games update is ready. Reload to apply it.');
    },
    onOfflineReady() {
      console.info('Selain Games is ready for offline play.');
    }
  });
};

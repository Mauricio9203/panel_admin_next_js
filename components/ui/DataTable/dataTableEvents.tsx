type Listener = () => void;

let listeners: Listener[] = [];

export const closeAllRowMenus = () => {
  listeners.forEach((l) => l());
};

export const subscribeCloseAllRowMenus = (fn: Listener) => {
  listeners.push(fn);

  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
};

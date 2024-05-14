export const debounce = <T extends Array<any>, R>(
  func: (...args: T) => R,
  wait: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  // 使用箭头函数，避免内部 this 与外部 this 冲突
  const debouncedFunction: (...args: T) => void = (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      timeout = null;
      func.apply(this, args);
    }, wait);
  };

  return debouncedFunction;
};

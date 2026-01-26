export function useLocalStorage<T>(key: string, initialValue: T) {
  const storedValue = ref<T>(() => {
    if (process.client) {
      try {
        const item = window.localStorage.getItem(key)
        return item ? JSON.parse(item) : initialValue
      } catch (error) {
        console.error(`Error loading localStorage key "${key}":`, error)
        return initialValue
      }
    }
    return initialValue
  }())

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue.value) : value
      storedValue.value = valueToStore
      if (process.client) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  const removeItem = () => {
    try {
      storedValue.value = initialValue
      if (process.client) {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }

  return {
    storedValue,
    setValue,
    removeItem
  }
}

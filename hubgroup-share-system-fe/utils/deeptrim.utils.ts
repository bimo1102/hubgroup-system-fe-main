export const deepTrim = <T>(obj: T): T => {
    if (typeof obj === 'string') {
        return obj.trim() as T;
    }
    if (Array.isArray(obj)) {
        return obj.map(item => deepTrim(item)) as T;
    }
    if (obj && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, deepTrim(value)])
        ) as T;
    }
    return obj;
};

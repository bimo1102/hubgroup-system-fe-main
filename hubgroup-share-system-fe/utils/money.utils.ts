import { VND_FORMAT_REGEX } from '../constant/common.constant';

export const formatVNDText = (money?: number | string): string => {
    if (!money) return '0';
    return money.toString().replace(VND_FORMAT_REGEX, ',');
};

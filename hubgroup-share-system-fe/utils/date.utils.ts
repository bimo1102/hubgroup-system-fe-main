import dayjs from 'dayjs';

export const formatDate = (
    dateString: string,
    format: string = 'DD/MM/YYYY HH:mm:ss'
) => {
    if (!dateString) return '';
    const instate = dayjs(dateString);
    return instate.isValid() ? instate.format(format) : dateString;
};

export const convertToDate = (dateString: string): any => {
    if (!dateString) return undefined;
    const instate = dayjs(dateString);
    return instate.isValid() ? instate : dateString;
};

export const getFormattedDateTime = (date?: Date | string) => {
    if (!date) return null;
    const newDate: Date = new Date(date);
    const year = newDate.getFullYear();
    const month = (1 + newDate.getMonth()).toString().padStart(2, '0');
    const day = newDate.getDate().toString().padStart(2, '0');
    const hours = newDate.getHours().toString().padStart(2, '0');
    const minute = newDate.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minute}:00`;
};
export const formatDateTime = (
    dateString: string,
    format: string = 'DD/MM/YYYY HH:mm'
) => {
    if (!dateString) return '';
    const instate = dayjs(dateString);
    return instate.isValid() ? instate.format(format) : dateString;
};
export const formatDateTimeMiliSecond = (
    dateString: string,
    format: string = 'DD/MM/YYYY HH:mm:ss'
) => {
    if (!dateString) return '';
    const instate = dayjs(dateString);
    return instate;
};
export const formatDateNoTime = (
    dateString: string,
    format: string = 'DD/MM/YYYY'
) => {
    if (!dateString) return '';
    const instate = dayjs(dateString);
    return instate.isValid() ? instate.format(format) : dateString;
};

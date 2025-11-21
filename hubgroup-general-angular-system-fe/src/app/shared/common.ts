import moment from 'moment';
import { environment } from 'src/environments/environment';
import { castArray, cloneDeep, isArray, isEmpty, isObject, omitBy, pick, toNumber } from 'lodash';
import { KeyValueTypeIntModel, TimePickerType } from '@hubgroup-share-system-fe/types/common.type';
import { v4 as uuIdv4 } from 'uuid';

export class Common {
    public static DateFormat = 'DD/MM/YYYY';
    public static DateFormatServer = 'dd/MM/yyyy';
    public static DateTimeFormat = Common.DateFormat + ' HH:mm';
    public static TimeFormat = 'HH:mm';
    public static AuthLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
    public static AuthRefreshStorageToken = `rf-${environment.appVersion}-${environment.USERDATA_KEY}`;

    public static getUuid() {
        return uuIdv4();
    }

    public static setTokenToLocalStorage(token: string): boolean {
        localStorage.setItem(Common.AuthLocalStorageToken, token);
        return true;
    }

    public static setRefreshTokenToLocalStorage(token: string): boolean {
        localStorage.setItem(Common.AuthRefreshStorageToken, token);
        return true;
    }

    public static removeTokenToLocalStorage(): boolean {
        localStorage.removeItem(Common.AuthLocalStorageToken);
        return true;
    }

    public static formatDateToBackend(value: any, format = 'MM/DD/YYYY'): string {
        if (!value) return '';
        return moment(value).format(format);
    }

    public static formatDateTimeToBackend(value: any, format = 'DD/MM/YYYY HH:mm'): string {
        if (!value) return '';
        return moment(value).format(format);
    }

    public static formatStringToDate(value: any, format = 'DD/MM/YYYY HH:mm'): Date {
        return moment(value, format).toDate();
    }

    public static formatStringToEncode(str: any) {
        let entityMap: any = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;',
        };
        //return str;
        return String(str).replace(/[&<>"'\/]/g, (s) => {
            return entityMap[s];
        });
    }

    public static getFormattedDate(date?: Date) {
        if (!date) return null;
        const year = date.getFullYear();
        const month = (1 + date.getMonth()).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return month + '/' + day + '/' + year;
    }

    public static getFormattedDateTime(date?: Date | string) {
        if (!date) return null;
        const newDate: Date = new Date(date);
        const year = newDate.getFullYear();
        const month = (1 + newDate.getMonth()).toString().padStart(2, '0');
        const day = newDate.getDate().toString().padStart(2, '0');
        const hours = newDate.getHours().toString().padStart(2, '0');
        const minute = newDate.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minute}:00`;
    }

    public static getFormattedDateTimeHourSecond(date?: Date | string, time?: TimePickerType) {
        if (!date || !time) return null;
        const newDate: Date = new Date(date);
        const year = newDate.getFullYear();
        const month = (1 + newDate.getMonth()).toString().padStart(2, '0');
        const day = newDate.getDate().toString().padStart(2, '0');
        const hours = newDate.getHours().toString().padStart(2, '0');
        const minute = newDate.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${time.hour || hours}:${time.minute || minute}:00`;
    }

    public static getTime(date: Date | string): TimePickerType {
        const newDate: Date = new Date(date);
        return {
            hour: newDate.getHours(),
            minute: newDate.getMinutes(),
            second: 0,
        };
    }

    public static getFormattedTime(date?: Date | string) {
        if (!date) return null;
        const newDate: Date = new Date(date);
        const hours = newDate.getHours().toString().padStart(2, '0');
        const minute = newDate.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minute}:00`;
    }

    private static removeSpecialVietNamCharacter(str?: string) {
        if (!str) return '';
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
        str = str.replace(/Đ/g, 'D');
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư

        return str;
    }

    public static removeVietnameseTones(str?: string) {
        str = Common.removeSpecialVietNamCharacter(str);
        // Remove punctuations
        // Bỏ dấu câu, kí tự đặc biệt
        str = str.replace(
            /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|’|‘|“|”|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
            ' '
        );
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g, ' ');
        str = str.replace(/  /g, ' ');
        str = str.trim();
        str = str.replace(/ /g, '-');
        str = str.replace(/ /g, '-');
        str = str.replace(/…/g, '');
        str = str.toLowerCase();
        return str;
    }

    public static removeVietnameseTonesUrl(str: string) {
        str = Common.removeSpecialVietNamCharacter(str);
        // Remove punctuations
        // Bỏ dấu câu, kí tự đặc biệt
        str = str.replace(
            /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\,|\.|’|‘|“|”|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
            ' '
        );
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g, ' ');
        str = str.replace(/  /g, ' ');
        str = str.trim();
        str = str.replace(/ /g, '-');
        str = str.replace(/ /g, '-');
        str = str.replace(/…/g, '');
        str = str.toLowerCase();
        return str;
    }

    public static getThumbImage(path: any, width: any, height: any) {
        if (path == null) {
            return '';
        }
        const extension = path.split('.').pop();
        if (extension === 'svg') {
            return path;
        }
        return `${path}?width=${width}`;
        /* const name = path.split('/').pop();
        const subPath = path.replace(name, '');
        return subPath + 'Thumbs/' + width + '_' + height + '_resize_' + name; */
    }

    public static getBoolean(value: any): boolean {
        switch (value) {
            case true:
            case 'true':
            case 1:
            case '1':
            case 'on':
            case 'yes':
                return true;
            default:
                return false;
        }
    }

    public static getFileExtension(filename: any) {
        const ext = /^.+\.([^.]+)$/.exec(filename.split('?').shift());
        return !ext ? '' : ext[1];
    }

    public static getFileName(url: string) {
        return (
            url
                .split('?')
                .shift()!
                .split(/[\\\/]/)
                .pop() || ''
        );
    }

    public static getThumbImageModel(thumbs: Array<KeyValueTypeIntModel>, thumbNumber: number) {
        return thumbs.find((item) => item.id === thumbNumber);
    }

    public static getWhiteListDomainListenMicroFrontendIframe() {
        return environment.whiteListDomainListenMicroFrontendIframe
            .split(',')
            .map((item: string) => item.trim());
    }

    public static setUpParams<T extends object>(
        request: T,
        keyInclude: Array<keyof T> = [],
        keyConvert?: {
            convertToNumber?: Array<Partial<keyof T>>;
            convertToArrayNumber?: Array<Partial<keyof T>>;
            convertToArray?: Array<Partial<keyof T>>;
            convertToBoolean?: Array<Partial<keyof T>>;
            convertRevertToBoolean?: Array<Partial<keyof T>>;
        }
    ) {
        if (!isObject(request)) return request;
        const object = pick(
            omitBy<T>(
                request,
                (item: any) =>
                    (!item && item !== 0 && item !== false) || (isArray(item) && item.length === 0)
            ),
            keyInclude
        );
        const objectClone = cloneDeep<any>(object) as { [key in keyof T]: any };
        if (keyConvert?.convertToArray) {
            keyConvert.convertToArray.forEach((itemForEach) => {
                if (objectClone[itemForEach] && !isArray(objectClone[itemForEach]))
                    objectClone[itemForEach] = castArray(objectClone[itemForEach]);
            });
        }

        if (keyConvert?.convertToNumber) {
            keyConvert.convertToNumber.forEach((itemForEach) => {
                if (objectClone[itemForEach])
                    objectClone[itemForEach] = toNumber(objectClone[itemForEach]);
            });
        }
        if (keyConvert?.convertToArrayNumber) {
            keyConvert.convertToArrayNumber.forEach((itemForEach) => {
                if (objectClone[itemForEach]) {
                    if (!isArray(objectClone[itemForEach])) {
                        objectClone[itemForEach] = [toNumber(objectClone[itemForEach])];
                    } else {
                        objectClone[itemForEach] = objectClone[itemForEach].map(
                            (itemConvert: any) => toNumber(itemConvert)
                        );
                    }
                }
            });
        }
        if (keyConvert?.convertToBoolean) {
            keyConvert.convertToBoolean.forEach((itemForEach) => {
                if (objectClone[itemForEach])
                    objectClone[itemForEach] = this.getBoolean(objectClone[itemForEach]);
            });
        }
        if (keyConvert?.convertRevertToBoolean) {
            keyConvert.convertRevertToBoolean.forEach((itemForEach) => {
                if (objectClone[itemForEach])
                    objectClone[itemForEach] = objectClone[itemForEach] === 'false';
            });
        }
        return objectClone;
    }

    static downloadFileByAnchorHtml(url: string, name: string) {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.download = name;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    static downloadImage(imageUrl: string, name: string) {
        this.getBase64ImageFromURL(imageUrl).then((base64data: any) => {
            const data = 'data:image/jpg;base64,' + base64data;
            const link = document.createElement('a');

            document.body.appendChild(link); // for Firefox

            link.setAttribute('href', data);
            link.setAttribute('download', `${name}.${this.getFileExtension(imageUrl)}`);
            link.click();
        });
    }

    static getBase64ImageFromURL(url: string) {
        return new Promise((resolve, reject) => {
            const img: HTMLImageElement = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = url;
            if (!img.complete) {
                img.onload = () => {
                    resolve(this.getBase64Image(img));
                };
                img.onerror = (err) => {
                    reject(err);
                };
            } else {
                resolve(this.getBase64Image(img));
            }
        });
    }

    static getBase64Image(img: HTMLImageElement) {
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx!.drawImage(img, 0, 0);
        const dataURL: string = canvas.toDataURL('image/png');

        return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
    }

    public static createAndDownloadBlobFile(
        body: BlobPart,
        options: BlobPropertyBag,
        filename: string
    ) {
        const blob = new Blob([body], options);
        console.log(blob);
        if ((navigator as any).msSaveBlob) {
            (navigator as any).msSaveBlob(blob, filename);
        } else {
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            link.click();
            URL.revokeObjectURL(url);
            link.remove();
        }
    }

    public static formatBytes(bytes: number, decimals = 2) {
        if (!+bytes) {
            return '';
        }

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    public static htmlToText(str: string) {
        const htmlDivElement = document.createElement('div');
        htmlDivElement.innerHTML = str;
        const text = htmlDivElement.innerText.replace(/(\r\n|\n|\t|\r)/gm, ' ').trim();
        htmlDivElement.remove();
        return text;
    }

    public static getMetaData = (
        url: string,
        cb: (data: { imageElement: HTMLImageElement; error?: any }) => void,
        onloadStart?: () => void
    ) => {
        const img = new Image();
        if (onloadStart) onloadStart();
        img.onload = () =>
            cb({
                imageElement: img,
            });
        img.onerror = (err) => cb({ imageElement: img, error: err });
        img.src = url;
    };

    public static scrollIntoView(element: HTMLElement | Element) {
        if (element) {
            element.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
    }

    public static decodeHtml(input: string) {
        const doc = new DOMParser().parseFromString(input, 'text/html');
        return doc.documentElement.textContent || '';
    }

    public static initSourcesAutoComplete(listSources: Array<any>, sources?: Array<any>) {
        if (!sources || isEmpty(sources)) return listSources;
        let newListSources = [];
        if (listSources) {
            newListSources = cloneDeep(listSources);
        }
        if (newListSources.length > 0) {
            const index = newListSources.findIndex((item: any) => item.id === sources[0].id);
            if (index === -1) {
                newListSources.push(sources);
            }
        } else {
            newListSources = sources;
        }
        return newListSources;
    }
}

import LocaleManager from '../../Core/localization/LocaleManager.js';

//<umd>
const
    localeName = 'Ru',
    localeDesc = 'Русский',
    locale     = {

        localeName,
        localeDesc,

        Object : {
            Yes    : 'Да',
            No     : 'Нет',
            Cancel : 'Отмена',
            Ok     : 'OK'
        },

        //region Widgets

        Combo : {
            noResults : 'Нет результатов'
        },

        FilePicker : {
            file : 'Файл'
        },

        Field : {
            // native input ValidityState statuses
            badInput        : 'Недопустимое значение поля',
            patternMismatch : 'Значение должно соответствовать определенному шаблону',
            rangeOverflow   : value => `Значение должно быть меньше или равно ${value.max}`,
            rangeUnderflow  : value => `Значение должно быть больше или равно ${value.min}`,
            stepMismatch    : 'Значение должно соответствовать шагу',
            tooLong         : 'Значение должно быть короче',
            tooShort        : 'Значение должно быть длиннее',
            typeMismatch    : 'Значение должно быть в специальном формате',
            valueMissing    : 'Поле не может быть пустым',

            invalidValue          : 'Недопустимое значение поля',
            minimumValueViolation : 'Нарушение минимального значения',
            maximumValueViolation : 'Нарушение максимального значения',
            fieldRequired         : 'Поле не может быть пустым',
            validateFilter        : 'Выберите значение из списка'
        },

        DateField : {
            invalidDate : 'Невернывй формат даты'
        },

        NumberFormat : {
            locale   : 'ru',
            currency : 'RUB'
        },

        DurationField : {
            invalidUnit : 'Неверные единицы'
        },

        TimeField : {
            invalidTime : 'Неверный формат времени'
        },

        List : {
            loading : 'Загрузка...'
        },

        // needed here due to LoadMaskable
        GridBase : {
            loadMask : 'Загрузка...',
            syncMask : 'Сохраняю данные, пожалуйста подождите...'
        },

        PagingToolbar : {
            firstPage         : 'Перейти на первую страницу',
            prevPage          : 'Перейти на предыдущую страницу',
            page              : 'страница',
            nextPage          : 'Перейти на следующую страницу',
            lastPage          : 'Перейти на последнюю страницу',
            reload            : 'Перезагрузить текущую страницу',
            noRecords         : 'Нет записей для отображения',
            pageCountTemplate : data => `из ${data.lastPage}`,
            summaryTemplate   : data => `Показаны записи ${data.start} - ${data.end} из ${data.allCount}`
        },

        UndoRedo : {
            Undo           : 'Отменить',
            Redo           : 'Повторить',
            UndoLastAction : 'Отменить последнее действие',
            RedoLastAction : 'Повторить последнее отмененное действие'
        },

        //endregion

        //region Others

        DateHelper : {
            locale         : 'ru',
            weekStartDay   : 1,
            // Non-working days which match weekends by default, but can be changed according to schedule needs
            nonWorkingDays : {
                0 : true,
                6 : true
            },
            // Days considered as weekends by the selected country, but could be working days in the schedule
            weekends : {
                0 : true,
                6 : true
            },
            unitNames : [
                { single : 'миллисек', plural : 'миллисек', abbrev : 'мс' },
                { single : 'секунда', plural : 'секунд', abbrev : 'с' },
                { single : 'минута', plural : 'минут', abbrev : 'мин' },
                { single : 'час', plural : 'часов', abbrev : 'ч' },
                { single : 'день', plural : 'дней', abbrev : 'д' },
                { single : 'неделя', plural : 'недели', abbrev : 'нед' },
                { single : 'месяц', plural : 'месяцев', abbrev : 'мес' },
                { single : 'квартал', plural : 'кварталов', abbrev : 'квар' },
                { single : 'год', plural : 'лет', abbrev : 'г' },
                { single : 'десятилетие', plural : 'десятилетия', abbrev : 'дес' }
            ],
            // Used to build a RegExp for parsing time units.
            // The full names from above are added into the generated Regexp.
            // So you may type "2 н" or "2 нед" or "2 неделя" or "2 недели" into a DurationField.
            // When generating its display value though, it uses the full localized names above.
            unitAbbreviations : [
                ['мс', 'мил'],
                ['с', 'сек'],
                ['м', 'мин'],
                ['ч'],
                ['д', 'ден', 'дне'],
                ['н', 'нед'],
                ['мес'],
                ['к', 'квар', 'квр'],
                ['г'],
                ['дес']
            ],
            parsers : {
                L  : 'DD.MM.YYYY',
                LT : 'HH:mm'
            },
            ordinalSuffix : number => `${number}-й`
        }

        //endregion
    };

export default locale;
//</umd>

LocaleManager.registerLocale(localeName, { desc : localeDesc, path : 'lib/Core/localization/Ru.js', locale : locale });

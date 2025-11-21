import LocaleManager from '../../Core/localization/LocaleManager.js';

//<umd>
const
    localeName = 'SvSE',
    localeDesc = 'Svenska',
    locale     = {

        localeName,
        localeDesc,

        Object : {
            Yes    : 'Ja',
            No     : 'Nej',
            Cancel : 'Avbryt',
            Ok     : 'OK'
        },

        //region Widgets

        Combo : {
            noResults : 'Inga resultat'
        },

        FilePicker : {
            file : 'Fil'
        },

        Field : {
            // native input ValidityState statuses
            badInput        : 'Ogiltigt värde',
            patternMismatch : 'Värdet ska matcha ett specifikt mönster',
            rangeOverflow   : value => `Värdet måste vara mindre än eller lika med ${value.max}`,
            rangeUnderflow  : value => `Värdet måste vara större än eller lika med ${value.min}`,
            stepMismatch    : 'Värdet bör passa steget',
            tooLong         : 'Värdet för långt',
            tooShort        : 'Värdet för kort',
            typeMismatch    : 'Värdet är inte i förväntat format',
            valueMissing    : 'Detta fält är obligatoriskt',
            invalidValue    : 'Ogiltigt värde',

            minimumValueViolation : 'För lågt värde',
            maximumValueViolation : 'För högt värde',
            fieldRequired         : 'Detta fält är obligatoriskt',
            validateFilter        : 'Värdet måste väljas från listan'
        },

        DateField : {
            invalidDate : 'Ogiltigt datum'
        },

        NumberFormat : {
            locale   : 'sv-SE',
            currency : 'SEK'
        },

        DurationField : {
            invalidUnit : 'Ogiltig enhet'
        },

        TimeField : {
            invalidTime : 'Ogiltig tid'
        },

        List : {
            loading : 'Laddar...'
        },

        // needed here due to LoadMaskable
        GridBase : {
            loadMask : 'Laddar...',
            syncMask : 'Sparar ändringar, vänligen vänta...'
        },

        PagingToolbar : {
            firstPage         : 'Gå till första sidan',
            prevPage          : 'Gå till föregående sida',
            page              : 'Sida',
            nextPage          : 'Gå till nästa sida',
            lastPage          : 'Gå till sista sidan',
            reload            : 'Ladda om den aktuella sidan',
            noRecords         : 'Inga rader att visa',
            pageCountTemplate : data => `av ${data.lastPage}`,
            summaryTemplate   : data => `Visar poster ${data.start} - ${data.end} av ${data.allCount}`
        },

        UndoRedo : {
            Undo           : 'Ångra',
            Redo           : 'Gör om',
            UndoLastAction : 'Ångra senaste åtgärden',
            RedoLastAction : 'Gör om senast ångrade åtgärden'
        },

        //endregion

        //region Others

        DateHelper : {
            locale         : 'sv-SE',
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
                { single : 'millisekund', plural : 'millisekunder', abbrev : 'ms' },
                { single : 'sekund', plural : 'sekunder', abbrev : 's' },
                { single : 'minut', plural : 'minuter', abbrev : 'min' },
                { single : 'timme', plural : 'timmar', abbrev : 'tim' },
                { single : 'dag', plural : 'dagar', abbrev : 'd' },
                { single : 'vecka', plural : 'vecka', abbrev : 'v' },
                { single : 'månad', plural : 'månader', abbrev : 'mån' },
                { single : 'kvartal', plural : 'kvartal', abbrev : 'kv' },
                { single : 'år', plural : 'år', abbrev : 'år' },
                { single : 'årtionde', plural : 'årtionden', abbrev : 'årtionden' }
            ],
            // Used to build a RegExp for parsing time units.
            // The full names from above are added into the generated Regexp.
            // So you may type "2 v" or "2 ve" or "2 vecka" or "2 vecka" into a DurationField.
            // When generating its display value though, it uses the full localized names above.
            unitAbbreviations : [
                ['ms', 'mil'],
                ['s', 'sek'],
                ['m', 'min'],
                ['t', 'tim', 'h'],
                ['d'],
                ['v', 've'],
                ['må', 'mån'],
                ['kv', 'kva'],
                [],
                []
            ],
            ordinalSuffix : number => {
                const lastDigit = number[number.length - 1];
                return number + (number !== '11' && number !== '12' && (lastDigit === '1' || lastDigit === '2') ? 'a' : 'e');
            },
            parsers : {
                L  : 'YYYY-MM-DD',
                LT : 'HH:mm'
            }
        }

        //endregion
    };

export default locale;
//</umd>

LocaleManager.registerLocale(localeName, { desc : localeDesc, path : 'lib/Core/localization/SvSE.js', locale : locale });

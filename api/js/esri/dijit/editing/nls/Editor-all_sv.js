require({cache:{
'dijit/form/nls/sv/validate':function(){
define(
"dijit/form/nls/sv/validate", //begin v1.x content
({
	invalidMessage: "Det angivna värdet är ogiltigt.",
	missingMessage: "Värdet är obligatoriskt.",
	rangeMessage: "Värdet är utanför intervallet."
})
//end v1.x content
);

},
'dijit/_editor/nls/sv/commands':function(){
define(
"dijit/_editor/nls/sv/commands", //begin v1.x content
({
	'bold': 'Fetstil',
	'copy': 'Kopiera',
	'cut': 'Klipp ut',
	'delete': 'Ta bort',
	'indent': 'Indrag',
	'insertHorizontalRule': 'Horisontell linjal',
	'insertOrderedList': 'Numrerad lista',
	'insertUnorderedList': 'Punktlista',
	'italic': 'Kursiv',
	'justifyCenter': 'Centrera',
	'justifyFull': 'Marginaljustera',
	'justifyLeft': 'Vänsterjustera',
	'justifyRight': 'Högerjustera',
	'outdent': 'Utdrag',
	'paste': 'Klistra in',
	'redo': 'Gör om',
	'removeFormat': 'Ta bort format',
	'selectAll': 'Markera allt',
	'strikethrough': 'Genomstruken',
	'subscript': 'Nedsänkt',
	'superscript': 'Upphöjt',
	'underline': 'Understrykning',
	'undo': 'Ångra',
	'unlink': 'Ta bort länk',
	'createLink': 'Skapa länk',
	'toggleDir': 'Växla riktning',
	'insertImage': 'Infoga bild',
	'insertTable': 'Infoga/redigera tabell',
	'toggleTableBorder': 'Aktivera/avaktivera tabellram',
	'deleteTable': 'Ta bort tabell',
	'tableProp': 'Tabellegenskap',
	'htmlToggle': 'HTML-källkod',
	'foreColor': 'Förgrundsfärg',
	'hiliteColor': 'Bakgrundsfärg',
	'plainFormatBlock': 'Styckeformat',
	'formatBlock': 'Styckeformat',
	'fontSize': 'Teckenstorlek',
	'fontName': 'Teckensnittsnamn',
	'tabIndent': 'Tabbindrag',
	"fullScreen": "Växla helskärm",
	"viewSource": "Visa HTML-kod",
	"print": "Skriv ut",
	"newPage": "Ny sida",
	/* Error messages */
	'systemShortcut': 'Åtgärden "${0}" är endast tillgänglig i webbläsaren med hjälp av ett kortkommando. Använd ${1}.',
	'ctrlKey':'Ctrl+${0}',
	'appleKey':'\u2318+${0}' // "command" or open-apple key on Macintosh
})

//end v1.x content
);

},
'dojo/cldr/nls/sv/gregorian':function(){
define(
//begin v1.x content
{
	"months-format-narrow": [
		"J",
		"F",
		"M",
		"A",
		"M",
		"J",
		"J",
		"A",
		"S",
		"O",
		"N",
		"D"
	],
	"quarters-standAlone-narrow": [
		"1",
		"2",
		"3",
		"4"
	],
	"field-weekday": "veckodag",
	"dateFormatItem-yQQQ": "y QQQ",
	"dateFormatItem-yMEd": "EEE, yyyy-MM-dd",
	"dateFormatItem-MMMEd": "E d MMM",
	"eraNarrow": [
		"f.Kr.",
		"e.Kr."
	],
	"dateFormat-long": "d MMMM y",
	"months-format-wide": [
		"januari",
		"februari",
		"mars",
		"april",
		"maj",
		"juni",
		"juli",
		"augusti",
		"september",
		"oktober",
		"november",
		"december"
	],
	"dateFormatItem-EEEd": "EEE d",
	"dayPeriods-format-wide-pm": "em",
	"dateFormat-full": "EEEE'en' 'den' d:'e' MMMM y",
	"dateFormatItem-Md": "d/M",
	"dateFormatItem-MMMMEEEd": "EEE d MMMM",
	"field-era": "era",
	"dateFormatItem-yM": "yyyy-MM",
	"months-standAlone-wide": [
		"januari",
		"februari",
		"mars",
		"april",
		"maj",
		"juni",
		"juli",
		"augusti",
		"september",
		"oktober",
		"november",
		"december"
	],
	"timeFormat-short": "HH:mm",
	"quarters-format-wide": [
		"1:a kvartalet",
		"2:a kvartalet",
		"3:e kvartalet",
		"4:e kvartalet"
	],
	"timeFormat-long": "HH:mm:ss z",
	"field-year": "år",
	"dateFormatItem-yMMM": "MMM y",
	"dateFormatItem-yQ": "yyyy Q",
	"field-hour": "timme",
	"dateFormatItem-MMdd": "dd/MM",
	"months-format-abbr": [
		"jan",
		"feb",
		"mar",
		"apr",
		"maj",
		"jun",
		"jul",
		"aug",
		"sep",
		"okt",
		"nov",
		"dec"
	],
	"dateFormatItem-yyQ": "Q yy",
	"timeFormat-full": "'kl'. HH:mm:ss zzzz",
	"field-day-relative+0": "i dag",
	"field-day-relative+1": "i morgon",
	"field-day-relative+2": "i övermorgon",
	"field-day-relative+3": "i överövermorgon",
	"months-standAlone-abbr": [
		"jan",
		"feb",
		"mar",
		"apr",
		"maj",
		"jun",
		"jul",
		"aug",
		"sep",
		"okt",
		"nov",
		"dec"
	],
	"quarters-format-abbr": [
		"K1",
		"K2",
		"K3",
		"K4"
	],
	"quarters-standAlone-wide": [
		"1:a kvartalet",
		"2:a kvartalet",
		"3:e kvartalet",
		"4:e kvartalet"
	],
	"dateFormatItem-M": "L",
	"days-standAlone-wide": [
		"söndag",
		"måndag",
		"tisdag",
		"onsdag",
		"torsdag",
		"fredag",
		"lördag"
	],
	"dateFormatItem-yyyyMMM": "MMM y",
	"dateFormatItem-MMMMd": "d:'e' MMMM",
	"dateFormatItem-yyMMM": "MMM -yy",
	"timeFormat-medium": "HH:mm:ss",
	"dateFormatItem-Hm": "HH:mm",
	"quarters-standAlone-abbr": [
		"K1",
		"K2",
		"K3",
		"K4"
	],
	"eraAbbr": [
		"f.Kr.",
		"e.Kr."
	],
	"field-minute": "minut",
	"field-dayperiod": "fm/em",
	"days-standAlone-abbr": [
		"sön",
		"mån",
		"tis",
		"ons",
		"tors",
		"fre",
		"lör"
	],
	"dateFormatItem-d": "d",
	"dateFormatItem-ms": "mm:ss",
	"field-day-relative+-1": "i går",
	"field-day-relative+-2": "i förrgår",
	"field-day-relative+-3": "i förrförrgår",
	"dateFormatItem-MMMd": "d MMM",
	"dateFormatItem-MEd": "E d/M",
	"field-day": "dag",
	"days-format-wide": [
		"söndag",
		"måndag",
		"tisdag",
		"onsdag",
		"torsdag",
		"fredag",
		"lördag"
	],
	"field-zone": "tidszon",
	"dateFormatItem-yyyyMM": "yyyy-MM",
	"dateFormatItem-y": "y",
	"months-standAlone-narrow": [
		"J",
		"F",
		"M",
		"A",
		"M",
		"J",
		"J",
		"A",
		"S",
		"O",
		"N",
		"D"
	],
	"dateFormatItem-yyMM": "yy-MM",
	"dateFormatItem-hm": "h:mm a",
	"days-format-abbr": [
		"sön",
		"mån",
		"tis",
		"ons",
		"tors",
		"fre",
		"lör"
	],
	"eraNames": [
		"före Kristus",
		"efter Kristus"
	],
	"days-format-narrow": [
		"S",
		"M",
		"T",
		"O",
		"T",
		"F",
		"L"
	],
	"field-month": "månad",
	"days-standAlone-narrow": [
		"S",
		"M",
		"T",
		"O",
		"T",
		"F",
		"L"
	],
	"dateFormatItem-MMM": "LLL",
	"dayPeriods-format-wide-am": "fm",
	"dateFormatItem-MMMMEd": "E d:'e' MMMM",
	"dateFormat-short": "yyyy-MM-dd",
	"dateFormatItem-MMd": "d/M",
	"field-second": "sekund",
	"dateFormatItem-yMMMEd": "EEE d MMM y",
	"field-week": "vecka",
	"dateFormat-medium": "d MMM y",
	"dateFormatItem-yyyyQQQQ": "QQQQ y",
	"dateFormatItem-Hms": "HH:mm:ss",
	"dateFormatItem-hms": "h:mm:ss a"
}
//end v1.x content
);
},
'dijit/nls/sv/loading':function(){
define(
"dijit/nls/sv/loading", //begin v1.x content
({
	loadingState: "Läser in...",
	errorState: "Det uppstod ett fel."
})
//end v1.x content
);

},
'dojo/cldr/nls/sv/number':function(){
define(
//begin v1.x content
{
	"group": " ",
	"percentSign": "%",
	"exponential": "×10^",
	"scientificFormat": "#E0",
	"percentFormat": "#,##0 %",
	"list": ";",
	"infinity": "∞",
	"patternDigit": "#",
	"minusSign": "−",
	"decimal": ",",
	"nan": "¤¤¤",
	"nativeZeroDigit": "0",
	"perMille": "‰",
	"decimalFormat": "#,##0.###",
	"currencyFormat": "#,##0.00 ¤",
	"plusSign": "+"
}
//end v1.x content
);
},
'dijit/form/nls/sv/ComboBox':function(){
define(
"dijit/form/nls/sv/ComboBox", //begin v1.x content
({
		previousMessage: "Föregående alternativ",
		nextMessage: "Fler alternativ"
})
//end v1.x content
);

},
'*noref':1}});
define("esri/dijit/editing/nls/Editor-all_sv", [], 1);

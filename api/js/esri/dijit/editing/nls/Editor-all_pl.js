require({cache:{
'dijit/form/nls/pl/validate':function(){
define(
"dijit/form/nls/pl/validate", //begin v1.x content
({
	invalidMessage: "Wprowadzona wartość jest niepoprawna.",
	missingMessage: "Ta wartość jest wymagana.",
	rangeMessage: "Ta wartość jest spoza zakresu."
})
//end v1.x content
);

},
'dijit/_editor/nls/pl/commands':function(){
define(
"dijit/_editor/nls/pl/commands", //begin v1.x content
({
	'bold': 'Pogrubienie',
	'copy': 'Kopiuj',
	'cut': 'Wytnij',
	'delete': 'Usuń',
	'indent': 'Wcięcie',
	'insertHorizontalRule': 'Linia pozioma',
	'insertOrderedList': 'Lista numerowana',
	'insertUnorderedList': 'Lista wypunktowana',
	'italic': 'Kursywa',
	'justifyCenter': 'Wyrównaj do środka',
	'justifyFull': 'Wyrównaj do lewej i prawej',
	'justifyLeft': 'Wyrównaj do lewej',
	'justifyRight': 'Wyrównaj do prawej',
	'outdent': 'Usuń wcięcie',
	'paste': 'Wklej',
	'redo': 'Ponów',
	'removeFormat': 'Usuń formatowanie',
	'selectAll': 'Wybierz wszystko',
	'strikethrough': 'Przekreślenie',
	'subscript': 'Indeks dolny',
	'superscript': 'Indeks górny',
	'underline': 'Podkreślenie',
	'undo': 'Cofnij',
	'unlink': 'Usuń odsyłacz',
	'createLink': 'Utwórz odsyłacz',
	'toggleDir': 'Przełącz kierunek',
	'insertImage': 'Wstaw obraz',
	'insertTable': 'Wstaw/edytuj tabelę',
	'toggleTableBorder': 'Przełącz ramkę tabeli',
	'deleteTable': 'Usuń tabelę',
	'tableProp': 'Właściwość tabeli',
	'htmlToggle': 'Kod źródłowy HTML',
	'foreColor': 'Kolor pierwszego planu',
	'hiliteColor': 'Kolor tła',
	'plainFormatBlock': 'Styl akapitu',
	'formatBlock': 'Styl akapitu',
	'fontSize': 'Wielkość czcionki',
	'fontName': 'Nazwa czcionki',
	'tabIndent': 'Wcięcie o tabulator',
	"fullScreen": "Przełącz pełny ekran",
	"viewSource": "Wyświetl kod źródłowy HTML",
	"print": "Drukuj",
	"newPage": "Nowa strona",
	/* Error messages */
	'systemShortcut': 'Działanie ${0} jest dostępne w tej przeglądarce wyłącznie przy użyciu skrótu klawiaturowego. Należy użyć klawiszy ${1}.',
	'ctrlKey':'Ctrl+${0}'
})

//end v1.x content
);

},
'dojo/cldr/nls/pl/gregorian':function(){
define(
//begin v1.x content
{
	"months-format-narrow": [
		"s",
		"l",
		"m",
		"k",
		"m",
		"c",
		"l",
		"s",
		"w",
		"p",
		"l",
		"g"
	],
	"field-weekday": "Dzień tygodnia",
	"dateFormatItem-yQQQ": "y QQQ",
	"dateFormatItem-yMEd": "EEE, d.MM.yyyy",
	"dateFormatItem-MMMEd": "E, d MMM",
	"eraNarrow": [
		"p.n.e.",
		"n.e."
	],
	"dayPeriods-format-wide-earlyMorning": "nad ranem",
	"dayPeriods-format-wide-morning": "rano",
	"dateFormat-long": "d MMMM y",
	"months-format-wide": [
		"stycznia",
		"lutego",
		"marca",
		"kwietnia",
		"maja",
		"czerwca",
		"lipca",
		"sierpnia",
		"września",
		"października",
		"listopada",
		"grudnia"
	],
	"dayPeriods-format-wide-evening": "wieczorem",
	"dayPeriods-format-wide-pm": "PM",
	"dateFormat-full": "EEEE, d MMMM y",
	"dateFormatItem-Md": "d.MM",
	"dayPeriods-format-wide-noon": "w południe",
	"field-era": "Era",
	"dateFormatItem-yM": "MM.yyyy",
	"months-standAlone-wide": [
		"styczeń",
		"luty",
		"marzec",
		"kwiecień",
		"maj",
		"czerwiec",
		"lipiec",
		"sierpień",
		"wrzesień",
		"październik",
		"listopad",
		"grudzień"
	],
	"timeFormat-short": "HH:mm",
	"quarters-format-wide": [
		"I kwartał",
		"II kwartał",
		"III kwartał",
		"IV kwartał"
	],
	"timeFormat-long": "HH:mm:ss z",
	"field-year": "Rok",
	"dateFormatItem-yQ": "yyyy Q",
	"dateFormatItem-yyyyMMMM": "LLLL y",
	"field-hour": "Godzina",
	"dateFormatItem-MMdd": "d.MM",
	"months-format-abbr": [
		"sty",
		"lut",
		"mar",
		"kwi",
		"maj",
		"cze",
		"lip",
		"sie",
		"wrz",
		"paź",
		"lis",
		"gru"
	],
	"dateFormatItem-yyQ": "Q yy",
	"timeFormat-full": "HH:mm:ss zzzz",
	"field-day-relative+0": "Dzisiaj",
	"field-day-relative+1": "Jutro",
	"field-day-relative+2": "Pojutrze",
	"field-day-relative+3": "Za trzy dni",
	"months-standAlone-abbr": [
		"sty",
		"lut",
		"mar",
		"kwi",
		"maj",
		"cze",
		"lip",
		"sie",
		"wrz",
		"paź",
		"lis",
		"gru"
	],
	"quarters-format-abbr": [
		"K1",
		"K2",
		"K3",
		"K4"
	],
	"quarters-standAlone-wide": [
		"I kwartał",
		"II kwartał",
		"III kwartał",
		"IV kwartał"
	],
	"dateFormatItem-M": "L",
	"days-standAlone-wide": [
		"niedziela",
		"poniedziałek",
		"wtorek",
		"środa",
		"czwartek",
		"piątek",
		"sobota"
	],
	"dateFormatItem-MMMMd": "d MMMM",
	"dateFormatItem-yyMMM": "MMM yy",
	"timeFormat-medium": "HH:mm:ss",
	"dateFormatItem-Hm": "HH:mm",
	"quarters-standAlone-abbr": [
		"1 kw.",
		"2 kw.",
		"3 kw.",
		"4 kw."
	],
	"eraAbbr": [
		"p.n.e.",
		"n.e."
	],
	"field-minute": "Minuta",
	"field-dayperiod": "Dayperiod",
	"days-standAlone-abbr": [
		"niedz.",
		"pon.",
		"wt.",
		"śr.",
		"czw.",
		"pt.",
		"sob."
	],
	"dayPeriods-format-wide-night": "w nocy",
	"dateFormatItem-d": "d",
	"dateFormatItem-ms": "mm:ss",
	"field-day-relative+-1": "Wczoraj",
	"dateFormatItem-h": "hh a",
	"field-day-relative+-2": "Przedwczoraj",
	"field-day-relative+-3": "Trzy dni temu",
	"dateFormatItem-MMMd": "d MMM",
	"dateFormatItem-MEd": "E, d.MM",
	"dayPeriods-format-wide-lateMorning": "przed południem",
	"dateFormatItem-yMMMM": "LLLL y",
	"field-day": "Dzień",
	"days-format-wide": [
		"niedziela",
		"poniedziałek",
		"wtorek",
		"środa",
		"czwartek",
		"piątek",
		"sobota"
	],
	"field-zone": "Strefa",
	"dateFormatItem-yyyyMM": "MM.yyyy",
	"dateFormatItem-y": "y",
	"months-standAlone-narrow": [
		"s",
		"l",
		"m",
		"k",
		"m",
		"c",
		"l",
		"s",
		"w",
		"p",
		"l",
		"g"
	],
	"dateFormatItem-hm": "hh:mm a",
	"days-format-abbr": [
		"niedz.",
		"pon.",
		"wt.",
		"śr.",
		"czw.",
		"pt.",
		"sob."
	],
	"eraNames": [
		"p.n.e.",
		"n.e."
	],
	"days-format-narrow": [
		"N",
		"P",
		"W",
		"Ś",
		"C",
		"P",
		"S"
	],
	"field-month": "Miesiąc",
	"days-standAlone-narrow": [
		"N",
		"P",
		"W",
		"Ś",
		"C",
		"P",
		"S"
	],
	"dateFormatItem-MMM": "LLL",
	"dayPeriods-format-wide-am": "AM",
	"dateFormat-short": "dd.MM.yyyy",
	"dayPeriods-format-wide-afternoon": "po południu",
	"field-second": "Sekunda",
	"dateFormatItem-yMMMEd": "EEE, d MMM y",
	"dateFormatItem-Ed": "E, d",
	"field-week": "Tydzień",
	"dateFormat-medium": "d MMM y",
	"dateFormatItem-Hms": "HH:mm:ss",
	"dateFormatItem-hms": "hh:mm:ss a"
}
//end v1.x content
);
},
'dijit/nls/pl/loading':function(){
define(
"dijit/nls/pl/loading", //begin v1.x content
({
	loadingState: "Ładowanie...",
	errorState: "Niestety, wystąpił błąd"
})
//end v1.x content
);

},
'dojo/cldr/nls/pl/number':function(){
define(
//begin v1.x content
{
	"group": " ",
	"percentSign": "%",
	"exponential": "E",
	"scientificFormat": "#E0",
	"percentFormat": "#,##0%",
	"list": ";",
	"infinity": "∞",
	"patternDigit": "#",
	"minusSign": "-",
	"decimal": ",",
	"nan": "NaN",
	"nativeZeroDigit": "0",
	"perMille": "‰",
	"decimalFormat": "#,##0.###",
	"currencyFormat": "#,##0.00 ¤",
	"plusSign": "+"
}
//end v1.x content
);
},
'dijit/form/nls/pl/ComboBox':function(){
define(
"dijit/form/nls/pl/ComboBox", //begin v1.x content
({
		previousMessage: "Poprzednie wybory",
		nextMessage: "Więcej wyborów"
})
//end v1.x content
);

},
'*noref':1}});
define("esri/dijit/editing/nls/Editor-all_pl", [], 1);

require({cache:{
'dijit/form/nls/ro/validate':function(){
define(
"dijit/form/nls/ro/validate", //begin v1.x content
({
	invalidMessage: "Valoarea introdusă nu este validă.",
	missingMessage: "Această valoare este necesară.",
	rangeMessage: "Această valoare este în afara intervalului. "
})

//end v1.x content
);

},
'dijit/_editor/nls/ro/commands':function(){
define(
"dijit/_editor/nls/ro/commands", //begin v1.x content
({
	'bold': 'Aldin',
	'copy': 'Copiere',
	'cut': 'Tăiere',
	'delete': 'Ştergere',
	'indent': 'Micşorare indent',
	'insertHorizontalRule': 'Linie delimitatoare',
	'insertOrderedList': 'Listă numerotată',
	'insertUnorderedList': 'Listă cu marcator',
	'italic': 'Cursiv',
	'justifyCenter': 'Aliniere centru',
	'justifyFull': 'Aliniere stânga-dreapta',
	'justifyLeft': 'Aliniere stânga',
	'justifyRight': 'Aliniere dreapta',
	'outdent': 'Mărire indent',
	'paste': 'Lipire',
	'redo': 'Refacere acţiune',
	'removeFormat': 'Înlăturare format',
	'selectAll': 'Selectează tot',
	'strikethrough': 'Tăiere text cu o linie',
	'subscript': 'Scriere indice inferior',
	'superscript': 'Scriere indice superior',
	'underline': 'Subliniere',
	'undo': 'Anulare acţiune',
	'unlink': 'Înlăturare legătură',
	'createLink': 'Creare legătură',
	'toggleDir': 'Comutare direcţie',
	'insertImage': 'Inserare imagine',
	'insertTable': 'Inserare/Editare tabelă',
	'toggleTableBorder': 'Comutare bordură tabelă',
	'deleteTable': 'Ştergere tabelă',
	'tableProp': 'Proprietate tabelă',
	'htmlToggle': 'Sursă HTML',
	'foreColor': 'Culoare de prim-plan',
	'hiliteColor': 'Culoare de fundal',
	'plainFormatBlock': 'Stil paragraf',
	'formatBlock': 'Stil paragraf',
	'fontSize': 'Dimensiune font',
	'fontName': 'Nume font',
	'tabIndent': 'Indentare Tab',
	"fullScreen": "Comutare ecran complet",
	"viewSource": "Vizualizara sursă HTML",
	"print": "Tipărire",
	"newPage": "Pagină nouă",
	/* Error messages */
	'systemShortcut': 'Acţiunea "${0}" este disponibilă în browser doar utilizând o comandă rapidă de la tastatură. Utilizaţi ${1}.'
})
//end v1.x content
);

},
'dojo/cldr/nls/ro/gregorian':function(){
define(
//begin v1.x content
{
	"months-format-narrow": [
		"I",
		"F",
		"M",
		"A",
		"M",
		"I",
		"I",
		"A",
		"S",
		"O",
		"N",
		"D"
	],
	"quarters-standAlone-narrow": [
		"T1",
		"T2",
		"T3",
		"T4"
	],
	"field-weekday": "zi a săptămânii",
	"dateFormatItem-yQQQ": "QQQ y",
	"dateFormatItem-yMEd": "EEE, d/M/yyyy",
	"dateFormatItem-MMMEd": "E, d MMM",
	"eraNarrow": [
		"î.Hr.",
		"d.Hr."
	],
	"dateFormat-long": "d MMMM y",
	"months-format-wide": [
		"ianuarie",
		"februarie",
		"martie",
		"aprilie",
		"mai",
		"iunie",
		"iulie",
		"august",
		"septembrie",
		"octombrie",
		"noiembrie",
		"decembrie"
	],
	"dateTimeFormat-medium": "{1}, {0}",
	"dateFormatItem-EEEd": "EEE d",
	"dayPeriods-format-wide-pm": "PM",
	"dateFormat-full": "EEEE, d MMMM y",
	"dateFormatItem-Md": "d.M",
	"field-era": "eră",
	"dateFormatItem-yM": "M.yyyy",
	"months-standAlone-wide": [
		"ianuarie",
		"februarie",
		"martie",
		"aprilie",
		"mai",
		"iunie",
		"iulie",
		"august",
		"septembrie",
		"octombrie",
		"noiembrie",
		"decembrie"
	],
	"timeFormat-short": "HH:mm",
	"quarters-format-wide": [
		"trimestrul I",
		"trimestrul al II-lea",
		"trimestrul al III-lea",
		"trimestrul al IV-lea"
	],
	"timeFormat-long": "HH:mm:ss z",
	"field-year": "an",
	"dateFormatItem-yMMM": "MMM y",
	"dateFormatItem-yQ": "'trimestrul' Q y",
	"dateFormatItem-yyyyMMMM": "MMMM y",
	"field-hour": "oră",
	"dateFormatItem-MMdd": "dd.MM",
	"months-format-abbr": [
		"ian.",
		"feb.",
		"mar.",
		"apr.",
		"mai",
		"iun.",
		"iul.",
		"aug.",
		"sept.",
		"oct.",
		"nov.",
		"dec."
	],
	"dateFormatItem-yyQ": "Q yy",
	"timeFormat-full": "HH:mm:ss zzzz",
	"field-day-relative+0": "azi",
	"field-day-relative+1": "mâine",
	"field-day-relative+2": "poimâine",
	"field-day-relative+3": "răspoimâine",
	"months-standAlone-abbr": [
		"ian.",
		"feb.",
		"mar.",
		"apr.",
		"mai",
		"iun.",
		"iul.",
		"aug.",
		"sept.",
		"oct.",
		"nov.",
		"dec."
	],
	"quarters-format-abbr": [
		"trim. I",
		"trim. II",
		"trim. III",
		"trim. IV"
	],
	"quarters-standAlone-wide": [
		"trimestrul I",
		"trimestrul al II-lea",
		"trimestrul al III-lea",
		"trimestrul al IV-lea"
	],
	"dateFormatItem-M": "L",
	"days-standAlone-wide": [
		"duminică",
		"luni",
		"marți",
		"miercuri",
		"joi",
		"vineri",
		"sâmbătă"
	],
	"dateFormatItem-MMMMd": "d MMMM",
	"dateFormatItem-yyMMM": "MMM yy",
	"timeFormat-medium": "HH:mm:ss",
	"dateFormatItem-Hm": "HH:mm",
	"quarters-standAlone-abbr": [
		"trim. I",
		"trim. II",
		"trim. III",
		"trim. IV"
	],
	"eraAbbr": [
		"î.Hr.",
		"d.Hr."
	],
	"field-minute": "minut",
	"field-dayperiod": "perioada zilei",
	"days-standAlone-abbr": [
		"Du",
		"Lu",
		"Ma",
		"Mi",
		"Jo",
		"Vi",
		"Sâ"
	],
	"dateFormatItem-d": "d",
	"dateFormatItem-ms": "mm:ss",
	"quarters-format-narrow": [
		"T1",
		"T2",
		"T3",
		"T4"
	],
	"field-day-relative+-1": "ieri",
	"dateTimeFormat-long": "{1}, {0}",
	"field-day-relative+-2": "alaltăieri",
	"field-day-relative+-3": "răsalaltăieri",
	"dateFormatItem-MMMd": "d MMM",
	"dateFormatItem-MEd": "E, d MMM",
	"dateTimeFormat-full": "{1}, {0}",
	"dateFormatItem-yMMMM": "MMMM y",
	"field-day": "zi",
	"days-format-wide": [
		"duminică",
		"luni",
		"marți",
		"miercuri",
		"joi",
		"vineri",
		"sâmbătă"
	],
	"field-zone": "zonă",
	"dateFormatItem-yyyyMM": "MM.yyyy",
	"dateFormatItem-y": "y",
	"months-standAlone-narrow": [
		"I",
		"F",
		"M",
		"A",
		"M",
		"I",
		"I",
		"A",
		"S",
		"O",
		"N",
		"D"
	],
	"dateFormatItem-yyMM": "MM.yy",
	"days-format-abbr": [
		"Du",
		"Lu",
		"Ma",
		"Mi",
		"Jo",
		"Vi",
		"Sâ"
	],
	"eraNames": [
		"înainte de Hristos",
		"după Hristos"
	],
	"days-format-narrow": [
		"D",
		"L",
		"M",
		"M",
		"J",
		"V",
		"S"
	],
	"field-month": "lună",
	"days-standAlone-narrow": [
		"D",
		"L",
		"M",
		"M",
		"J",
		"V",
		"S"
	],
	"dateFormatItem-MMM": "LLL",
	"dayPeriods-format-wide-am": "AM",
	"dateFormatItem-MMMMEd": "E, d MMMM",
	"dateFormat-short": "dd.MM.yyyy",
	"field-second": "secundă",
	"dateFormatItem-yMMMEd": "EEE, d MMM y",
	"field-week": "săptămână",
	"dateFormat-medium": "dd.MM.yyyy",
	"dateTimeFormat-short": "{1}, {0}",
	"dateFormatItem-MMMEEEd": "EEE, d MMM"
}
//end v1.x content
);
},
'dojo/cldr/nls/ro/number':function(){
define(
//begin v1.x content
{
	"group": ".",
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
'dijit/form/nls/ro/ComboBox':function(){
define(
"dijit/form/nls/ro/ComboBox", //begin v1.x content
({
		previousMessage: "Alegeri anterioare",
		nextMessage: "Mai multe alegeri"
})

//end v1.x content
);

},
'*noref':1}});
define("esri/dijit/nls/AttributeInspector-all_ro", [], 1);

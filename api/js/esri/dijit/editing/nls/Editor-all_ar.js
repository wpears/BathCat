require({cache:{
'dijit/form/nls/ar/validate':function(){
define(
"dijit/form/nls/ar/validate", //begin v1.x content
({
	invalidMessage: "القيمة التي تم ادخالها غير صحيحة.",
	missingMessage: "يجب ادخال هذه القيمة.",
	rangeMessage: "هذه القيمة ليس بالمدى الصحيح."
})
//end v1.x content
);

},
'dijit/_editor/nls/ar/commands':function(){
define(
"dijit/_editor/nls/ar/commands", //begin v1.x content
({
	'bold': 'عري~ض',
	'copy': 'نسخ',
	'cut': 'قص',
	'delete': 'حذف',
	'indent': 'ازاحة للداخل',
	'insertHorizontalRule': 'مسطرة أفقية',
	'insertOrderedList': '‏كشف مرقم‏',
	'insertUnorderedList': 'كشف نقطي',
	'italic': '~مائل',
	'justifyCenter': 'محاذاة في الوسط',
	'justifyFull': 'ضبط',
	'justifyLeft': 'محاذاة الى اليسار',
	'justifyRight': 'محاذاة الى اليمين',
	'outdent': 'ازاحة للخارج',
	'paste': 'لصق',
	'redo': '‏اعادة‏',
	'removeFormat': 'ازالة النسق',
	'selectAll': '‏اختيار كل‏',
	'strikethrough': 'تشطيب',
	'subscript': 'رمز سفلي',
	'superscript': 'رمز علوي',
	'underline': '~تسطير',
	'undo': 'تراجع',
	'unlink': 'ازالة وصلة',
	'createLink': 'تكوين وصلة',
	'toggleDir': 'تبديل الاتجاه',
	'insertImage': 'ادراج صورة',
	'insertTable': 'ادراج/تحرير جدول',
	'toggleTableBorder': 'تبديل حدود الجدول',
	'deleteTable': 'حذف جدول',
	'tableProp': 'خصائص الجدول',
	'htmlToggle': 'مصدر HTML',
	'foreColor': 'لون الواجهة الأمامية',
	'hiliteColor': '‏لون الخلفية‏',
	'plainFormatBlock': 'نمط الفقرة',
	'formatBlock': 'نمط الفقرة',
	'fontSize': 'حجم طاقم الطباعة',
	'fontName': 'اسم طاقم الطباعة',
	'tabIndent': 'ازاحة علامة الجدولة للداخل',
	"fullScreen": "تبديل  الشاشة الكاملة",
	"viewSource": "مشاهدة مصدر HTML",
	"print": "طباعة",
	"newPage": "صفحة جديدة",
	/* Error messages */
	'systemShortcut': 'يكون التصرف "${0}" متاحا فقط ببرنامج الاستعراض الخاص بك باستخدام المسار المختصر للوحة المفاتيح.  استخدم ${1}.',
	'ctrlKey':'ctrl+${0}',
	'appleKey':'\u2318${0}' // "command" or open-apple key on Macintosh
})

//end v1.x content
);

},
'dojo/cldr/nls/ar/gregorian':function(){
define(
//begin v1.x content
{
	"dateFormatItem-yM": "M‏/yyyy",
	"field-dayperiod": "ص/م",
	"dateFormatItem-yQ": "yyyy Q",
	"dayPeriods-format-wide-pm": "م",
	"field-minute": "الدقائق",
	"eraNames": [
		"قبل الميلاد",
		"ميلادي"
	],
	"dateFormatItem-MMMEd": "E d MMM",
	"field-day-relative+-1": "أمس",
	"field-weekday": "اليوم",
	"dateFormatItem-yQQQ": "y QQQ",
	"dateFormatItem-MMdd": "dd‏/MM",
	"days-standAlone-wide": [
		"الأحد",
		"الإثنين",
		"الثلاثاء",
		"الأربعاء",
		"الخميس",
		"الجمعة",
		"السبت"
	],
	"dateFormatItem-MMM": "LLL",
	"months-standAlone-narrow": [
		"ي",
		"ف",
		"م",
		"أ",
		"و",
		"ن",
		"ل",
		"غ",
		"س",
		"ك",
		"ب",
		"د"
	],
	"field-era": "العصر",
	"field-hour": "الساعات",
	"dayPeriods-format-wide-am": "ص",
	"quarters-standAlone-abbr": [
		"الربع الأول",
		"الربع الثاني",
		"الربع الثالث",
		"الربع الرابع"
	],
	"dateFormatItem-y": "y",
	"timeFormat-full": "zzzz h:mm:ss a",
	"months-standAlone-abbr": [
		"يناير",
		"فبراير",
		"مارس",
		"أبريل",
		"مايو",
		"يونيو",
		"يوليو",
		"أغسطس",
		"سبتمبر",
		"أكتوبر",
		"نوفمبر",
		"ديسمبر"
	],
	"dateFormatItem-Ed": "E، d",
	"dateFormatItem-yMMM": "MMM y",
	"field-day-relative+0": "اليوم",
	"field-day-relative+1": "غدًا",
	"days-standAlone-narrow": [
		"ح",
		"ن",
		"ث",
		"ر",
		"خ",
		"ج",
		"س"
	],
	"eraAbbr": [
		"ق.م",
		"م"
	],
	"field-day-relative+2": "بعد الغد",
	"dateFormatItem-yyyyMM": "MM‏/yyyy",
	"dateFormatItem-yyyyMMMM": "MMMM، y",
	"dateFormat-long": "d MMMM، y",
	"timeFormat-medium": "h:mm:ss a",
	"field-zone": "التوقيت",
	"dateFormatItem-Hm": "HH:mm",
	"dateFormat-medium": "dd‏/MM‏/yyyy",
	"quarters-standAlone-wide": [
		"الربع الأول",
		"الربع الثاني",
		"الربع الثالث",
		"الربع الرابع"
	],
	"dateFormatItem-yMMMM": "MMMM y",
	"dateFormatItem-ms": "mm:ss",
	"field-year": "السنة",
	"quarters-standAlone-narrow": [
		"١",
		"٢",
		"٣",
		"٤"
	],
	"field-week": "الأسبوع",
	"months-standAlone-wide": [
		"يناير",
		"فبراير",
		"مارس",
		"أبريل",
		"مايو",
		"يونيو",
		"يوليو",
		"أغسطس",
		"سبتمبر",
		"أكتوبر",
		"نوفمبر",
		"ديسمبر"
	],
	"dateFormatItem-MMMMEd": "E d MMMM",
	"dateFormatItem-MMMd": "d MMM",
	"quarters-format-narrow": [
		"١",
		"٢",
		"٣",
		"٤"
	],
	"dateFormatItem-yyQ": "Q yy",
	"timeFormat-long": "z h:mm:ss a",
	"months-format-abbr": [
		"يناير",
		"فبراير",
		"مارس",
		"أبريل",
		"مايو",
		"يونيو",
		"يوليو",
		"أغسطس",
		"سبتمبر",
		"أكتوبر",
		"نوفمبر",
		"ديسمبر"
	],
	"timeFormat-short": "h:mm a",
	"field-month": "الشهر",
	"dateFormatItem-MMMMd": "d MMMM",
	"quarters-format-abbr": [
		"الربع الأول",
		"الربع الثاني",
		"الربع الثالث",
		"الربع الرابع"
	],
	"days-format-abbr": [
		"أحد",
		"إثنين",
		"ثلاثاء",
		"أربعاء",
		"خميس",
		"جمعة",
		"سبت"
	],
	"dateFormatItem-M": "L",
	"days-format-narrow": [
		"ح",
		"ن",
		"ث",
		"ر",
		"خ",
		"ج",
		"س"
	],
	"field-second": "الثواني",
	"field-day": "يوم",
	"months-format-narrow": [
		"ي",
		"ف",
		"م",
		"أ",
		"و",
		"ن",
		"ل",
		"غ",
		"س",
		"ك",
		"ب",
		"د"
	],
	"days-standAlone-abbr": [
		"أحد",
		"إثنين",
		"ثلاثاء",
		"أربعاء",
		"خميس",
		"جمعة",
		"سبت"
	],
	"dateFormat-short": "d‏/M‏/yyyy",
	"dateFormatItem-yMMMEd": "EEE، d MMMM y",
	"dateFormat-full": "EEEE، d MMMM، y",
	"dateFormatItem-Md": "d/‏M",
	"dateFormatItem-yMEd": "EEE، d/‏M/‏yyyy",
	"months-format-wide": [
		"يناير",
		"فبراير",
		"مارس",
		"أبريل",
		"مايو",
		"يونيو",
		"يوليو",
		"أغسطس",
		"سبتمبر",
		"أكتوبر",
		"نوفمبر",
		"ديسمبر"
	],
	"dateFormatItem-d": "d",
	"quarters-format-wide": [
		"الربع الأول",
		"الربع الثاني",
		"الربع الثالث",
		"الربع الرابع"
	],
	"days-format-wide": [
		"الأحد",
		"الإثنين",
		"الثلاثاء",
		"الأربعاء",
		"الخميس",
		"الجمعة",
		"السبت"
	],
	"eraNarrow": [
		"ق.م",
		"م"
	]
}
//end v1.x content
);
},
'dijit/nls/ar/loading':function(){
define(
"dijit/nls/ar/loading", //begin v1.x content
({
	loadingState: "جاري التحميل...",
	errorState: "عفوا، حدث خطأ"
})
//end v1.x content
);

},
'dojo/cldr/nls/ar/number':function(){
define(
//begin v1.x content
{
	"group": "٬",
	"percentSign": "٪",
	"exponential": "اس",
	"list": "؛",
	"infinity": "∞",
	"minusSign": "-",
	"decimal": "٫",
	"nan": "ليس رقم",
	"perMille": "؉",
	"decimalFormat": "#,##0.###;#,##0.###-",
	"currencyFormat": "¤ #,##0.00;¤ #,##0.00-",
	"plusSign": "+"
}
//end v1.x content
);
},
'dijit/form/nls/ar/ComboBox':function(){
define(
"dijit/form/nls/ar/ComboBox", //begin v1.x content
({
		previousMessage: "الاختيارات السابقة",
		nextMessage: "مزيد من الاختيارات"
})
//end v1.x content
);

},
'*noref':1}});
define("esri/dijit/editing/nls/Editor-all_ar", [], 1);

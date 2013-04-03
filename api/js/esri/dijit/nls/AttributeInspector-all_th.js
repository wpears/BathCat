require({cache:{
'dijit/form/nls/th/validate':function(){
define(
"dijit/form/nls/th/validate", //begin v1.x content
({
	invalidMessage: "ค่าที่ป้อนไม่ถูกต้อง",
	missingMessage: "จำเป็นต้องมีค่านี้",
	rangeMessage: "ค่านี้เกินช่วง"
})

//end v1.x content
);

},
'dijit/_editor/nls/th/commands':function(){
define(
"dijit/_editor/nls/th/commands", //begin v1.x content
({
	'bold': 'ตัวหนา',
	'copy': 'คัดลอก',
	'cut': 'ตัด',
	'delete': 'ลบ',
	'indent': 'เพิ่มการเยื้อง',
	'insertHorizontalRule': 'ไม้บรรทัดแนวนอน',
	'insertOrderedList': 'ลำดับเลข',
	'insertUnorderedList': 'หัวข้อย่อย',
	'italic': 'ตัวเอียง',
	'justifyCenter': 'จัดกึ่งกลาง',
	'justifyFull': 'จัดชิดขอบ',
	'justifyLeft': 'จัดชิดซ้าย',
	'justifyRight': 'จัดชิดขวา',
	'outdent': 'ลดการเยื้อง',
	'paste': 'วาง',
	'redo': 'ทำซ้ำ',
	'removeFormat': 'ลบรูปแบบออก',
	'selectAll': 'เลือกทั้งหมด',
	'strikethrough': 'ขีดทับ',
	'subscript': 'ตัวห้อย',
	'superscript': 'ตัวยก',
	'underline': 'ขีดเส้นใต้',
	'undo': 'เลิกทำ',
	'unlink': 'ลบลิงก์ออก',
	'createLink': 'สร้างลิงก์',
	'toggleDir': 'สลับทิศทาง',
	'insertImage': 'แทรกอิมเมจ',
	'insertTable': 'แทรก/แก้ไขตาราง',
	'toggleTableBorder': 'สลับเส้นขอบตาราง',
	'deleteTable': 'ลบตาราง',
	'tableProp': 'คุณสมบัติตาราง',
	'htmlToggle': 'ซอร์ส HTML',
	'foreColor': 'สีพื้นหน้า',
	'hiliteColor': 'สีพื้นหลัง',
	'plainFormatBlock': 'ลักษณะย่อหน้า',
	'formatBlock': 'ลักษณะย่อหน้า',
	'fontSize': 'ขนาดฟอนต์',
	'fontName': 'ชื่อฟอนต์',
	'tabIndent': 'เยื้องแท็บ',
	"fullScreen": "สลับจอภาพแบบเต็ม",
	"viewSource": "ดูซอร์ส HTML",
	"print": "พิมพ์",
	"newPage": "หน้าใหม่",
	/* Error messages */
	'systemShortcut': 'การดำเนินการ"${0}" ใช้งานได้เฉพาะกับเบราว์เซอร์ของคุณโดยใช้แป้นพิมพ์ลัด ใช้ ${1}'
})

//end v1.x content
);

},
'dojo/cldr/nls/th/gregorian':function(){
define(
//begin v1.x content
{
	"months-format-narrow": [
		"ม.ค.",
		"ก.พ.",
		"มี.ค.",
		"เม.ย.",
		"พ.ค.",
		"มิ.ย.",
		"ก.ค.",
		"ส.ค.",
		"ก.ย.",
		"ต.ค.",
		"พ.ย.",
		"ธ.ค."
	],
	"field-weekday": "วันในสัปดาห์",
	"dateFormatItem-yQQQ": "QQQ y",
	"dateFormatItem-yMEd": "EEE d/M/yyyy",
	"dateFormatItem-MMMEd": "E d MMM",
	"eraNarrow": [
		"ก่อน ค.ศ.",
		"ค.ศ."
	],
	"dateFormat-long": "d MMMM y",
	"months-format-wide": [
		"มกราคม",
		"กุมภาพันธ์",
		"มีนาคม",
		"เมษายน",
		"พฤษภาคม",
		"มิถุนายน",
		"กรกฎาคม",
		"สิงหาคม",
		"กันยายน",
		"ตุลาคม",
		"พฤศจิกายน",
		"ธันวาคม"
	],
	"dateTimeFormat-medium": "{1}, {0}",
	"dateFormatItem-EEEd": "EEE d",
	"dayPeriods-format-wide-pm": "หลังเที่ยง",
	"dateFormat-full": "EEEEที่ d MMMM G y",
	"dateFormatItem-Md": "d/M",
	"field-era": "สมัย",
	"dateFormatItem-yM": "M/yyyy",
	"months-standAlone-wide": [
		"มกราคม",
		"กุมภาพันธ์",
		"มีนาคม",
		"เมษายน",
		"พฤษภาคม",
		"มิถุนายน",
		"กรกฎาคม",
		"สิงหาคม",
		"กันยายน",
		"ตุลาคม",
		"พฤศจิกายน",
		"ธันวาคม"
	],
	"timeFormat-short": "H:mm",
	"quarters-format-wide": [
		"ไตรมาส 1",
		"ไตรมาส 2",
		"ไตรมาส 3",
		"ไตรมาส 4"
	],
	"timeFormat-long": "H นาฬิกา m นาที ss วินาที z",
	"field-year": "ปี",
	"dateFormatItem-yMMM": "MMM y",
	"dateFormatItem-yQ": "Q yyyy",
	"dateFormatItem-yyyyMMMM": "MMMM y",
	"field-hour": "ชั่วโมง",
	"months-format-abbr": [
		"ม.ค.",
		"ก.พ.",
		"มี.ค.",
		"เม.ย.",
		"พ.ค.",
		"มิ.ย.",
		"ก.ค.",
		"ส.ค.",
		"ก.ย.",
		"ต.ค.",
		"พ.ย.",
		"ธ.ค."
	],
	"dateFormatItem-yyQ": "Q yy",
	"timeFormat-full": "H นาฬิกา m นาที ss วินาที zzzz",
	"field-day-relative+0": "วันนี้",
	"field-day-relative+1": "พรุ่งนี้",
	"field-day-relative+2": "มะรืนนี้",
	"dateFormatItem-H": "H",
	"field-day-relative+3": "สามวันต่อจากนี้",
	"months-standAlone-abbr": [
		"ม.ค.",
		"ก.พ.",
		"มี.ค.",
		"เม.ย.",
		"พ.ค.",
		"มิ.ย.",
		"ก.ค.",
		"ส.ค.",
		"ก.ย.",
		"ต.ค.",
		"พ.ย.",
		"ธ.ค."
	],
	"quarters-format-abbr": [
		"Q1",
		"Q2",
		"Q3",
		"Q4"
	],
	"quarters-standAlone-wide": [
		"ไตรมาส 1",
		"ไตรมาส 2",
		"ไตรมาส 3",
		"ไตรมาส 4"
	],
	"dateFormatItem-M": "L",
	"days-standAlone-wide": [
		"วันอาทิตย์",
		"วันจันทร์",
		"วันอังคาร",
		"วันพุธ",
		"วันพฤหัสบดี",
		"วันศุกร์",
		"วันเสาร์"
	],
	"dateFormatItem-MMMMd": "d MMMM",
	"timeFormat-medium": "H:mm:ss",
	"dateFormatItem-Hm": "H:mm",
	"eraAbbr": [
		"ปีก่อน ค.ศ.",
		"ค.ศ."
	],
	"field-minute": "นาที",
	"field-dayperiod": "ช่วงวัน",
	"days-standAlone-abbr": [
		"อา.",
		"จ.",
		"อ.",
		"พ.",
		"พฤ.",
		"ศ.",
		"ส."
	],
	"dateFormatItem-d": "d",
	"dateFormatItem-ms": "mm:ss",
	"field-day-relative+-1": "เมื่อวาน",
	"dateTimeFormat-long": "{1}, {0}",
	"field-day-relative+-2": "เมื่อวานซืน",
	"field-day-relative+-3": "สามวันก่อน",
	"dateFormatItem-MMMd": "d MMM",
	"dateFormatItem-MEd": "E, d/M",
	"dateTimeFormat-full": "{1}, {0}",
	"dateFormatItem-yMMMM": "MMMM y",
	"field-day": "วัน",
	"days-format-wide": [
		"วันอาทิตย์",
		"วันจันทร์",
		"วันอังคาร",
		"วันพุธ",
		"วันพฤหัสบดี",
		"วันศุกร์",
		"วันเสาร์"
	],
	"field-zone": "เขต",
	"dateFormatItem-y": "y",
	"months-standAlone-narrow": [
		"ม.ค.",
		"ก.พ.",
		"มี.ค.",
		"เม.ย.",
		"พ.ค.",
		"มิ.ย.",
		"ก.ค.",
		"ส.ค.",
		"ก.ย.",
		"ต.ค.",
		"พ.ย.",
		"ธ.ค."
	],
	"days-format-abbr": [
		"อา.",
		"จ.",
		"อ.",
		"พ.",
		"พฤ.",
		"ศ.",
		"ส."
	],
	"eraNames": [
		"ปีก่อนคริสต์ศักราช",
		"คริสต์ศักราช"
	],
	"days-format-narrow": [
		"อ",
		"จ",
		"อ",
		"พ",
		"พ",
		"ศ",
		"ส"
	],
	"field-month": "เดือน",
	"days-standAlone-narrow": [
		"อ",
		"จ",
		"อ",
		"พ",
		"พ",
		"ศ",
		"ส"
	],
	"dateFormatItem-MMM": "LLL",
	"dayPeriods-format-wide-am": "ก่อนเที่ยง",
	"dateFormatItem-MMMMEd": "E d MMMM",
	"dateFormat-short": "d/M/yyyy",
	"field-second": "วินาที",
	"dateFormatItem-yMMMEd": "EEE d MMM y",
	"field-week": "สัปดาห์",
	"dateFormat-medium": "d MMM y",
	"dateFormatItem-yyyyM": "M/yyyy",
	"dateFormatItem-mmss": "mm:ss",
	"dateTimeFormat-short": "{1}, {0}",
	"dateFormatItem-Hms": "H:mm:ss"
}
//end v1.x content
);
},
'dojo/cldr/nls/th/number':function(){
define(
//begin v1.x content
{
	"group": ",",
	"percentSign": "%",
	"exponential": "E",
	"scientificFormat": "#E0",
	"percentFormat": "#,##0%",
	"list": ";",
	"infinity": "∞",
	"patternDigit": "#",
	"minusSign": "-",
	"decimal": ".",
	"nan": "NaN",
	"nativeZeroDigit": "0",
	"perMille": "‰",
	"decimalFormat": "#,##0.###",
	"currencyFormat": "¤#,##0.00;¤-#,##0.00",
	"plusSign": "+"
}
//end v1.x content
);
},
'dijit/form/nls/th/ComboBox':function(){
define(
"dijit/form/nls/th/ComboBox", //begin v1.x content
({
		previousMessage: "การเลือกก่อนหน้า",
		nextMessage: "การเลือกเพิ่มเติม"
})

//end v1.x content
);

},
'*noref':1}});
define("esri/dijit/nls/AttributeInspector-all_th", [], 1);

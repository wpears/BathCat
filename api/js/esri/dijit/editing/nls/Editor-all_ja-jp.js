require({cache:{
'dijit/form/nls/ja/validate':function(){
define(
"dijit/form/nls/ja/validate", //begin v1.x content
({
	invalidMessage: "入力した値は無効です。",
	missingMessage: "この値は必須です。",
	rangeMessage: "この値は範囲外です。"
})
//end v1.x content
);

},
'dijit/form/nls/ja-jp/validate':function(){
define('dijit/form/nls/ja-jp/validate',{});
},
'dijit/_editor/nls/ja/commands':function(){
define(
"dijit/_editor/nls/ja/commands", //begin v1.x content
({
	'bold': '太字',
	'copy': 'コピー',
	'cut': '切り取り',
	'delete': '削除',
	'indent': 'インデント',
	'insertHorizontalRule': '水平罫線',
	'insertOrderedList': '番号付きリスト',
	'insertUnorderedList': '黒丸付きリスト',
	'italic': 'イタリック',
	'justifyCenter': '中央揃え',
	'justifyFull': '両端揃え',
	'justifyLeft': '左揃え',
	'justifyRight': '右揃え',
	'outdent': 'アウトデント',
	'paste': '貼り付け',
	'redo': 'やり直し',
	'removeFormat': '書式のクリア',
	'selectAll': 'すべて選択',
	'strikethrough': '取り消し線',
	'subscript': '下付き文字',
	'superscript': '上付き文字',
	'underline': '下線',
	'undo': '元に戻す',
	'unlink': 'リンクの削除',
	'createLink': 'リンクの作成',
	'toggleDir': '方向の切り替え',
	'insertImage': 'イメージの挿入',
	'insertTable': 'テーブルの挿入/編集',
	'toggleTableBorder': 'テーブル・ボーダーの切り替え',
	'deleteTable': 'テーブルの削除',
	'tableProp': 'テーブル・プロパティー',
	'htmlToggle': 'HTML ソース',
	'foreColor': '前景色',
	'hiliteColor': 'マーカー',
	'plainFormatBlock': '段落スタイル',
	'formatBlock': '段落スタイル',
	'fontSize': 'フォント・サイズ',
	'fontName': 'フォント名',
	'tabIndent': 'タブ・インデント',
	"fullScreen": "全画面表示に切り替え",
	"viewSource": "HTML ソースの表示",
	"print": "印刷",
	"newPage": "新規ページ",
	/* Error messages */
	'systemShortcut': '"${0}" アクションを使用できるのは、ブラウザーでキーボード・ショートカットを使用する場合のみです。${1} を使用してください。',
	'ctrlKey':'Ctrl+${0}'
})
//end v1.x content
);

},
'dijit/_editor/nls/ja-jp/commands':function(){
define('dijit/_editor/nls/ja-jp/commands',{});
},
'dojo/cldr/nls/ja/gregorian':function(){
define(
//begin v1.x content
{
	"field-weekday": "曜日",
	"dateFormatItem-yQQQ": "yQQQ",
	"dateFormatItem-yMEd": "y/M/d(EEE)",
	"dateFormatItem-MMMEd": "M月d日(E)",
	"eraNarrow": [
		"BC",
		"AD"
	],
	"dateFormat-long": "y年M月d日",
	"months-format-wide": [
		"1月",
		"2月",
		"3月",
		"4月",
		"5月",
		"6月",
		"7月",
		"8月",
		"9月",
		"10月",
		"11月",
		"12月"
	],
	"dateTimeFormat-medium": "{1} {0}",
	"dayPeriods-format-wide-pm": "午後",
	"dateFormat-full": "y年M月d日EEEE",
	"dateFormatItem-Md": "M/d",
	"dateFormatItem-yMd": "y/M/d",
	"field-era": "時代",
	"dateFormatItem-yM": "y/M",
	"months-standAlone-wide": [
		"1月",
		"2月",
		"3月",
		"4月",
		"5月",
		"6月",
		"7月",
		"8月",
		"9月",
		"10月",
		"11月",
		"12月"
	],
	"timeFormat-short": "H:mm",
	"quarters-format-wide": [
		"第1四半期",
		"第2四半期",
		"第3四半期",
		"第4四半期"
	],
	"timeFormat-long": "H:mm:ss z",
	"field-year": "年",
	"dateFormatItem-yMMM": "y年M月",
	"dateFormatItem-yQ": "y/Q",
	"field-hour": "時",
	"dateFormatItem-MMdd": "MM/dd",
	"months-format-abbr": [
		"1月",
		"2月",
		"3月",
		"4月",
		"5月",
		"6月",
		"7月",
		"8月",
		"9月",
		"10月",
		"11月",
		"12月"
	],
	"dateFormatItem-yyQ": "yy/Q",
	"timeFormat-full": "H時mm分ss秒 zzzz",
	"field-day-relative+0": "今日",
	"field-day-relative+1": "明日",
	"field-day-relative+2": "明後日",
	"dateFormatItem-H": "H時",
	"field-day-relative+3": "3日後",
	"months-standAlone-abbr": [
		"1月",
		"2月",
		"3月",
		"4月",
		"5月",
		"6月",
		"7月",
		"8月",
		"9月",
		"10月",
		"11月",
		"12月"
	],
	"quarters-format-abbr": [
		"Q1",
		"Q2",
		"Q3",
		"Q4"
	],
	"quarters-standAlone-wide": [
		"第1四半期",
		"第2四半期",
		"第3四半期",
		"第4四半期"
	],
	"dateFormatItem-M": "M月",
	"days-standAlone-wide": [
		"日曜日",
		"月曜日",
		"火曜日",
		"水曜日",
		"木曜日",
		"金曜日",
		"土曜日"
	],
	"dateFormatItem-yyMMM": "y年M月",
	"timeFormat-medium": "H:mm:ss",
	"dateFormatItem-Hm": "H:mm",
	"eraAbbr": [
		"BC",
		"AD"
	],
	"field-minute": "分",
	"field-dayperiod": "午前/午後",
	"days-standAlone-abbr": [
		"日",
		"月",
		"火",
		"水",
		"木",
		"金",
		"土"
	],
	"dateFormatItem-d": "d日",
	"dateFormatItem-ms": "mm:ss",
	"field-day-relative+-1": "昨日",
	"dateFormatItem-h": "ah時",
	"dateTimeFormat-long": "{1}{0}",
	"field-day-relative+-2": "一昨日",
	"field-day-relative+-3": "3日前",
	"dateFormatItem-MMMd": "M月d日",
	"dateFormatItem-MEd": "M/d(E)",
	"dateTimeFormat-full": "{1}{0}",
	"field-day": "日",
	"days-format-wide": [
		"日曜日",
		"月曜日",
		"火曜日",
		"水曜日",
		"木曜日",
		"金曜日",
		"土曜日"
	],
	"field-zone": "タイムゾーン",
	"dateFormatItem-yyyyMM": "yyyy/MM",
	"dateFormatItem-y": "y年",
	"months-standAlone-narrow": [
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"11",
		"12"
	],
	"dateFormatItem-hm": "ah:mm",
	"dateFormatItem-GGGGyMd": "GGGGy年M月d日",
	"days-format-abbr": [
		"日",
		"月",
		"火",
		"水",
		"木",
		"金",
		"土"
	],
	"dateFormatItem-yMMMd": "y年M月d日",
	"eraNames": [
		"紀元前",
		"西暦"
	],
	"days-format-narrow": [
		"日",
		"月",
		"火",
		"水",
		"木",
		"金",
		"土"
	],
	"field-month": "月",
	"days-standAlone-narrow": [
		"日",
		"月",
		"火",
		"水",
		"木",
		"金",
		"土"
	],
	"dateFormatItem-MMM": "LLL",
	"dayPeriods-format-wide-am": "午前",
	"dateFormat-short": "yy/MM/dd",
	"field-second": "秒",
	"dateFormatItem-yMMMEd": "y年M月d日(EEE)",
	"dateFormatItem-Ed": "d日(EEE)",
	"field-week": "週",
	"dateFormat-medium": "yyyy/MM/dd",
	"dateTimeFormat-short": "{1} {0}",
	"dateFormatItem-Hms": "H:mm:ss",
	"dateFormatItem-hms": "ah:mm:ss",
	"dateFormatItem-yyyy": "y年"
}
//end v1.x content
);
},
'dojo/cldr/nls/ja-jp/gregorian':function(){
define('dojo/cldr/nls/ja-jp/gregorian',{});
},
'dijit/nls/ja/loading':function(){
define(
"dijit/nls/ja/loading", //begin v1.x content
({
	loadingState: "ロード中...",
	errorState: "エラーが発生しました。"
})
//end v1.x content
);

},
'dijit/nls/ja-jp/loading':function(){
define('dijit/nls/ja-jp/loading',{});
},
'dojo/cldr/nls/ja/number':function(){
define(
//begin v1.x content
{
	"decimalFormat": "#,##0.###",
	"group": ",",
	"scientificFormat": "#E0",
	"percentFormat": "#,##0%",
	"currencyFormat": "¤#,##0.00",
	"decimal": "."
}
//end v1.x content
);
},
'dojo/cldr/nls/ja-jp/number':function(){
define('dojo/cldr/nls/ja-jp/number',{});
},
'dijit/form/nls/ja/ComboBox':function(){
define(
"dijit/form/nls/ja/ComboBox", //begin v1.x content
({
		previousMessage: "以前の選択項目",
		nextMessage: "追加の選択項目"
})
//end v1.x content
);

},
'dijit/form/nls/ja-jp/ComboBox':function(){
define('dijit/form/nls/ja-jp/ComboBox',{});
},
'*noref':1}});
define("esri/dijit/editing/nls/Editor-all_ja-jp", [], 1);

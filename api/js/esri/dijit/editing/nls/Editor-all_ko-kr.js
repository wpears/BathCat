require({cache:{
'dijit/form/nls/ko/validate':function(){
define(
"dijit/form/nls/ko/validate", //begin v1.x content
({
	invalidMessage: "입력된 값이 올바르지 않습니다.",
	missingMessage: "이 값은 필수입니다.",
	rangeMessage: "이 값은 범위를 벗어납니다."
})
//end v1.x content
);

},
'dijit/form/nls/ko-kr/validate':function(){
define('dijit/form/nls/ko-kr/validate',{});
},
'dijit/_editor/nls/ko/commands':function(){
define(
"dijit/_editor/nls/ko/commands", //begin v1.x content
({
	'bold': '굵게',
	'copy': '복사',
	'cut': '잘라내기',
	'delete': '삭제',
	'indent': '들여쓰기',
	'insertHorizontalRule': '수평 자',
	'insertOrderedList': '번호 목록',
	'insertUnorderedList': '글머리표 목록',
	'italic': '기울임꼴',
	'justifyCenter': '가운데 맞춤',
	'justifyFull': '양쪽 맞춤',
	'justifyLeft': '왼쪽 맞춤',
	'justifyRight': '오른쪽 맞춤',
	'outdent': '내어쓰기',
	'paste': '붙여넣기',
	'redo': '다시 실행',
	'removeFormat': '형식 제거',
	'selectAll': '모두 선택',
	'strikethrough': '취소선',
	'subscript': '아래첨자',
	'superscript': '위첨자',
	'underline': '밑줄',
	'undo': '실행 취소',
	'unlink': '링크 제거',
	'createLink': '링크 작성',
	'toggleDir': '방향 토글',
	'insertImage': '이미지 삽입',
	'insertTable': '테이블 삽입/편집',
	'toggleTableBorder': '테이블 외곽선 토글',
	'deleteTable': '테이블 삭제',
	'tableProp': '테이블 특성',
	'htmlToggle': 'HTML 소스',
	'foreColor': '전경색',
	'hiliteColor': '배경색',
	'plainFormatBlock': '단락 양식',
	'formatBlock': '단락 양식',
	'fontSize': '글꼴 크기',
	'fontName': '글꼴 이름',
	'tabIndent': '탭 들여쓰기',
	"fullScreen": "전체 화면 토글",
	"viewSource": "HTML 소스 보기",
	"print": "인쇄",
	"newPage": "새 페이지",
	/* Error messages */
	'systemShortcut': '"${0}" 조치는 브라우저에서 키보드 단축키를 통해서만 사용 가능합니다. ${1}을(를) 사용하십시오.'
})
//end v1.x content
);

},
'dijit/_editor/nls/ko-kr/commands':function(){
define('dijit/_editor/nls/ko-kr/commands',{});
},
'dojo/cldr/nls/ko/gregorian':function(){
define(
//begin v1.x content
{
	"months-format-narrow": [
		"1월",
		"2월",
		"3월",
		"4월",
		"5월",
		"6월",
		"7월",
		"8월",
		"9월",
		"10월",
		"11월",
		"12월"
	],
	"field-weekday": "요일",
	"dateFormatItem-yQQQ": "y년 QQQ",
	"dateFormatItem-yMEd": "yyyy. M. d. EEE",
	"dateFormatItem-MMMEd": "MMM d일 (E)",
	"eraNarrow": [
		"기원전",
		"서기"
	],
	"dateFormat-long": "y년 M월 d일",
	"months-format-wide": [
		"1월",
		"2월",
		"3월",
		"4월",
		"5월",
		"6월",
		"7월",
		"8월",
		"9월",
		"10월",
		"11월",
		"12월"
	],
	"dateTimeFormat-medium": "{1} {0}",
	"dateFormatItem-EEEd": "d일 EEE",
	"dayPeriods-format-wide-pm": "오후",
	"dateFormat-full": "y년 M월 d일 EEEE",
	"dateFormatItem-Md": "M. d.",
	"field-era": "연호",
	"dateFormatItem-yM": "yyyy. M.",
	"months-standAlone-wide": [
		"1월",
		"2월",
		"3월",
		"4월",
		"5월",
		"6월",
		"7월",
		"8월",
		"9월",
		"10월",
		"11월",
		"12월"
	],
	"timeFormat-short": "a h:mm",
	"quarters-format-wide": [
		"제 1/4분기",
		"제 2/4분기",
		"제 3/4분기",
		"제 4/4분기"
	],
	"timeFormat-long": "a h시 m분 s초 z",
	"field-year": "년",
	"dateFormatItem-yMMM": "y년 MMM",
	"dateFormatItem-yQ": "y년 Q분기",
	"field-hour": "시",
	"dateFormatItem-MMdd": "MM. dd",
	"months-format-abbr": [
		"1월",
		"2월",
		"3월",
		"4월",
		"5월",
		"6월",
		"7월",
		"8월",
		"9월",
		"10월",
		"11월",
		"12월"
	],
	"dateFormatItem-yyQ": "yy년 Q분기",
	"timeFormat-full": "a h시 m분 s초 zzzz",
	"field-day-relative+0": "오늘",
	"field-day-relative+1": "내일",
	"field-day-relative+2": "모레",
	"dateFormatItem-H": "H시",
	"field-day-relative+3": "3일후",
	"months-standAlone-abbr": [
		"1월",
		"2월",
		"3월",
		"4월",
		"5월",
		"6월",
		"7월",
		"8월",
		"9월",
		"10월",
		"11월",
		"12월"
	],
	"quarters-format-abbr": [
		"1분기",
		"2분기",
		"3분기",
		"4분기"
	],
	"quarters-standAlone-wide": [
		"제 1/4분기",
		"제 2/4분기",
		"제 3/4분기",
		"제 4/4분기"
	],
	"dateFormatItem-HHmmss": "HH:mm:ss",
	"dateFormatItem-M": "M월",
	"days-standAlone-wide": [
		"일요일",
		"월요일",
		"화요일",
		"수요일",
		"목요일",
		"금요일",
		"토요일"
	],
	"dateFormatItem-yyMMM": "yy년 MMM",
	"timeFormat-medium": "a h:mm:ss",
	"dateFormatItem-Hm": "HH:mm",
	"quarters-standAlone-abbr": [
		"1분기",
		"2분기",
		"3분기",
		"4분기"
	],
	"eraAbbr": [
		"기원전",
		"서기"
	],
	"field-minute": "분",
	"field-dayperiod": "오전/오후",
	"days-standAlone-abbr": [
		"일",
		"월",
		"화",
		"수",
		"목",
		"금",
		"토"
	],
	"dateFormatItem-d": "d일",
	"dateFormatItem-ms": "mm:ss",
	"field-day-relative+-1": "어제",
	"dateFormatItem-h": "a h시",
	"dateTimeFormat-long": "{1} {0}",
	"field-day-relative+-2": "그저께",
	"field-day-relative+-3": "그끄제",
	"dateFormatItem-MMMd": "MMM d일",
	"dateFormatItem-MEd": "M. d. (E)",
	"dateTimeFormat-full": "{1} {0}",
	"field-day": "일",
	"days-format-wide": [
		"일요일",
		"월요일",
		"화요일",
		"수요일",
		"목요일",
		"금요일",
		"토요일"
	],
	"field-zone": "시간대",
	"dateFormatItem-yyyyMM": "yyyy. MM",
	"dateFormatItem-y": "y년",
	"months-standAlone-narrow": [
		"1월",
		"2월",
		"3월",
		"4월",
		"5월",
		"6월",
		"7월",
		"8월",
		"9월",
		"10월",
		"11월",
		"12월"
	],
	"dateFormatItem-yyMM": "YY. M.",
	"dateFormatItem-hm": "a h:mm",
	"days-format-abbr": [
		"일",
		"월",
		"화",
		"수",
		"목",
		"금",
		"토"
	],
	"dateFormatItem-yMMMd": "y년 MMM d일",
	"eraNames": [
		"서력기원전",
		"서력기원"
	],
	"days-format-narrow": [
		"일",
		"월",
		"화",
		"수",
		"목",
		"금",
		"토"
	],
	"field-month": "월",
	"days-standAlone-narrow": [
		"일",
		"월",
		"화",
		"수",
		"목",
		"금",
		"토"
	],
	"dateFormatItem-MMM": "LLL",
	"dayPeriods-format-wide-am": "오전",
	"dateFormat-short": "yy. M. d.",
	"field-second": "초",
	"dateFormatItem-yMMMEd": "y년 MMM d일 EEE",
	"dateFormatItem-Ed": "d일 (E)",
	"field-week": "주",
	"dateFormat-medium": "yyyy. M. d.",
	"dateFormatItem-mmss": "mm:ss",
	"dateTimeFormat-short": "{1} {0}",
	"dateFormatItem-Hms": "H시 m분 s초",
	"dateFormatItem-hms": "a h:mm:ss"
}
//end v1.x content
);
},
'dojo/cldr/nls/ko-kr/gregorian':function(){
define('dojo/cldr/nls/ko-kr/gregorian',{});
},
'dijit/nls/ko/loading':function(){
define(
"dijit/nls/ko/loading", //begin v1.x content
({
	loadingState: "로드 중...",
	errorState: "죄송합니다. 오류가 발생했습니다."
})
//end v1.x content
);

},
'dijit/nls/ko-kr/loading':function(){
define('dijit/nls/ko-kr/loading',{});
},
'dojo/cldr/nls/ko/number':function(){
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
	"currencyFormat": "¤#,##0.00",
	"plusSign": "+"
}
//end v1.x content
);
},
'dojo/cldr/nls/ko-kr/number':function(){
define('dojo/cldr/nls/ko-kr/number',{});
},
'dijit/form/nls/ko/ComboBox':function(){
define(
"dijit/form/nls/ko/ComboBox", //begin v1.x content
({
		previousMessage: "이전 선택사항",
		nextMessage: "기타 선택사항"
})
//end v1.x content
);

},
'dijit/form/nls/ko-kr/ComboBox':function(){
define('dijit/form/nls/ko-kr/ComboBox',{});
},
'*noref':1}});
define("esri/dijit/editing/nls/Editor-all_ko-kr", [], 1);

# 🎹 KeyBoard.js

지정된 div 영역에 표준 키보드 배열을 렌더링하는 JavaScript 라이브러리입니다. 키에 색상을 적용하거나, 키 누름 효과, 키 시퀀스 애니메이션 등 다양한 시각적 효과를 제공합니다.

## ✨ 주요 기능

- **🎨 키보드 렌더링**: 표준 QWERTY 키보드 배열을 완전히 구현
- **🌈 키 색상 변경**: 특정 키에 원하는 색상 적용
- **⚡ 키 누름 효과**: 키를 누른 듯한 시각적 피드백
- **🎬 키 시퀀스**: 여러 키를 순서대로 누르는 애니메이션
- **📱 반응형**: 컨테이너 크기에 맞춰 자동 조정
- **🎪 쉬운 사용법**: 간단한 API로 빠른 구현

## 🚀 빠른 시작

### 1. HTML에 포함
```html
<!DOCTYPE html>
<html>
<head>
    <title>KeyBoard.js 예제</title>
</head>
<body>
    <!-- 키보드가 렌더링될 영역 -->
    <div id="my-keyboard"></div>
    
    <!-- 라이브러리 로드 -->
    <script src="keyboard.js"></script>
    <script>
        // 키보드 생성
        const kb = new KeyBoard('#my-keyboard');
    </script>
</body>
</html>
```

### 2. 기본 사용법
```javascript
// 키보드 인스턴스 생성
const kb = new KeyBoard('#keyboard-container');

// 키에 색상 적용
kb.mark('a', '#ff6b6b');        // 'a' 키를 빨간색으로
kb.mark('enter', '#4ecdc4');    // Enter 키를 청록색으로

// 키 누름 효과 (300ms 동안)
kb.press('space', 300);

// 키 시퀀스 실행
kb.flow(['h','e','l','l','o'], {
    delay: 200,      // 키 사이 간격 (ms)
    pressDelay: 150  // 각 키 누름 지속시간 (ms)
});
```

## 📋 API 레퍼런스

### `new KeyBoard(selector)`
새로운 키보드 인스턴스를 생성합니다.

**매개변수:**
- `selector` (string): 키보드를 렌더링할 DOM 요소의 CSS 선택자

**예제:**
```javascript
const kb = new KeyBoard('#my-div');
const kb2 = new KeyBoard('.keyboard-area');
```

### `mark(key, color)`
지정된 키에 색상을 적용합니다.

**매개변수:**
- `key` (string): 키 이름 (예: 'a', 'enter', 'f1', 'space')
- `color` (string, 선택사항): 16진수 색상값 (기본값: '#ff6b6b')

**예제:**
```javascript
kb.mark('a');                    // 기본 빨간색
kb.mark('space', '#00ff00');     // 초록색
kb.mark('ctrl', 'rgb(255,0,0)'); // RGB 색상
```

### `press(key, delay)`
키를 누른 듯한 시각적 효과를 제공합니다.

**매개변수:**
- `key` (string): 키 이름
- `delay` (number, 선택사항): 효과 지속시간 (ms, 기본값: 200)

**예제:**
```javascript
kb.press('enter');          // 200ms 누름 효과
kb.press('space', 500);     // 500ms 누름 효과
```

### `flow(keys, options)`
키 배열을 순서대로 누르는 애니메이션을 실행합니다.

**매개변수:**
- `keys` (array): 키 이름 배열
- `options` (object, 선택사항): 옵션 객체
  - `delay` (number): 키 사이 간격 (ms, 기본값: 300)
  - `pressDelay` (number): 각 키 누름 지속시간 (ms, 기본값: 200)

**예제:**
```javascript
// 기본 옵션으로 실행
kb.flow(['h','e','l','l','o']);

// 사용자 정의 옵션
kb.flow(['q','w','e','r','t','y'], {
    delay: 150,
    pressDelay: 100
});
```

### `clearMarks()`
모든 키의 색상을 초기화합니다.

**예제:**
```javascript
kb.clearMarks();
```

### `destroy()`
키보드를 DOM에서 제거합니다.

**예제:**
```javascript
kb.destroy();
```

## 🎯 지원되는 키

### 문자 키
- **알파벳**: `a` ~ `z`
- **숫자**: `1` ~ `0`
- **특수문자**: `` ` ``, `-`, `=`, `[`, `]`, `\`, `;`, `'`, `,`, `.`, `/`

### 기능 키
- **펑션키**: `f1` ~ `f12`
- **특수키**: `esc`, `tab`, `caps lock`, `shift`, `ctrl`, `alt`, `space`, `enter`, `backspace`
- **윈도우키**: `win`, `menu`
- **방향키**: `↑`, `↓`, `←`, `→` (또는 `arrowup`, `arrowdown`, `arrowleft`, `arrowright`)

### 키 이름 규칙
- 대소문자 구분하지 않음
- 공백이 있는 키는 소문자로 연결: `caps lock`, `page up`
- 심볼 키는 그대로: `+`, `-`, `=`, `[`, `]`

## 🎨 스타일 커스터마이징

CSS를 사용하여 키보드 스타일을 자유롭게 커스터마이징할 수 있습니다:

```css
/* 키보드 전체 컨테이너 */
.keyboard-js {
    background: #2c3e50;
    border-radius: 12px;
}

/* 개별 키 스타일 */
.keyboard-key {
    background: #34495e;
    color: #ecf0f1;
    border: 2px solid #4a90e2;
    font-weight: bold;
}

/* 키 호버 효과 */
.keyboard-key:hover {
    background: #4a90e2;
    transform: scale(1.05);
}

/* 특수 키 (Shift, Ctrl 등) */
.keyboard-key.special-key {
    background: #e74c3c;
    font-size: 11px;
}

/* 방향키 */
.keyboard-key.arrow-key {
    background: #27ae60;
    font-size: 16px;
}
```

## 🌟 실제 사용 예제

### 게이밍 키보드 하이라이트
```javascript
const kb = new KeyBoard('#gaming-keyboard');

// WASD 키 하이라이트
kb.mark('w', '#00ff00');
kb.mark('a', '#00ff00');
kb.mark('s', '#00ff00');
kb.mark('d', '#00ff00');
kb.mark('space', '#ff0000');
```

### 타이핑 시뮬레이션
```javascript
const kb = new KeyBoard('#typing-demo');

async function simulateTyping(text) {
    const keys = text.toLowerCase().split('');
    await kb.flow(keys, { delay: 150, pressDelay: 100 });
}

simulateTyping("Hello, World!");
```

### 단축키 가이드
```javascript
const kb = new KeyBoard('#shortcut-guide');

// Ctrl+C 조합 표시
kb.mark('ctrl', '#ffd700');
kb.mark('c', '#ffd700');

setTimeout(() => {
    kb.press('ctrl', 200);
    kb.press('c', 200);
}, 1000);
```

## 🔧 고급 기능

### 색상 자동 대비 조정
라이브러리는 배경색에 따라 텍스트 색상을 자동으로 조정합니다:

```javascript
kb.mark('a', '#000000');  // 검은 배경 → 흰색 텍스트
kb.mark('b', '#ffffff');  // 흰 배경 → 검은색 텍스트
```

### 비동기 키 시퀀스
`flow` 메서드는 Promise를 반환하므로 async/await와 함께 사용할 수 있습니다:

```javascript
async function demo() {
    await kb.flow(['h','e','l','l','o']);
    console.log('첫 번째 시퀀스 완료!');
    
    await kb.flow(['w','o','r','l','d']);
    console.log('모든 시퀀스 완료!');
}

demo();
```

## 🌐 브라우저 지원

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- 모바일 브라우저 (iOS Safari, Chrome Mobile)

## 📦 파일 구조

```
keyboard-js/
├── keyboard.js     # 메인 라이브러리 파일
├── index.html      # 데모 페이지
└── README.md       # 문서
```

## 🤝 기여하기

버그 리포트나 기능 제안은 언제든 환영합니다!

## 📄 라이선스

MIT License - 자유롭게 사용하세요!

## 💡 사용 팁

1. **성능 최적화**: 많은 키를 동시에 조작할 때는 `requestAnimationFrame`을 사용하세요
2. **접근성**: 스크린 리더 사용자를 위해 적절한 ARIA 레이블을 추가하세요
3. **반응형**: 작은 화면에서는 키보드 크기를 조정하는 CSS 미디어 쿼리를 사용하세요

---

**KeyBoard.js**로 더욱 인터랙티브한 웹 경험을 만들어보세요! 🚀

/**
 * KeyBoard.js - 가상 키보드 라이브러리
 * 지정된 div 영역에 표준 키보드 배열을 렌더링합니다.
 */

class KeyBoard {
    constructor(selector, options = {}) {
        this.container = document.querySelector(selector);
        if (!this.container) {
            throw new Error(`선택자 "${selector}"에 해당하는 요소를 찾을 수 없습니다.`);
        }
        
        // 옵션 설정
        this.options = {
            hiddenEscape: options.hiddenEscape || false,
            hiddenFuntion: options.hiddenFuntion || false,
            hiddenArrow: options.hiddenArrow || false
        };
        
        this.keyboardElement = null;
        this.keyElements = new Map(); // 키 이름과 DOM 요소 매핑
        this.eventListeners = new Map(); // 커스텀 이벤트 리스너
        this.keyStates = new Map(); // 키의 초기 상태 및 현재 상태 추적
        
        this.init();
    }
    
    // 키보드 배열 정의
    getKeyboardLayout() {
        return [
            // 첫 번째 줄: Function Keys
            [
                { key: 'ESC', code: 'Escape', width: 1 },
                { key: '', code: '', width: 1, isSpace: true },
                { key: 'F1', code: 'F1', width: 1 },
                { key: 'F2', code: 'F2', width: 1 },
                { key: 'F3', code: 'F3', width: 1 },
                { key: 'F4', code: 'F4', width: 1 },
                { key: '', code: '', width: 0.5, isSpace: true },
                { key: 'F5', code: 'F5', width: 1 },
                { key: 'F6', code: 'F6', width: 1 },
                { key: 'F7', code: 'F7', width: 1 },
                { key: 'F8', code: 'F8', width: 1 },
                { key: '', code: '', width: 0.5, isSpace: true },
                { key: 'F9', code: 'F9', width: 1 },
                { key: 'F10', code: 'F10', width: 1 },
                { key: 'F11', code: 'F11', width: 1 },
                { key: 'F12', code: 'F12', width: 1 }
            ],
            // 두 번째 줄: 숫자 및 특수키
            [
                { key: '`', code: 'Backquote', width: 1 },
                { key: '1', code: 'Digit1', width: 1 },
                { key: '2', code: 'Digit2', width: 1 },
                { key: '3', code: 'Digit3', width: 1 },
                { key: '4', code: 'Digit4', width: 1 },
                { key: '5', code: 'Digit5', width: 1 },
                { key: '6', code: 'Digit6', width: 1 },
                { key: '7', code: 'Digit7', width: 1 },
                { key: '8', code: 'Digit8', width: 1 },
                { key: '9', code: 'Digit9', width: 1 },
                { key: '0', code: 'Digit0', width: 1 },
                { key: '-', code: 'Minus', width: 1 },
                { key: '=', code: 'Equal', width: 1 },
                { key: 'Backspace', code: 'Backspace', width: 2 }
            ],
            // 세 번째 줄: Tab과 QWERTY 상단
            [
                { key: 'Tab', code: 'Tab', width: 1.5 },
                { key: 'Q', code: 'KeyQ', width: 1 },
                { key: 'W', code: 'KeyW', width: 1 },
                { key: 'E', code: 'KeyE', width: 1 },
                { key: 'R', code: 'KeyR', width: 1 },
                { key: 'T', code: 'KeyT', width: 1 },
                { key: 'Y', code: 'KeyY', width: 1 },
                { key: 'U', code: 'KeyU', width: 1 },
                { key: 'I', code: 'KeyI', width: 1 },
                { key: 'O', code: 'KeyO', width: 1 },
                { key: 'P', code: 'KeyP', width: 1 },
                { key: '[', code: 'BracketLeft', width: 1 },
                { key: ']', code: 'BracketRight', width: 1 },
                { key: '\\', code: 'Backslash', width: 1.5 }
            ],
            // 네 번째 줄: Caps Lock과 ASDF
            [
                { key: 'Caps Lock', code: 'CapsLock', width: 1.75 },
                { key: 'A', code: 'KeyA', width: 1 },
                { key: 'S', code: 'KeyS', width: 1 },
                { key: 'D', code: 'KeyD', width: 1 },
                { key: 'F', code: 'KeyF', width: 1 },
                { key: 'G', code: 'KeyG', width: 1 },
                { key: 'H', code: 'KeyH', width: 1 },
                { key: 'J', code: 'KeyJ', width: 1 },
                { key: 'K', code: 'KeyK', width: 1 },
                { key: 'L', code: 'KeyL', width: 1 },
                { key: ';', code: 'Semicolon', width: 1 },
                { key: "'", code: 'Quote', width: 1 },
                { key: 'Enter', code: 'Enter', width: 2.25 }
            ],
            // 다섯 번째 줄: Shift와 ZXCV
            [
                { key: 'Shift', code: 'ShiftLeft', width: 2.25 },
                { key: 'Z', code: 'KeyZ', width: 1 },
                { key: 'X', code: 'KeyX', width: 1 },
                { key: 'C', code: 'KeyC', width: 1 },
                { key: 'V', code: 'KeyV', width: 1 },
                { key: 'B', code: 'KeyB', width: 1 },
                { key: 'N', code: 'KeyN', width: 1 },
                { key: 'M', code: 'KeyM', width: 1 },
                { key: ',', code: 'Comma', width: 1 },
                { key: '.', code: 'Period', width: 1 },
                { key: '/', code: 'Slash', width: 1 },
                { key: 'Shift', code: 'ShiftRight', width: 2.75 }
            ],
            // 여섯 번째 줄: Ctrl, Alt, Space 등
            [
                { key: 'Ctrl', code: 'ControlLeft', width: 1.25 },
                { key: 'Win', code: 'MetaLeft', width: 1.25 },
                { key: 'Alt', code: 'AltLeft', width: 1.25 },
                { key: 'Space', code: 'Space', width: 6.25 },
                { key: 'Alt', code: 'AltRight', width: 1.25 },
                { key: 'Win', code: 'MetaRight', width: 1.25 },
                { key: 'Menu', code: 'ContextMenu', width: 1.25 },
                { key: 'Ctrl', code: 'ControlRight', width: 1.25 }
            ],
            // 방향키 영역 (별도로 배치)
            [
                { key: '↑', code: 'ArrowUp', width: 1, isArrow: true },
                { key: '←', code: 'ArrowLeft', width: 1, isArrow: true },
                { key: '↓', code: 'ArrowDown', width: 1, isArrow: true },
                { key: '→', code: 'ArrowRight', width: 1, isArrow: true }
            ]
        ];
    }
    
    // 키보드 초기화
    init() {
        this.setupContainerStyles();
        this.createKeyboard();
        this.setupStyles();
    }
    
    // 컨테이너에 키보드 렌더링을 위한 필수 스타일 적용
    setupContainerStyles() {
        // 컨테이너에 키보드 렌더링에 필요한 기본 스타일 적용
        const containerStyle = this.container.style;
        
        // 기존 display가 설정되지 않았거나 적절하지 않은 경우에만 설정
        const currentDisplay = window.getComputedStyle(this.container).display;
        if (!currentDisplay || currentDisplay === 'inline' || currentDisplay === 'inline-block') {
            containerStyle.display = 'flex';
        }
        
        // Flexbox 설정 (키보드를 중앙에 배치하기 위해)
        if (currentDisplay === 'flex' || containerStyle.display === 'flex') {
            containerStyle.justifyContent = 'center';
            containerStyle.alignItems = 'center';
        }
        
        // 최소 높이 설정 (키보드가 너무 작아지지 않도록)
        const currentHeight = window.getComputedStyle(this.container).height;
        if (!currentHeight || currentHeight === 'auto' || parseInt(currentHeight) < 150) {
            containerStyle.minHeight = '200px';
        }
        
        // 컨테이너가 inline 요소라면 block으로 변경
        if (currentDisplay === 'inline') {
            containerStyle.display = 'block';
        }
    }
    
    // 키보드 DOM 요소 생성
    createKeyboard() {
        this.keyboardElement = document.createElement('div');
        this.keyboardElement.className = 'keyboard-js';
        
        const layout = this.getKeyboardLayout();
        
        // 메인 키보드 영역
        const mainSection = document.createElement('div');
        mainSection.className = 'keyboard-main';
        
        // 옵션에 따라 행 필터링
        const startRow = this.options.hiddenEscape && this.options.hiddenFuntion ? 1 : 0;
        const endRow = 6;
        
        for (let i = startRow; i < endRow; i++) {
            // ESC 키만 숨기는 경우 (펑션키는 보임)
            if (i === 0 && this.options.hiddenEscape && !this.options.hiddenFuntion) {
                const filteredRow = layout[i].filter(key => key.code !== 'Escape');
                if (filteredRow.length > 0) {
                    const row = this.createRow(filteredRow, i);
                    mainSection.appendChild(row);
                }
            }
            // 전체 첫 번째 행 숨기기 (ESC + 펑션키)
            else if (i === 0 && this.options.hiddenEscape && this.options.hiddenFuntion) {
                continue;
            }
            // 일반적인 경우
            else {
                const row = this.createRow(layout[i], i);
                mainSection.appendChild(row);
            }
        }
        
        this.keyboardElement.appendChild(mainSection);
        
        // 방향키 영역 (옵션에 따라 숨김)
        if (!this.options.hiddenArrow) {
            const arrowSection = document.createElement('div');
            arrowSection.className = 'keyboard-arrows';
            
            const arrowKeys = layout[6];
            const arrowContainer = document.createElement('div');
            arrowContainer.className = 'arrow-container';
            
            // 방향키 배치 (십자형)
            const upKey = this.createKey(arrowKeys[0]);
            const leftKey = this.createKey(arrowKeys[1]);
            const downKey = this.createKey(arrowKeys[2]);
            const rightKey = this.createKey(arrowKeys[3]);
            
            const arrowRow1 = document.createElement('div');
            arrowRow1.className = 'arrow-row';
            arrowRow1.appendChild(upKey);
            
            const arrowRow2 = document.createElement('div');
            arrowRow2.className = 'arrow-row';
            arrowRow2.appendChild(leftKey);
            arrowRow2.appendChild(downKey);
            arrowRow2.appendChild(rightKey);
            
            arrowContainer.appendChild(arrowRow1);
            arrowContainer.appendChild(arrowRow2);
            arrowSection.appendChild(arrowContainer);
            
            this.keyboardElement.appendChild(arrowSection);
        }
        
        this.container.appendChild(this.keyboardElement);
        
        // 반응형 크기 조정
        this.adjustKeyboardSize();
        
        // 윈도우 리사이즈 이벤트 리스너 추가
        this.resizeHandler = () => this.adjustKeyboardSize();
        window.addEventListener('resize', this.resizeHandler);
    }
    
    // 키보드 행 생성
    createRow(keys, rowIndex) {
        const row = document.createElement('div');
        row.className = `keyboard-row row-${rowIndex}`;
        
        keys.forEach(keyData => {
            if (keyData.isSpace) {
                const spacer = document.createElement('div');
                spacer.className = 'key-spacer';
                spacer.dataset.width = keyData.width; // 너비 비율 저장
                row.appendChild(spacer);
            } else {
                const keyElement = this.createKey(keyData);
                row.appendChild(keyElement);
            }
        });
        
        return row;
    }
    
    // 개별 키 생성
    createKey(keyData) {
        const key = document.createElement('div');
        key.className = 'keyboard-key';
        key.textContent = keyData.key;
        key.dataset.code = keyData.code;
        key.dataset.key = keyData.key.toLowerCase();
        key.dataset.width = keyData.width; // 너비 비율 저장
        
        // 특별한 키들에 대한 클래스 추가
        if (keyData.key.length > 1) {
            key.classList.add('special-key');
        }
        if (keyData.isArrow) {
            key.classList.add('arrow-key');
        }
        
        // 마우스 이벤트 리스너 추가
        key.addEventListener('mousedown', (e) => {
            const keyName = keyData.key.toLowerCase();
            const keyState = this.keyStates.get(keyName);
            
            if (keyState) {
                // 이미 프로그래매틱으로 누른 상태는 마우스로 누를 수 없음
                if (keyState.programmaticPress) {
                    return;
                }
                
                // 이미 누른 상태는 중복 이벤트 발생시키지 않음
                if (keyState.isPressed) {
                    return;
                }
                
                key.classList.add('pressed');
                keyState.isPressed = true;
                this.triggerCustomEvent('press', keyName, key);
            }
        });
        
        key.addEventListener('mouseup', (e) => {
            const keyName = keyData.key.toLowerCase();
            const keyState = this.keyStates.get(keyName);
            
            if (keyState) {
                // 프로그래매틱으로 누른 상태는 마우스로 뗈 수 없음
                if (keyState.programmaticPress) {
                    return;
                }
                
                // 누른 상태가 아니면 unpress 이벤트 발생시키지 않음
                if (!keyState.isPressed) {
                    return;
                }
                
                key.classList.remove('pressed');
                keyState.isPressed = false;
                this.triggerCustomEvent('unpress', keyName, key);
            }
        });
        
        key.addEventListener('mouseleave', (e) => {
            const keyName = keyData.key.toLowerCase();
            const keyState = this.keyStates.get(keyName);
            
            if (keyState) {
                // 프로그래매틱으로 누른 상태는 마우스로 뗈 수 없음
                if (keyState.programmaticPress) {
                    return;
                }
                
                // 누른 상태가 아니면 unpress 이벤트 발생시키지 않음
                if (!keyState.isPressed) {
                    return;
                }
                
                key.classList.remove('pressed');
                keyState.isPressed = false;
                this.triggerCustomEvent('unpress', keyName, key);
            }
        });
        
        // 키 요소를 맵에 저장 (대소문자 구분 없이)
        this.keyElements.set(keyData.key.toLowerCase(), key);
        this.keyElements.set(keyData.code.toLowerCase(), key);
        
        // 키의 초기 상태 저장 (기본값 사용)
        const keyName = keyData.key.toLowerCase();
        
        this.keyStates.set(keyName, {
            visible: true,
            originalBackgroundColor: '', // 기본값 사용
            originalColor: '',
            originalBorder: 'none', // 기본적으로 border 없음
            originalBoxShadow: 'none', // 기본적으로 shadow 없음
            originalDisplay: 'flex',
            isMarked: false,
            isPressed: false, // 현재 누름 상태
            programmaticPress: false, // 프로그래매틱으로 누른 상태
            tooltip: {
                content: null,
                position: 'relative',
                trigger: 'hover',
                element: null,
                isActive: false
            }
        });
        
        return key;
    }
    
    // 스타일 설정
    setupStyles() {
        if (!document.getElementById('keyboard-js-styles')) {
            const style = document.createElement('style');
            style.id = 'keyboard-js-styles';
            style.textContent = this.getCSS();
            document.head.appendChild(style);
        }
    }
    
    // 반응형 키보드 크기 조정 (다양한 패널 크기 대응 개선)
    adjustKeyboardSize() {
        if (!this.keyboardElement) return;
        
        const containerWidth = this.container.clientWidth;
        const containerHeight = this.container.clientHeight;
        
        // 컨테이너 크기에 따른 적응형 패딩 계산
        const minPadding = 8;
        const maxPadding = 24;
        const horizontalPadding = Math.max(minPadding, Math.min(maxPadding, containerWidth * 0.05));
        const verticalPadding = Math.max(minPadding, Math.min(maxPadding, containerHeight * 0.05));
        
        // 컨테이너 크기에 따른 적응형 키 간격
        const keyGap = Math.max(2, Math.min(6, Math.min(containerWidth, containerHeight) * 0.01));
        
        // 사용 가능한 영역
        const availableWidth = containerWidth - (horizontalPadding * 2);
        const availableHeight = containerHeight - (verticalPadding * 2);
        
        // 키보드 레이아웃 정보
        const maxRowWidth = 15; // 가장 긴 행의 총 단위
        const totalRows = 6;     // 총 행 개수
        const horizontalGaps = 13; // 키 사이 가로 간격 개수
        const verticalGaps = 5;    // 행 사이 세로 간격 개수
        
        // 가로 기준 키 크기 계산
        const keySizeByWidth = (availableWidth - (horizontalGaps * keyGap)) / maxRowWidth;
        
        // 세로 기준 키 크기 계산 
        const keySizeByHeight = (availableHeight - (verticalGaps * keyGap)) / totalRows;
        
        // 컨테이너 비율에 따른 크기 결정 로직 개선
        const containerRatio = containerWidth / containerHeight;
        const keyboardRatio = 15 / 6; // 키보드의 기본 가로세로 비율
        
        let finalKeySize;
        
        if (containerRatio > keyboardRatio * 1.5) {
            // 매우 가로가 긴 컨테이너 (배너 스타일) - 세로 기준으로 맞춤
            finalKeySize = Math.max(8, keySizeByHeight);
        } else if (containerRatio < keyboardRatio / 2) {
            // 매우 세로가 긴 컨테이너 (타워 스타일) - 가로 기준으로 맞춤
            finalKeySize = Math.max(8, keySizeByWidth);
        } else {
            // 일반적인 비율 - 더 제한적인 쪽에 맞춤
            finalKeySize = Math.max(8, Math.min(keySizeByWidth, keySizeByHeight));
        }
        
        // 매우 작은 컨테이너에서의 최소 크기 보장
        if (containerWidth < 150 || containerHeight < 100) {
            finalKeySize = Math.max(6, finalKeySize);
        }
        
        // 최대 크기 제한 (컨테이너 크기에 비례)
        const maxKeySize = Math.min(80, Math.max(containerWidth, containerHeight) * 0.15);
        finalKeySize = Math.min(finalKeySize, maxKeySize);
        
        // CSS 변수로 키 크기 설정
        this.keyboardElement.style.setProperty('--key-size', `${finalKeySize}px`);
        this.keyboardElement.style.setProperty('--key-gap', `${keyGap}px`);
        
        // 키보드 전체 스케일링 (매우 작은 컨테이너에서)
        let scaleX = 1;
        let scaleY = 1;
        
        const keyboardWidth = maxRowWidth * finalKeySize + horizontalGaps * keyGap;
        const keyboardHeight = totalRows * finalKeySize + verticalGaps * keyGap;
        
        if (keyboardWidth > availableWidth) {
            scaleX = availableWidth / keyboardWidth;
        }
        if (keyboardHeight > availableHeight) {
            scaleY = availableHeight / keyboardHeight;
        }
        
        const finalScale = Math.min(scaleX, scaleY);
        if (finalScale < 1) {
            this.keyboardElement.style.transform = `scale(${finalScale})`;
            this.keyboardElement.style.transformOrigin = 'center center';
        } else {
            this.keyboardElement.style.transform = 'none';
        }
        
        // 각 키의 크기 동적 조정
        this.keyElements.forEach(keyElement => {
            const width = parseFloat(keyElement.dataset.width) || 1;
            keyElement.style.width = `${width * finalKeySize}px`;
            keyElement.style.height = `${finalKeySize}px`;
            
            // 매우 작은 키에서 폰트 크기 조정
            if (finalKeySize < 15) {
                keyElement.style.fontSize = `${Math.max(8, finalKeySize * 0.6)}px`;
            } else {
                keyElement.style.fontSize = '';
            }
        });
        
        // 스페이서 크기 조정
        const spacers = this.keyboardElement.querySelectorAll('.key-spacer');
        spacers.forEach(spacer => {
            const width = parseFloat(spacer.dataset.width) || 1;
            spacer.style.width = `${width * finalKeySize}px`;
            spacer.style.height = `${finalKeySize}px`;
        });
        
        // 디버그 정보 (개발용)
        console.log(`KeyBoard Size Debug:`, {
            containerWidth,
            containerHeight,
            containerRatio: containerRatio.toFixed(2),
            keyboardRatio: keyboardRatio.toFixed(2),
            keySizeByWidth: Math.round(keySizeByWidth),
            keySizeByHeight: Math.round(keySizeByHeight),
            finalKeySize: Math.round(finalKeySize),
            finalScale: finalScale.toFixed(2)
        });
    }
    
    // CSS 스타일 반환
    getCSS() {
        return `
            .keyboard-js {
                display: flex;
                flex-direction: column;
                gap: var(--key-gap, 4px);
                padding: 16px;
                background: #f0f0f0;
                border-radius: 8px;
                font-family: Arial, sans-serif;
                user-select: none;
                width: 100%;
                max-width: 100%;
                margin: 0 auto;
                box-sizing: border-box;
                overflow: hidden;
            }
            
            .keyboard-main {
                display: flex;
                flex-direction: column;
                gap: var(--key-gap, 4px);
            }
            
            .keyboard-row {
                display: flex;
                gap: var(--key-gap, 4px);
                justify-content: center;
            }
            
            .keyboard-key {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: var(--key-size, 40px);
                background: #ffffff;
                border: 1px solid #d0d0d0;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.1s ease;
                font-size: calc(var(--key-size, 40px) * 0.3);
                font-weight: 500;
                color: #333;
                box-shadow: 0 2px 0 0 #d0d0d0;
                box-sizing: border-box;
                flex-shrink: 0;
            }
            
            .keyboard-key:hover {
                background: #f8f8f8;
                border-color: #b0b0b0;
            }
            
            .keyboard-key:active,
            .keyboard-key.pressed {
                transform: translateY(2px);
                box-shadow: 0 0 0 0 #d0d0d0;
                background: #e8e8e8;
            }
            
            .keyboard-key.special-key {
                font-size: calc(var(--key-size, 40px) * 0.25);
                background: #f5f5f5;
            }
            
            .keyboard-arrows {
                display: flex;
                justify-content: center;
                margin-top: 8px;
            }
            
            .arrow-container {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            
            .arrow-row {
                display: flex;
                gap: 2px;
                justify-content: center;
            }
            
            .arrow-key {
                font-size: calc(var(--key-size, 40px) * 0.35);
                font-weight: bold;
            }
            
            .key-spacer {
                flex-shrink: 0;
            }
            
            /* 키 애니메이션 */
            @keyframes keyPress {
                0% { transform: translateY(0); }
                50% { transform: translateY(2px); }
                100% { transform: translateY(0); }
            }
            
            .keyboard-key.animate-press {
                animation: keyPress 0.15s ease;
            }
            
            /* 반응형 디자인 */
            @media (max-width: 768px) {
                .keyboard-js {
                    padding: 8px;
                }
            }
            
            @media (max-width: 480px) {
                .keyboard-js {
                    padding: 4px;
                }
                
                .keyboard-key.special-key {
                    font-size: calc(var(--key-size, 40px) * 0.2);
                }
            }
            
            /* 툴팁 스타일 */
            .keyboard-tooltip {
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                font-size: 14px;
                line-height: 1.5;
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
                z-index: 9999;
                min-width: 120px;
                max-width: 300px;
                word-wrap: break-word;
                word-break: break-word;
                white-space: pre-wrap;
                animation: tooltipFadeIn 0.2s ease;
                pointer-events: auto;
            }
            
            .tooltip-relative {
                position: fixed;
                z-index: 9999;
                pointer-events: auto;
                padding-top: 36px !important; /* X 버튼 공간 확보 */
                padding-left: 16px !important;
                padding-right: 16px !important;
                padding-bottom: 12px !important;
            }
            
            .tooltip-relative::after {
                content: '';
                position: absolute;
                bottom: -8px;
                left: 50%;
                transform: translateX(-50%);
                border: 8px solid transparent;
                border-top-color: rgba(0, 0, 0, 0.9);
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
            }
            
            .tooltip-below::after {
                content: '';
                position: absolute;
                top: -8px;
                left: 50%;
                transform: translateX(-50%);
                border: 8px solid transparent;
                border-bottom-color: rgba(0, 0, 0, 0.9);
                filter: drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.1));
            }
            
            .tooltip-center {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border: 2px solid #007bff;
                background: rgba(255, 255, 255, 0.98);
                color: #333;
                backdrop-filter: blur(8px);
                z-index: 10000;
                min-width: 200px;
                max-width: 400px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                padding: 36px 20px 20px 20px; /* 상단 여백 충분히 확보 */
            }
            
            .tooltip-close {
                position: absolute;
                top: 8px;
                right: 8px;
                width: 20px;
                height: 20px;
                border: none;
                border-radius: 4px;
                background: rgba(0, 0, 0, 0.1);
                color: rgba(0, 0, 0, 0.6);
                font-size: 16px;
                font-weight: 300;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                line-height: 1;
                transition: all 0.15s ease;
                z-index: 10001;
                opacity: 0.7;
            }
            
            .tooltip-close:hover {
                background: rgba(0, 0, 0, 0.15);
                color: rgba(0, 0, 0, 0.8);
                opacity: 1;
                transform: none;
            }
            
            .tooltip-close:active {
                background: rgba(0, 0, 0, 0.2);
                transform: scale(0.95);
            }
            
            /* 다크 테마 툴팁용 닫기 버튼 (relative 툴팁) */
            .tooltip-relative .tooltip-close {
                background: rgba(255, 255, 255, 0.2);
                color: rgba(255, 255, 255, 0.8);
            }
            
            .tooltip-relative .tooltip-close:hover {
                background: rgba(255, 255, 255, 0.3);
                color: rgba(255, 255, 255, 1);
            }
            
            .tooltip-relative .tooltip-close:active {
                background: rgba(255, 255, 255, 0.4);
            }
            
            @keyframes tooltipFadeIn {
                from {
                    opacity: 0;
                    transform: scale(0.9) translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            .tooltip-center {
                animation: tooltipFadeInCenter 0.2s ease;
            }
            
            @keyframes tooltipFadeInCenter {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            
            /* 스크롤 시 툴팁 위치 조정 */
            @media (max-width: 768px) {
                .keyboard-tooltip {
                    font-size: 13px;
                    padding: 10px 14px;
                    min-width: 100px;
                    max-width: 250px;
                }
                
                .tooltip-close {
                    width: 22px;
                    height: 22px;
                    font-size: 13px;
                    top: -8px;
                    right: -8px;
                }
            }
        `;
    }
    
    // 키에 색상 적용 (고도화)
    mark(keys, options = {}) {
        // 기본 옵션 설정
        const defaultOptions = {
            backgroundColor: '#ff6b6b',
            color: null, // null이면 자동 대비색 사용
            borderColor: null, // 테두리 색상
            shadowColor: null  // 그림자 색상
        };
        
        const finalOptions = { ...defaultOptions, ...options };
        
        // 단일 키 또는 배열 처리
        const keyArray = Array.isArray(keys) ? keys : [keys];
        
        keyArray.forEach(key => {
            const keyElement = this.getKeyElement(key);
            const keyName = key.toLowerCase();
            const keyState = this.keyStates.get(keyName);
            
            if (keyElement && keyState) {
                // 처음 마킹할 때만 원래 스타일 저장
                if (!keyState.isMarked) {
                    keyState.originalBackgroundColor = keyElement.style.backgroundColor || '';
                    keyState.originalColor = keyElement.style.color || '';
                    keyState.originalBorder = keyElement.style.border || '';
                    keyState.originalBoxShadow = keyElement.style.boxShadow || '';
                    keyState.isMarked = true;
                }
                
                // 배경색 적용
                keyElement.style.backgroundColor = finalOptions.backgroundColor;
                
                // 글씨색 적용 (지정되지 않으면 자동 대비색)
                if (finalOptions.color) {
                    keyElement.style.color = finalOptions.color;
                } else {
                    keyElement.style.color = this.getContrastColor(finalOptions.backgroundColor);
                }
                
                // 테두리 색상 적용
                if (finalOptions.borderColor) {
                    keyElement.style.border = `2px solid ${finalOptions.borderColor}`;
                }
                
                // 그림자 색상 적용
                if (finalOptions.shadowColor) {
                    keyElement.style.boxShadow = `0 4px 12px ${finalOptions.shadowColor}, 0 2px 4px ${finalOptions.shadowColor}40`;
                }
            }
        });
    }
    
    // 키 클릭 효과 (누르고 땐는 전체 동작)
    click(keys, options = {}) {
        // 기본 옵션 설정
        const defaultOptions = {
            pressDelay: 200,
            triggerEvent: true // click은 기본적으로 이벤트 발생
        };
        
        const finalOptions = { ...defaultOptions, ...options };
        
        // 단일 키 또는 배열 처리
        const keyArray = Array.isArray(keys) ? keys : [keys];
        
        keyArray.forEach(key => {
            const keyElement = this.getKeyElement(key);
            const keyName = key.toLowerCase();
            const keyState = this.keyStates.get(keyName);
            
            if (keyElement && keyState) {
                keyElement.classList.add('pressed');
                keyState.isPressed = true;
                
                // 커스텀 이벤트 발생
                if (finalOptions.triggerEvent) {
                    this.triggerCustomEvent('press', key, keyElement);
                }
                
                setTimeout(() => {
                    keyElement.classList.remove('pressed');
                    keyState.isPressed = false;
                    
                    // 커스홀 이벤트 발생
                    if (finalOptions.triggerEvent) {
                        this.triggerCustomEvent('unpress', key, keyElement);
                    }
                }, finalOptions.pressDelay);
            }
        });
    }
    
    // 키 누르기 (누른 상태로 유지)
    press(keys, options = {}) {
        // 기본 옵션 설정
        const defaultOptions = {
            triggerEvent: false
        };
        
        const finalOptions = { ...defaultOptions, ...options };
        
        // 단일 키 또는 배열 처리
        const keyArray = Array.isArray(keys) ? keys : [keys];
        
        keyArray.forEach(key => {
            const keyElement = this.getKeyElement(key);
            const keyName = key.toLowerCase();
            const keyState = this.keyStates.get(keyName);
            
            if (keyElement && keyState) {
                // 이미 누른 상태면 아무것도 안함
                if (keyState.isPressed) {
                    return;
                }
                
                keyElement.classList.add('pressed');
                keyState.isPressed = true;
                keyState.programmaticPress = true; // 프로그래매틱으로 눈름
                
                // 커스텀 이벤트 발생
                if (finalOptions.triggerEvent) {
                    this.triggerCustomEvent('press', key, keyElement);
                }
            }
        });
    }
    
    // 키 띴기 (누른 상태에서 땄 상태로)
    unpress(keys, options = {}) {
        // 기본 옵션 설정
        const defaultOptions = {
            triggerEvent: false
        };
        
        const finalOptions = { ...defaultOptions, ...options };
        
        // 단일 키 또는 배열 처리
        const keyArray = Array.isArray(keys) ? keys : [keys];
        
        keyArray.forEach(key => {
            const keyElement = this.getKeyElement(key);
            const keyName = key.toLowerCase();
            const keyState = this.keyStates.get(keyName);
            
            if (keyElement && keyState) {
                // 이미 됸 상태면 아무것도 안함
                if (!keyState.isPressed) {
                    return;
                }
                
                keyElement.classList.remove('pressed');
                keyState.isPressed = false;
                keyState.programmaticPress = false; // 프로그래매틱 상태 해제
                
                // 커스텀 이벤트 발생
                if (finalOptions.triggerEvent) {
                    this.triggerCustomEvent('unpress', key, keyElement);
                }
            }
        });
    }
    
    // 키 시퀀스 효과 (고도화)
    async flow(keys, options = {}) {
        // 기본 옵션 설정
        const defaultOptions = {
            delay: 300,
            pressDelay: 200,
            triggerEvent: false // 커스텀 이벤트 발생 여부
        };
        
        const finalOptions = { ...defaultOptions, ...options };
        
        for (let i = 0; i < keys.length; i++) {
            this.click(keys[i], {
                pressDelay: finalOptions.pressDelay,
                triggerEvent: finalOptions.triggerEvent
            });
            if (i < keys.length - 1) {
                await this.sleep(finalOptions.delay);
            }
        }
    }
    
    // 커스텀 이벤트 리스너 등록 (키 누름)
    onpress(keyOrCallback, callback) {
        // 전역 리스너: onpress(callback) - 모든 키에 적용
        if (typeof keyOrCallback === 'function' && callback === undefined) {
            if (!this.eventListeners.has('*')) {
                this.eventListeners.set('*', { press: [], unpress: [] });
            }
            this.eventListeners.get('*').press.push(keyOrCallback);
            return;
        }
        
        // 특정 키 리스너: onpress(key, callback) 또는 onpress([keys], callback)
        const keys = Array.isArray(keyOrCallback) ? keyOrCallback : [keyOrCallback];
        
        keys.forEach(key => {
            const keyName = key.toLowerCase();
            if (!this.eventListeners.has(keyName)) {
                this.eventListeners.set(keyName, { press: [], unpress: [] });
            }
            this.eventListeners.get(keyName).press.push(callback);
        });
    }
    
    // 커스텀 이벤트 리스너 등록 (키 뗄)
    onunpress(keyOrCallback, callback) {
        // 전역 리스너: onunpress(callback) - 모든 키에 적용
        if (typeof keyOrCallback === 'function' && callback === undefined) {
            if (!this.eventListeners.has('*')) {
                this.eventListeners.set('*', { press: [], unpress: [] });
            }
            this.eventListeners.get('*').unpress.push(keyOrCallback);
            return;
        }
        
        // 특정 키 리스너: onunpress(key, callback) 또는 onunpress([keys], callback)
        const keys = Array.isArray(keyOrCallback) ? keyOrCallback : [keyOrCallback];
        
        keys.forEach(key => {
            const keyName = key.toLowerCase();
            if (!this.eventListeners.has(keyName)) {
                this.eventListeners.set(keyName, { press: [], unpress: [] });
            }
            this.eventListeners.get(keyName).unpress.push(callback);
        });
    }
    
    // 커스텀 이벤트 발생
    triggerCustomEvent(eventType, key, element) {
        const keyName = key.toLowerCase();
        
        // 특정 키 리스너 호출
        const listeners = this.eventListeners.get(keyName);
        if (listeners && listeners[eventType]) {
            listeners[eventType].forEach(callback => {
                try {
                    callback(key, element);
                } catch (error) {
                    console.error(`KeyBoard.js 이벤트 오류 (${eventType}):`, error);
                }
            });
        }
        
        // 전역 리스너 호출 ('*')
        const globalListeners = this.eventListeners.get('*');
        if (globalListeners && globalListeners[eventType]) {
            globalListeners[eventType].forEach(callback => {
                try {
                    callback(key, element);
                } catch (error) {
                    console.error(`KeyBoard.js 전역 이벤트 오류 (${eventType}):`, error);
                }
            });
        }
    }
    
    // 키 요소 찾기
    getKeyElement(key) {
        const keyName = key.toLowerCase();
        return this.keyElements.get(keyName);
    }
    
    // Sleep 유틸리티
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // 대비색 계산
    getContrastColor(hexColor) {
        // hex 색상을 RGB로 변환
        const r = parseInt(hexColor.substr(1, 2), 16);
        const g = parseInt(hexColor.substr(3, 2), 16);
        const b = parseInt(hexColor.substr(5, 2), 16);
        
        // 명도 계산
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        
        return brightness > 128 ? '#000000' : '#ffffff';
    }
    
    // 마킹 제거 (특정 키 또는 모든 키)
    clearMarks(keys = null) {
        if (keys === null) {
            // 모든 키의 마킹 제거
            this.keyElements.forEach((keyElement, keyName) => {
                this.clearSingleKeyMark(keyElement, keyName);
            });
        } else {
            // 특정 키들의 마킹 제거
            const keyArray = Array.isArray(keys) ? keys : [keys];
            keyArray.forEach(key => {
                const keyElement = this.getKeyElement(key);
                const keyName = key.toLowerCase();
                if (keyElement) {
                    this.clearSingleKeyMark(keyElement, keyName);
                }
            });
        }
    }
    
    // 단일 키 마킹 제거 헬퍼 메서드
    clearSingleKeyMark(keyElement, keyName) {
        const keyState = this.keyStates.get(keyName);
        
        if (keyElement && keyState) {
            // mark 관련 모든 스타일 제거
            keyElement.style.backgroundColor = keyState.originalBackgroundColor;
            keyElement.style.color = keyState.originalColor;
            
            // border 완전 제거
            keyElement.style.border = '';
            keyElement.style.removeProperty('border');
            
            // box-shadow 완전 제거
            keyElement.style.boxShadow = '';
            keyElement.style.removeProperty('box-shadow');
            
            // 마킹 상태 초기화 (툴팁이나 숨김 상태는 유지)
            keyState.isMarked = false;
            keyState.originalBackgroundColor = '';
            keyState.originalColor = '';
            keyState.originalBorder = 'none';
            keyState.originalBoxShadow = 'none';
        }
    }
    
    // 키 숨기기 (레이아웃 보존하면서 숨김)
    hide(keys) {
        // 단일 키 또는 배열 처리
        const keyArray = Array.isArray(keys) ? keys : [keys];
        
        keyArray.forEach(key => {
            const keyElement = this.getKeyElement(key);
            const keyName = key.toLowerCase();
            const keyState = this.keyStates.get(keyName);
            
            if (keyElement && keyState) {
                // visibility: hidden을 사용하여 자리는 유지하면서 숨김
                keyElement.style.visibility = 'hidden';
                keyElement.style.opacity = '0';
                keyElement.style.pointerEvents = 'none'; // 클릭 이벤트도 비활성화
                keyState.visible = false;
            }
        });
    }
    
    // 숨긴 키 보이기
    show(keys) {
        // 단일 키 또는 배열 처리
        const keyArray = Array.isArray(keys) ? keys : [keys];
        
        keyArray.forEach(key => {
            const keyElement = this.getKeyElement(key);
            const keyName = key.toLowerCase();
            const keyState = this.keyStates.get(keyName);
            
            if (keyElement && keyState) {
                // visibility 및 opacity 복구
                keyElement.style.visibility = 'visible';
                keyElement.style.opacity = '1';
                keyElement.style.pointerEvents = 'auto'; // 클릭 이벤트 다시 활성화
                keyState.visible = true;
            }
        });
    }
    
    // 키를 원래 상태로 복구 (mark 및 hide 해제)
    // 인자가 없으면 전체 키, 있으면 지정된 키만 초기화
    reset(keys) {
        if (keys === undefined) {
            // 인자가 없으면 전체 키 초기화
            this.keyElements.forEach((keyElement, keyName) => {
                this.resetSingleKey(keyElement, keyName);
            });
        } else {
            // 인자가 있으면 지정된 키만 초기화
            const keyArray = Array.isArray(keys) ? keys : [keys];
            
            keyArray.forEach(key => {
                const keyElement = this.getKeyElement(key);
                const keyName = key.toLowerCase();
                
                if (keyElement) {
                    this.resetSingleKey(keyElement, keyName);
                }
            });
        }
    }
    
    // 단일 키 초기화 헬퍼 메서드
    resetSingleKey(keyElement, keyName) {
        const keyState = this.keyStates.get(keyName);
        
        if (keyElement && keyState) {
            // 색상 복구
            keyElement.style.backgroundColor = keyState.originalBackgroundColor;
            keyElement.style.color = keyState.originalColor;
            
            // 테두리 완전 제거
            keyElement.style.border = '';
            keyElement.style.removeProperty('border');
            
            // 그림자 완전 제거
            keyElement.style.boxShadow = '';
            keyElement.style.removeProperty('box-shadow');
            
            // 보이기/숨김 복구 (새로운 visibility 방식에 맞게)
            keyElement.style.visibility = 'visible';
            keyElement.style.opacity = '1';
            keyElement.style.pointerEvents = 'auto';
            
            // pressed 상태 해제 (시각적 + 내부 상태)
            keyElement.classList.remove('pressed');
            
            // 툴팁 제거
            this.hideTooltip(keyName);
            
            // 상태 초기화
            keyState.visible = true;
            keyState.isMarked = false;
            keyState.isPressed = false; // pressed 상태 초기화
            keyState.programmaticPress = false; // 프로그래매틱 상태 초기화
            keyState.originalBackgroundColor = '';
            keyState.originalColor = '';
            keyState.originalBorder = 'none';
            keyState.originalBoxShadow = 'none';
            keyState.tooltip.content = null;
            keyState.tooltip.isActive = false;
        }
    }
    
    // 키 숨기기 (레이아웃 보존하면서 숨김)
    hide(keys) {
        // 단일 키 또는 배열 처리
        const keyArray = Array.isArray(keys) ? keys : [keys];
        
        keyArray.forEach(key => {
            const keyElement = this.getKeyElement(key);
            const keyName = key.toLowerCase();
            const keyState = this.keyStates.get(keyName);
            
            if (keyElement && keyState) {
                // visibility: hidden을 사용하여 자리는 유지하면서 숨김
                keyElement.style.visibility = 'hidden';
                keyElement.style.opacity = '0';
                keyElement.style.pointerEvents = 'none'; // 클릭 이벤트도 비활성화
                keyState.visible = false;
            }
        });
    }
    
    // 숨긴 키 보이기
    show(keys) {
        // 단일 키 또는 배열 처리
        const keyArray = Array.isArray(keys) ? keys : [keys];
        
        keyArray.forEach(key => {
            const keyElement = this.getKeyElement(key);
            const keyName = key.toLowerCase();
            const keyState = this.keyStates.get(keyName);
            
            if (keyElement && keyState) {
                // visibility 및 opacity 복구
                keyElement.style.visibility = 'visible';
                keyElement.style.opacity = '1';
                keyElement.style.pointerEvents = 'auto'; // 클릭 이벤트 다시 활성화
                keyState.visible = true;
            }
        });
    }
    
    // 툴팁 설정 메서드
    tooltip(keys, options = {}, htmlContent = '') {
        // 기본 옵션 설정
        const defaultOptions = {
            position: 'relative', // 'center' 또는 'relative'
            on: 'hover' // 'hover', 'click', 'press'
        };
        
        const finalOptions = { ...defaultOptions, ...options };
        
        // 단일 키 또는 배열 처리
        const keyArray = Array.isArray(keys) ? keys : [keys];
        
        keyArray.forEach(key => {
            const keyElement = this.getKeyElement(key);
            const keyName = key.toLowerCase();
            const keyState = this.keyStates.get(keyName);
            
            if (keyElement && keyState) {
                // 툴팁 상태 업데이트
                keyState.tooltip.content = htmlContent;
                keyState.tooltip.position = finalOptions.position;
                keyState.tooltip.trigger = finalOptions.on;
                
                // 기존 이벤트 리스너 제거 및 새로운 요소 반환
                const newKeyElement = this.removeTooltipListeners(keyElement, keyName);
                
                // 새로운 이벤트 리스너 추가 (새로운 요소에)
                this.addTooltipListeners(newKeyElement, keyName, finalOptions.on);
            }
        });
    }
    
    // 툴팁 이벤트 리스너 추가
    addTooltipListeners(keyElement, keyName, trigger) {
        const keyState = this.keyStates.get(keyName);
        if (!keyState) return;
        
        switch (trigger) {
            case 'hover':
                keyElement.addEventListener('mouseenter', () => this.showTooltip(keyName));
                keyElement.addEventListener('mouseleave', () => this.hideTooltip(keyName));
                break;
                
            case 'click':
                keyElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (keyState.tooltip.isActive) {
                        this.hideTooltip(keyName);
                    } else {
                        this.showTooltip(keyName);
                    }
                });
                break;
                
            case 'press':
                keyElement.addEventListener('mousedown', () => this.showTooltip(keyName));
                keyElement.addEventListener('mouseup', () => this.hideTooltip(keyName));
                keyElement.addEventListener('mouseleave', () => this.hideTooltip(keyName));
                break;
        }
    }
    
    // 툴팁 이벤트 리스너 제거
    removeTooltipListeners(keyElement, keyName) {
        // 기존 툴팁 숨기기
        this.hideTooltip(keyName);
        
        // 새로운 요소로 교체하여 모든 이벤트 리스너 제거
        const newElement = keyElement.cloneNode(true);
        keyElement.parentNode.replaceChild(newElement, keyElement);
        
        // 맵 업데이트 (key와 code 둘 다 업데이트)
        this.keyElements.set(keyName, newElement);
        if (keyElement.dataset.code) {
            this.keyElements.set(keyElement.dataset.code.toLowerCase(), newElement);
        }
        
        // 기본 마우스 이벤트 리스너 다시 추가
        newElement.addEventListener('mousedown', (e) => {
            this.triggerCustomEvent('press', keyName, newElement);
        });
        
        newElement.addEventListener('mouseup', (e) => {
            this.triggerCustomEvent('unpress', keyName, newElement);
        });
        
        newElement.addEventListener('mouseleave', (e) => {
            this.triggerCustomEvent('unpress', keyName, newElement);
        });
        
        return newElement;
    }
    
    // 툴팁 표시
    showTooltip(keyName) {
        const keyElement = this.getKeyElement(keyName);
        const keyState = this.keyStates.get(keyName);
        
        if (!keyElement || !keyState || !keyState.tooltip.content) return;
        
        // 기존 툴팁이 있다면 제거
        this.hideTooltip(keyName);
        
        // 툴팁 요소 생성
        const tooltip = document.createElement('div');
        tooltip.className = 'keyboard-tooltip';
        tooltip.innerHTML = keyState.tooltip.content;
        
        // 위치 설정
        if (keyState.tooltip.position === 'center') {
            tooltip.classList.add('tooltip-center');
            document.body.appendChild(tooltip);
        } else {
            tooltip.classList.add('tooltip-relative');
            document.body.appendChild(tooltip);
            
            // 키 요소의 절대 위치 계산
            const keyRect = keyElement.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            // 툴팁이 키 위에 오도록 위치 설정
            let left = keyRect.left + keyRect.width / 2 - tooltipRect.width / 2;
            let top = keyRect.top - tooltipRect.height - 12; // 12px 간격
            
            // 화면 가장자리 처리
            const padding = 10;
            if (left < padding) {
                left = padding;
            } else if (left + tooltipRect.width > window.innerWidth - padding) {
                left = window.innerWidth - tooltipRect.width - padding;
            }
            
            if (top < padding) {
                // 위치가 화면 위로 나가면 키 아래에 표시
                top = keyRect.bottom + 8;
                tooltip.classList.add('tooltip-below');
            }
            
            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
        }
        
        // 클릭 모드에서 닫기 버튼 추가
        if (keyState.tooltip.trigger === 'click') {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'tooltip-close';
            closeBtn.innerHTML = '×';
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.hideTooltip(keyName);
            });
            tooltip.appendChild(closeBtn);
        }
        
        // 상태 업데이트
        keyState.tooltip.element = tooltip;
        keyState.tooltip.isActive = true;
        
        // 클릭 모드에서 외부 클릭 리스너 추가
        if (keyState.tooltip.trigger === 'click') {
            setTimeout(() => {
                document.addEventListener('click', (e) => this.handleOutsideClick(e, keyName), { once: true });
            }, 0);
        }
    }
    
    // 툴팁 숨기기
    hideTooltip(keyName) {
        const keyState = this.keyStates.get(keyName);
        
        if (keyState && keyState.tooltip.element) {
            keyState.tooltip.element.remove();
            keyState.tooltip.element = null;
            keyState.tooltip.isActive = false;
        }
    }
    
    // 외부 클릭 처리 (클릭 모드용)
    handleOutsideClick(event, keyName) {
        const keyState = this.keyStates.get(keyName);
        const tooltip = keyState?.tooltip.element;
        
        if (tooltip && !tooltip.contains(event.target) && keyState.tooltip.isActive) {
            this.hideTooltip(keyName);
        }
    }
    
    // 특정 키의 이벤트 리스너 제거
    removeEventListener(key, eventType = 'both') {
        const keyName = key.toLowerCase();
        const listeners = this.eventListeners.get(keyName);
        
        if (listeners) {
            if (eventType === 'both' || eventType === 'press') {
                listeners.press = [];
            }
            if (eventType === 'both' || eventType === 'unpress') {
                listeners.unpress = [];
            }
        }
    }
    
    // 모든 이벤트 리스너 제거
    clearAllEventListeners() {
        this.eventListeners.clear();
    }
    
    // 키보드 제거
    destroy() {
        if (this.keyboardElement) {
            this.keyboardElement.remove();
        }
        
        // 이벤트 리스너 정리
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
            this.resizeHandler = null;
        }
        
        // 커스텀 이벤트 리스너 정리
        this.clearAllEventListeners();
        
        // 맵 정리
        this.keyElements.clear();
        this.keyStates.clear();
    }
}

// 전역으로 내보내기
window.KeyBoard = KeyBoard;

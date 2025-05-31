# 단축키 학습 웹 애플리케이션

단축키 학습을 위한 웹 기반 애플리케이션입니다. Windows, Chrome, VS Code, Photoshop 등 다양한 프로그램의 단축키를 쉽게 학습하고 관리할 수 있습니다.

## 주요 기능

- **카테고리별 단축키 관리**
  - Windows 단축키
  - Chrome 단축키
  - VS Code 단축키
  - Photoshop 단축키

- **학습 관리 시스템**
  - 체크박스로 학습 완료 표시
  - 학습한 단축키 자동 숨김
  - 일일 학습 목표 설정
  - 학습 진행률 표시

- **검색 기능**
  - 실시간 단축키 검색
  - 카테고리별 검색 결과 표시

- **사용자 경험**
  - 반응형 디자인
  - 직관적인 UI/UX
  - 오프라인 지원
  - 로컬 스토리지를 통한 데이터 저장

## 기술 스택

- HTML5
- CSS3
- JavaScript (ES6+)
- LocalStorage API

## 시작하기

1. 저장소 클론
```bash
git clone https://github.com/Julia5971/hw_shortcuts_3.git
```

2. 프로젝트 디렉토리로 이동
```bash
cd hw_shortcuts_3
```

3. 웹 서버 실행
   - 로컬 웹 서버를 사용하거나
   - `index.html` 파일을 웹 브라우저에서 직접 열기

## 사용 방법

1. **단축키 학습**
   - 왼쪽 사이드바에서 카테고리 선택
   - 단축키 카드의 체크박스를 클릭하여 학습 완료 표시
   - 학습한 단축키는 자동으로 숨겨짐

2. **검색**
   - 상단 검색창에 검색어 입력
   - 실시간으로 검색 결과 표시

3. **설정**
   - 우측 상단의 설정 버튼 클릭
   - 일일 학습 목표 설정 (1-50)

## 성능 최적화

- 디바운스 처리된 검색 기능
- DocumentFragment를 사용한 DOM 조작 최적화
- 로컬 스토리지 용량 관리
- 오프라인 지원

## 오류 처리

- 네트워크 오류 처리
- 로컬 스토리지 오류 처리
- 사용자 친화적인 오류 메시지

## 라이선스

MIT License

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 
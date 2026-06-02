# JW 생활과 봉사 예습 앱 - C안 구조

구성:
- `index.html`: GitHub Pages에 올릴 화면 파일
- `worker.js`: Cloudflare Worker에 올릴 자료 가져오기 서버 함수

## 사용 순서

1. GitHub `cksomj/study` 저장소의 `index.html`을 이 파일로 교체합니다.
2. Cloudflare Workers에서 새 Worker를 만들고 `worker.js` 내용을 붙여넣습니다.
3. Worker 배포 후 주소를 복사합니다.
   예: `https://jw-study-fetcher.계정.workers.dev`
4. GitHub Pages 주소 `https://cksomj.github.io/study/`에 접속합니다.
5. 앱의 Worker 주소 칸에 Worker 주소를 넣습니다.
6. JW.org 주간 교재 URL을 넣고 “이번 주 전체 자료 가져오기”를 누릅니다.

## 설계 원칙

- JW.org 자료를 공개 저장소에 저장하지 않습니다.
- 사용자가 버튼을 눌렀을 때만 해당 페이지를 가져옵니다.
- 가져온 자료는 사용자의 브라우저 localStorage에 저장됩니다.
- 너무 많은 요청을 피하기 위해 관련 자료는 최대 8개까지만 자동 추적합니다.

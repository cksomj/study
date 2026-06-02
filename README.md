# JW 생활과 봉사 예습 앱

GitHub Pages 화면과 Cloudflare Worker를 함께 사용하는 개인 예습 앱입니다.

앱 주소:

```text
https://cksomj.github.io/study/
```

## 앱의 목적

생활과 봉사 주간 교재 URL을 넣으면 다음 흐름으로 예습을 돕습니다.

- 주간 교재 본문을 먼저 보여 줍니다.
- 본문 안의 JW.org 내부 링크를 수집합니다.
- 링크를 `성구`, `동영상`, `참조 출판물`, `집회 교재`, `JW.org 자료`로 분류합니다.
- 링크 내용을 가져와 프로그램별 예습 리포트를 만듭니다.
- 해설을 준비할 때 볼 만한 후보 자료와 주요점을 보여 줍니다.

## 프로그램별 정리 기준

- 성경에 담긴 보물: 연설 부분이므로 핵심 주제와 근거 자료를 미리 파악합니다.
- 영적 보물 찾기 첫 질문: 관련 성구와 참조 링크에서 질문 답 후보를 찾습니다.
- 이번 주 성경 읽기에서 찾을 보물: 주간 성경 범위의 주요점을 찾습니다.
- 그리스도인 생활: 동영상과 토의 질문에 대한 답 후보를 찾습니다.
- 회중 성서 연구: 지정 장의 주요점을 리포트형으로 정리합니다.

## 파일 구성

- `index.html`: GitHub Pages에 올리는 앱 화면
- `worker.js`: JW.org 자료를 가져오는 Cloudflare Worker
- `.nojekyll`: GitHub Pages 정적 배포 설정

## Cloudflare Worker 배포

이 앱은 JW.org 페이지를 브라우저에서 직접 가져오지 않고 Cloudflare Worker를 통해 읽습니다.
따라서 `worker.js`를 Cloudflare Worker에 배포해야 자료 가져오기가 작동합니다.

### 방법 A: Cloudflare 대시보드에서 붙여넣기

1. Cloudflare Workers & Pages로 이동합니다.
2. 새 Worker를 만듭니다.
3. 저장소의 `worker.js` 내용을 Worker 편집기에 붙여넣습니다.
4. 배포합니다.
5. 배포 주소를 복사합니다.
   예: `https://jw-study-fetcher.your-account.workers.dev`
6. 앱 화면의 `Worker 주소 설정` 칸에 붙여넣고 `Worker 연결 확인`을 누릅니다.

### 방법 B: Wrangler로 배포

Cloudflare 로그인이 된 PC에서는 다음 명령으로 배포할 수 있습니다.

```powershell
npx wrangler deploy worker.js --name jw-study-fetcher
```

현재 Codex 환경에서는 Cloudflare 로그인이 필요합니다.
`npx wrangler login` 인증이 완료되어야 배포할 수 있습니다.

## 사용 순서

1. `https://cksomj.github.io/study/`에 접속합니다.
2. Cloudflare Worker 주소를 입력합니다.
3. `Worker 연결 확인`을 누릅니다.
4. JW.org 생활과 봉사 주간 교재 URL을 입력합니다.
5. `본문과 링크 자료 가져오기`를 누릅니다.
6. `예습 리포트`, `본문`, `링크 전체`, `가져온 링크 내용` 탭을 보며 해설 후보를 확인합니다.

## 주의

- 이 앱은 개인 예습용입니다.
- JW.org 자료를 공개 저장소나 다른 웹사이트에 다시 게시하지 않습니다.
- 앱의 정리는 해설 준비를 위한 후보 자료입니다.
- 공식 출처와 최신 내용은 항상 JW.org 원문을 기준으로 확인합니다.

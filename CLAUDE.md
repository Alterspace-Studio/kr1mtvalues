# kr1mtvalues 작업 안내

Military Tycoon(로블록스) 가치 사이트 "KR1 Military Tycoon Values". 정적 HTML·CSS·JS.

- 사이트: https://Alterspace-Studio.github.io/kr1mtvalues/ (GitHub Pages, `main` 브랜치에서 배포)
- 저장소: Alterspace-Studio/kr1mtvalues
- 클라우드 환경: **kr1mtvalues** (위키·가치표 사이트·유튜브·nvalue.kro.kr 접속 허용됨)

## 답하는 방식

- 한국어 ~요체로 짧게. 바꾼 것과 결과만 말한다.
- 사용자는 줄임말·별명으로 아이템을 말한다 (예: 슈레오=Super Leonardo, sbt=Super Beam Tank, 핵모타르=Nuke Mortar Truck). 애매하면 후보를 보여 주고 묻는다.
- 단위가 없는 숫자는 문맥으로 판단한다. 보통 "400"=400K, "1.5"=1.5M. 애매하면 가정한 단위를 말한다.

## 파일

- `data/items.js` — 모든 아이템 데이터 (`window.ITEMS`). 거의 모든 작업은 이 파일만 고친다. 맨 위 주석에 필드 설명이 있다.
- `app.js` — 화면 로직. `index.html`, `style.css` — 구조·디자인.
- `images/<id>.png` — 게임 내 아이콘. `images/og-kr1-v2.png` — 링크 공유 썸네일. `images/kr-flag.svg` — 태극 문양.

## 가치 바꾸는 규칙

1. 가치를 바꾸면 `history` 끝에 `{"date": "오늘 YYYY-MM-DD", "value": ...}`를 추가하고 `updated`도 오늘로.
2. **같은 날 정정**이면 새 점을 만들지 않고 그날 기록만 고친다.
3. "1주 전엔 X", "4월 24일 X"처럼 과거 값을 알려 주면 그 날짜로 기록을 끼워 넣고 날짜순으로 정렬한다.
4. **범위 값**: `5M~5.5M` → `value: 5000000, range: [5000000, 5500000]`. `6M+` → `range: [6000000, "+"]`.
   - 그래프 기록·정렬·거래 계산·비교는 모두 **최대값** 기준 (`+`면 하한값).
5. **추세(trend)**: 새 기록과 직전 기록을 비교해 `"up"` / `"down"` / `"stable"`.
6. 사용자가 쓴 별명은 `aliases`에 추가해서 검색되게 한다.
7. 수요(demand) 0~10, 가성비(stats.vfm) 0~10. PVP·난이도는 화면에 안 보이지만 데이터에는 남겨 둔다.
8. 기본 가치·`history`는 0성 기준. 별 단계 값(예: "2성 16M")을 받으면 `starHistory: { "2": [{date, value}] }`에 넣는다. 상세 화면에서 0성 그래프는 그대로, 그 아래 1~3성을 한 그래프에 선으로 겹쳐 보여 준다. 별 단계 기록은 메인 목록과 변경 기록 탭에는 나오지 않는다.
9. 새 아이템: 아이콘 배경색으로 등급을 정한다 — 빨강=한정판(`limited: true`), 무지개=`rarity: "Exotic"`, 주황=`"Legendary"`. 아이콘이 없으면 `image: ""` (화면에 No Image).
10. 거래 불가 아이템은 `tradeable: false`.
11. 다른 가치 사이트를 출처로 적지 않는다 (코드·README·커밋 어디에도).

## 확인과 배포

- 고친 뒤 데이터가 읽히는지 확인: `node -e "global.window={};require('./data/items.js');console.log(window.ITEMS.length)"`
- 화면을 고쳤으면 Playwright로 PC(1200px)·휴대폰(390px), 라이트·다크를 찍어 확인한다. 스크린샷은 저장소에 넣지 않는다.
- 커밋 후 `main`에 올려야 사이트에 반영된다 (1~2분 뒤). 커밋 메시지는 한국어로 짧게.

## 디자인

- 맷 소프트 UI: 바탕과 카드가 같은 색, 테두리 없이 그림자로만 뜨고(카드·버튼), 안쪽 그림자로 파인다(태그·정보 칸·그래프). 선택된 탭·분류는 눌린 모양.
- 포인트 색: 마젠타 하나. 그라데이션은 주요 버튼·로고·작은 점에만, 가는 곳은 단색.
- 게임 등급 색(LE 빨강·검정, Exotic 무지개 등)과 오르내림 색(오름 빨강 ▲, 내림 파랑 ▼)은 그대로 둔다.
- 다크 모드 지원 (기기 설정을 따르고 달 버튼으로 바꾸면 기억).
- 하단에 "Powered by ALTERSPACE".

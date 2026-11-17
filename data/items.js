// 장비 데이터. 이 파일만 고치면 사이트 내용이 바뀐다.
// 이미지는 위키(Military Tycoon Fandom) 주소를 그대로 쓴다.
//
// 필드 설명
//   id         고유 영문 ID (주소·비교에 쓰임)
//   name       표시 이름
//   category   "Land" | "Air" | "Naval" | "Soldier" | "Drone" | "Other"
//   value      거래 가치 (숫자, 단위 Gems 💎)
//   demand     수요 0~10
//   trend      "up" | "down" | "stable"
//   tradeable  거래 가능 여부
//   limited    한정판(LE) 여부, stock: 한정 수량 (모르면 null)
//   stars      별 단계별 가치 { "0": 숫자, "1": 숫자, ... "5": 숫자 } (별은 0~5). 빠진 단계는 SITE.starOffsets로 자동 계산. value는 0성 가치
//   stats      성능 { pvp, boss, vfm, diff } 0~10 (PVP, 보스 레이드, 가성비, 난이도=다루기 어려운 정도, 소수 가능). 모르면 null
//   obtain     얻는 방법
//   updated    값을 마지막으로 바꾼 날 "YYYY-MM-DD"
//   history    젬 가치 변화 [{ date, value }] (거래방 현금 거래를 그 달 "N:1" 젬 시세로 환산)
//   image      이미지 경로 (images/xxx.png, 없으면 빈 문자열)
//   note       메모 (영어), noteKo: 한국어 메모
//   aliases    검색용 다른 이름 (예: ["Abrams", "에이브럼스"])

window.SITE = {
  title: "kr1mtvalues",
  valueUnit: "Gems",
  lastUpdated: "2026-11-17",
  // 별 단계 값이 없을 때 0성 가치에 더하는 기본 차이 (젬). 아이템에 stars를 적으면 그 값이 우선
  starOffsets: { 1: 0, 2: 0, 3: 20000, 4: 110000, 5: 200000 },
};

window.ITEMS = [
  {
    id: "le-gold-bismarck", name: "LE Gold Bismarck", category: "Naval",
    aliases: ["Gold Bismarck", "Gold Bismark", "LE1000 Bismarck", "골비스", "골비", "골드 비스마르크"],
    value: 15000000, demand: null, trend: null, tradeable: true, limited: true, stock: 1000,
    stats: { pvp: 10, boss: 5.5, vfm: null },
    obtain: "Golden Crate", updated: "2026-11-17",
    history: [],
    image: "https://static.wikia.nocookie.net/military-tycoon/images/c/ce/LE1000BismarckInAction.png/revision/latest/scale-to-width-down/600",
    note: "Battleship. Released 2024-11-09.", noteKo: "전함. 2024-11-09 출시.",
  },
  {
    id: "seabreacher-x", name: "SeaBreacher-X", category: "Naval",
    aliases: ["Seabreacher", "시브", "시브리쳐"],
    value: 3800000, demand: null, trend: "stable", tradeable: true, limited: false, stock: null,
    stats: { pvp: null, boss: null, vfm: null },
    obtain: "SeaBreacher-X Crate", updated: "2026-07-15",
    history: [{"date": "2026-05", "value": 3000000}, {"date": "2026-06", "value": 4000000}, {"date": "2026-07", "value": 3800000}],
    image: "https://static.wikia.nocookie.net/military-tycoon/images/2/23/SeaBreacher-X_golden_crate.png/revision/latest/scale-to-width-down/600",
    note: "Submarine. Released 2025-06-28. Value estimated from KR trade chat (converted to gems).", noteKo: "잠수함. 2025-06-28 출시. 가치는 한국 거래방 거래를 젬으로 환산한 추정값.",
  },
  {
    id: "le-rocket-plane", name: "LE Rocket Plane", category: "Air",
    aliases: ["Rocket Plane", "리로플", "로플"],
    value: 3500000, demand: null, trend: "up", tradeable: true, limited: true, stock: 1000,
    stats: { pvp: null, boss: null, vfm: null },
    obtain: "Rocket Plane Crate", updated: "2026-08-29",
    history: [{"date": "2025-10", "value": 1600000}, {"date": "2025-11", "value": 1000000}, {"date": "2026-08", "value": 3500000}],
    image: "https://static.wikia.nocookie.net/military-tycoon/images/d/de/LE1000RocketPlaneInAction.png/revision/latest/scale-to-width-down/600",
    note: "Bomber. Released 2025-02-08. Value estimated from KR trade chat (converted to gems).", noteKo: "폭격기. 2025-02-08 출시. 가치는 한국 거래방 거래를 젬으로 환산한 추정값.",
  },
  {
    id: "le-blackbird", name: "LE Blackbird", category: "Air",
    aliases: ["Blackbird", "리블버", "블랙버드"],
    value: 3000000, demand: null, trend: "up", tradeable: true, limited: true, stock: 1000,
    stats: { pvp: null, boss: null, vfm: null },
    obtain: "LE1000 Blackbird Crate", updated: "2026-09-25",
    history: [{"date": "2025-08", "value": 480000}, {"date": "2025-10", "value": 3200000}, {"date": "2025-11", "value": 2400000}, {"date": "2025-12", "value": 3700000}, {"date": "2026-06", "value": 2100000}, {"date": "2026-09", "value": 4500000}],
    image: "https://static.wikia.nocookie.net/military-tycoon/images/7/71/LE1000BlackbirdInAction.png/revision/latest/scale-to-width-down/600",
    note: "Fighter jet. Released 2024-12-24. Value estimated from KR trade chat (converted to gems).", noteKo: "전투기. 2024-12-24 출시. 가치는 한국 거래방 거래를 젬으로 환산한 추정값.",
  },
  {
    id: "p1000-ratte", name: "P.1000 Ratte", category: "Land",
    aliases: ["Ratte", "라테", "라떼"],
    value: 2900000, demand: null, trend: "up", tradeable: true, limited: true, stock: 750,
    stats: { pvp: null, boss: null, vfm: null },
    obtain: "Golden Crate", updated: "2026-10-31",
    history: [{"date": "2025-11", "value": 960000}, {"date": "2026-01", "value": 510000}, {"date": "2026-08", "value": 1400000}, {"date": "2026-10", "value": 3300000}],
    image: "https://static.wikia.nocookie.net/military-tycoon/images/d/d0/RatteInAction.png/revision/latest/scale-to-width-down/600",
    note: "Tank. Released 2025-03-08. Value estimated from KR trade chat (converted to gems).", noteKo: "전차. 2025-03-08 출시. 가치는 한국 거래방 거래를 젬으로 환산한 추정값.",
  },
  {
    id: "le-imperial-tank", name: "LE Imperial Tank", category: "Land",
    aliases: ["Imperial Tank", "리임페", "리임탱"],
    value: 2600000, demand: null, trend: "up", tradeable: true, limited: true, stock: null,
    stats: { pvp: null, boss: null, vfm: null },
    obtain: "Imperial Tank Crate", updated: "2026-06-13",
    history: [{"date": "2025-08", "value": 520000}, {"date": "2026-06", "value": 2800000}],
    image: "https://static.wikia.nocookie.net/military-tycoon/images/f/f7/ImperialTankInAction.png/revision/latest/scale-to-width-down/600",
    note: "Released 2025-05-03. Value estimated from KR trade chat (converted to gems).", noteKo: "2025-05-03 출시. 가치는 한국 거래방 거래를 젬으로 환산한 추정값.",
  },
  {
    id: "sb-21", name: "Super B21", category: "Air",
    aliases: ["SB-21", "SB21", "B21"],
    value: 1900000, demand: null, trend: "up", tradeable: true, limited: false, stock: null,
    stats: { pvp: null, boss: null, vfm: null },
    obtain: "B21 Raider Crate", updated: "2026-06-12",
    history: [{"date": "2025-10", "value": 1500000}, {"date": "2026-06", "value": 1900000}],
    image: "https://static.wikia.nocookie.net/military-tycoon/images/c/cd/Super_B21.png/revision/latest/scale-to-width-down/600",
    note: "Bomber. Released 2025-08-09. Value estimated from KR trade chat (converted to gems).", noteKo: "폭격기. 2025-08-09 출시. 가치는 한국 거래방 거래를 젬으로 환산한 추정값.",
  },
  {
    id: "jetpack-fighter", name: "Jetpack Fighter", category: "Soldier",
    aliases: ["Jetpack", "제팩", "제트팩"],
    value: 4200000, demand: null, trend: null, tradeable: true, limited: false, stock: null,
    stats: { pvp: null, boss: null, vfm: null },
    obtain: "", updated: "2026-11-17",
    history: [],
    image: "",
    note: "Soldier.", noteKo: "병사.",
  },
  {
    id: "master-reaper", name: "Master Reaper", category: "Air",
    aliases: ["마리퍼", "마스터리퍼"],
    value: 980000, demand: null, trend: "down", tradeable: true, limited: false, stock: null,
    stats: { pvp: null, boss: null, vfm: null },
    obtain: "Boss Fight: The Reaper", updated: "2025-12-21",
    history: [{"date": "2025-10", "value": 1000000}, {"date": "2025-11", "value": 780000}],
    image: "https://static.wikia.nocookie.net/military-tycoon/images/c/c9/Master_Reaper.png/revision/latest/scale-to-width-down/600",
    note: "Sky fortress. Released 2025-05-24. Value estimated from KR trade chat (converted to gems).", noteKo: "하늘 요새. 2025-05-24 출시. 가치는 한국 거래방 거래를 젬으로 환산한 추정값.",
  },
  {
    id: "darkstar-x", name: "Darkstar X", category: "Air",
    aliases: ["Darkstar", "닼스", "다크스타"],
    value: 940000, demand: null, trend: "stable", tradeable: true, limited: false, stock: null,
    stats: { pvp: null, boss: null, vfm: null },
    obtain: "LE Station", updated: "2026-11-08",
    history: [{"date": "2025-12", "value": 670000}, {"date": "2026-01", "value": 360000}, {"date": "2026-03", "value": 340000}],
    image: "https://static.wikia.nocookie.net/military-tycoon/images/7/75/Darkstar_X.png/revision/latest/scale-to-width-down/600",
    note: "Bomber. Released 2025-06-12. Value estimated from KR trade chat (converted to gems).", noteKo: "폭격기. 2025-06-12 출시. 가치는 한국 거래방 거래를 젬으로 환산한 추정값.",
  },
  {
    id: "le-missouri", name: "LE Missouri", category: "Naval",
    aliases: ["Missouri", "USS Missouri", "리주리", "리미주리", "미주리"],
    value: 520000, demand: null, trend: "up", tradeable: true, limited: true, stock: null,
    stats: { pvp: null, boss: null, vfm: null },
    obtain: "USS Missouri Crate", updated: "2026-05-12",
    history: [{"date": "2025-12", "value": 980000}, {"date": "2026-01", "value": 480000}, {"date": "2026-03", "value": 200000}, {"date": "2026-05", "value": 790000}],
    image: "https://static.wikia.nocookie.net/military-tycoon/images/7/7c/Official_Promotional_Poster_of_the_USS_Missouri.png/revision/latest/scale-to-width-down/600",
    note: "Warship. Released 2025-11-29. Value estimated from KR trade chat (converted to gems).", noteKo: "전함. 2025-11-29 출시. 가치는 한국 거래방 거래를 젬으로 환산한 추정값.",
  },
  {
    id: "nuke-mortar", name: "Nuke Mortar Truck", category: "Land",
    aliases: ["Nuke Mortar", "핵박격", "핵모르타르"],
    value: 500000, demand: null, trend: null, tradeable: true, limited: false, stock: null,
    stats: { pvp: null, boss: null, vfm: null },
    obtain: "Nuke Mortar Truck Crate", updated: "2026-06-02",
    history: [{"date": "2025-11", "value": 610000}],
    image: "",
    note: "Artillery. Released 2025-07-12. Value estimated from KR trade chat (converted to gems).", noteKo: "포병. 2025-07-12 출시. 가치는 한국 거래방 거래를 젬으로 환산한 추정값.",
  },
  {
    id: "nuke-project", name: "Nuke Project 665", category: "Naval",
    aliases: ["Project 665", "핵프젝"],
    value: 480000, demand: null, trend: "stable", tradeable: true, limited: false, stock: null,
    stats: { pvp: null, boss: null, vfm: null },
    obtain: "Project 665 Crate", updated: "2026-10-29",
    history: [{"date": "2026-01", "value": 460000}, {"date": "2026-02", "value": 280000}, {"date": "2026-09", "value": 290000}],
    image: "https://static.wikia.nocookie.net/military-tycoon/images/a/a0/Nuke_Project_665.png/revision/latest/scale-to-width-down/600",
    note: "Submarine. Released 2025-10-04. Value estimated from KR trade chat (converted to gems).", noteKo: "잠수함. 2025-10-04 출시. 가치는 한국 거래방 거래를 젬으로 환산한 추정값.",
  },
  {
    id: "super-mech", name: "Super Mech", category: "Land",
    aliases: ["슈퍼메카", "슈메카"],
    value: 200000, demand: null, trend: "down", tradeable: true, limited: false, stock: null,
    stats: { pvp: null, boss: null, vfm: null },
    obtain: "Super Mech Crate", updated: "2026-02-28",
    history: [{"date": "2025-12", "value": 370000}, {"date": "2026-02", "value": 200000}],
    image: "",
    note: "Mech. Released 2025-12-13. Value estimated from KR trade chat (converted to gems).", noteKo: "메카. 2025-12-13 출시. 가치는 한국 거래방 거래를 젬으로 환산한 추정값.",
  },
  {
    id: "le-cobra", name: "LE Cobra", category: "Air",
    aliases: ["Cobra", "코브라"],
    value: 180000, demand: null, trend: "up", tradeable: true, limited: true, stock: null,
    stats: { pvp: null, boss: null, vfm: null },
    obtain: "Cobra Crate", updated: "2026-05-29",
    history: [{"date": "2025-11", "value": 400000}, {"date": "2026-02", "value": 130000}, {"date": "2026-05", "value": 230000}],
    image: "https://static.wikia.nocookie.net/military-tycoon/images/3/3a/CobraInFlight.png/revision/latest/scale-to-width-down/600",
    note: "Helicopter. Released 2025-05-17. Value estimated from KR trade chat (converted to gems).", noteKo: "헬기. 2025-05-17 출시. 가치는 한국 거래방 거래를 젬으로 환산한 추정값.",
  },
  {
    id: "le-zumwalt", name: "LE Zumwalt", category: "Naval",
    aliases: ["Zumwalt", "줌왈트", "줌왈"],
    value: 170000, demand: null, trend: "down", tradeable: true, limited: true, stock: null,
    stats: { pvp: null, boss: null, vfm: null },
    obtain: "Zumwalt Quest", updated: "2026-01-10",
    history: [{"date": "2025-11", "value": 490000}, {"date": "2026-01", "value": 200000}],
    image: "https://static.wikia.nocookie.net/military-tycoon/images/2/2e/Zumwalt_InGame.png/revision/latest/scale-to-width-down/600",
    note: "Frigate. Released 2024-08-25. Value estimated from KR trade chat (converted to gems).", noteKo: "호위함. 2024-08-25 출시. 가치는 한국 거래방 거래를 젬으로 환산한 추정값.",
  },
  {
    id: "f35-billion", name: "F-35 Billion", category: "Air",
    aliases: ["F35 Billion", "F-35", "F35", "빌리언", "F35 빌리언"],
    value: null, demand: null, trend: null, tradeable: true, limited: false, stock: null,
    stats: { pvp: 8, boss: 1, vfm: 10 },
    obtain: "", updated: "2026-11-17",
    history: [],
    image: "https://static.wikia.nocookie.net/military-tycoon/images/b/b1/F-35_Billion.png/revision/latest",
    note: "Fighter jet.", noteKo: "전투기.",
  },
  {
    id: "super-x32", name: "Super X-32", category: "Air",
    aliases: ["X-32", "X32", "Super X32", "슈퍼 X-32", "슈X32"],
    value: 1890000, demand: null, trend: null, tradeable: true, limited: false, stock: null,
    stars: { "0": 1890000, "5": 2200000 },
    stats: { pvp: null, boss: null, vfm: null },
    obtain: "", updated: "2026-11-17",
    history: [],
    image: "",
    note: "Fighter jet. 0★ 1.89M, maxed (5★) 2.2M.", noteKo: "전투기. 0성 1.89M, 풀강(5성) 2.2M.",
  },
];

/* BC Driving Master — i18n Translation Engine
 * Supports 3 languages:
 *  - 'yue': 廣東話 / 繁體中文 (Existing version)
 *  - 'en': English (Official ICBC English terminology)
 *  - 'zh': 简体中文 (Simplified Chinese)
 */
(function (window) {
  'use strict';

  var LANGS = [
    { code: 'yue', label: '廣東話 (繁體)', flag: '🇭🇰', htmlLang: 'zh-HK' },
    { code: 'en', label: 'English', flag: '🇬🇧', htmlLang: 'en' },
    { code: 'zh', label: '简体中文', flag: '🇨🇳', htmlLang: 'zh-CN' }
  ];

  // Common UI & Navigation
  var UI_TRANSLATIONS = {
    en: {
      site_title: 'BC Driving Master',
      site_sub: 'ICBC Automatic Road Test Guide',
      banner_text: 'ICBC Official Standards: BC Class 7 (N) & Class 5 Automatic Road Test Curriculum',
      banner_tag: '2026 Edition',
      btn_demerit: 'Examiner Demerit Sheet',
      menu_label: 'Menu',
      search_placeholder: 'Search modules or keywords...',
      search_empty: 'No matching modules found.',
      completed_suffix: 'Completed',
      reset: 'Reset',
      progress: 'Progress',
      footer_title: 'BC Driving Master · BC ICBC Automatic Car Road Test Self-Study Guide',
      footer_sub: 'This site is for self-study and is not an official ICBC product. Official test standards are based on ICBC\'s latest Learn to Drive Smart manual and road test scoring sheet. Photos from Unsplash are for illustration only.',
      nav: {
        'index.html': 'Home',
        'cockpit.html': 'Pre-Trip & Cockpit',
        'driving-basics.html': 'Automatic Driving',
        'intersections.html': 'Right-of-Way',
        'maneuvers.html': 'Parking & Maneuvers',
        'speed-zones.html': 'Speed Zones',
        'hazard-perception.html': 'Hazard Perception',
        'mock-test.html': 'Scoring & Auto-Fails'
      }
    },
    zh: {
      site_title: 'BC Driving Master',
      site_sub: 'ICBC 自动挡路考通关全指南',
      banner_text: 'ICBC 官方标准：BC省 Class 7 (N牌) 及 Class 5 全牌自动挡路考专用课程',
      banner_tag: '2026 版',
      btn_demerit: '考官扣分清单',
      menu_label: '菜单',
      search_placeholder: '搜索学习模块或关键词...',
      search_empty: '没有找到匹配的模块。',
      completed_suffix: '已完成',
      reset: '重置',
      progress: '完成进度',
      footer_title: 'BC Driving Master · 卑诗省 ICBC 自动挡私家车路考自学手册',
      footer_sub: '本网站为自学参考，并非 ICBC 官方产品。考试标准以 ICBC 最新《Learn to Drive Smart》及路试评分表为准。图片来自 Unsplash，仅作示意。',
      nav: {
        'index.html': '首页总览',
        'cockpit.html': '座舱检查',
        'driving-basics.html': '自动挡技巧',
        'intersections.html': '路口路权',
        'maneuvers.html': '必考停车',
        'speed-zones.html': '限速特区',
        'hazard-perception.html': '危险预判',
        'mock-test.html': '即死位与模拟评分'
      }
    },
    yue: {
      site_title: 'BC Driving Master',
      site_sub: 'ICBC 自動波路試通關全指南',
      banner_text: 'ICBC 官方標準：卑詩省 Class 7 (N牌) 及 Class 5 全牌自動波路試專用課程',
      banner_tag: '2026 版',
      btn_demerit: '考官扣分清單',
      menu_label: '選單',
      search_placeholder: '搜尋學習模組或關鍵字...',
      search_empty: '沒有找到符合的模組。',
      completed_suffix: '已完成',
      reset: '重設',
      progress: '完成進度',
      footer_title: 'BC Driving Master · 卑詩省 ICBC 自動波私家車路考自學手冊',
      footer_sub: '本網站為自學參考，並非 ICBC 官方產品。考試標準以 ICBC 最新《Learn to Drive Smart》及路試評分表為準。圖片來自 Unsplash，僅作示意。',
      nav: {
        'index.html': '首頁總覽',
        'cockpit.html': '座艙檢查',
        'driving-basics.html': '自動波技巧',
        'intersections.html': '路口路權',
        'maneuvers.html': '必考泊車',
        'speed-zones.html': '限速特區',
        'hazard-perception.html': '危險預判',
        'mock-test.html': '即死位與模擬評分'
      }
    }
  };

  // Comprehensive phrase translations for English
  var EN_PHRASES = {
    // Hero & Navigation
    "BC 溫哥華 / 卑詩省": "BC Vancouver / British Columbia",
    "ICBC 自動波私家車路考通關全指南": "ICBC Automatic Car Road Test Guide",
    "一次通關必備": "Pass on the First Try",
    "第一課：座艙與出發前檢查": "Lesson 1: Pre-Trip & Cockpit",
    "模擬評分": "Mock Road Test",
    "通關路線圖（8 個核心里程碑）": "Roadmap (8 Core Milestones)",
    "完成一個學習重點就勾選，進度會保存在你的瀏覽器中。": "Check off items as you master them. Progress is saved in your browser.",
    "7 大核心學習模組": "7 Core Learning Modules",
    "按照真實 ICBC 路考考核順序設計，帶高畫質實境圖片與互動模擬": "Organized by official ICBC exam order, with realistic photography and interactive simulators",
    "開始學習": "Start Lesson",
    "ICBC 路考 10 大即時不及格致命行為 (Automatic Fails)": "Top 10 ICBC Road Test Automatic Fails (Instant Disqualifications)",
    "在 BC 省路試中，一旦出現以下任何一項行為，不論先前表現多優異，考官均有權立即踩副煞車並直接評定不及格：": "On an ICBC road test, committing any of these actions allows the examiner to immediately take control or fail you on the spot:",
    "進入互動模擬評分表與自我檢測": "Open Mock Test Demerit Scorer",
    "Class 7（N 牌）及 Class 5 全牌路考。涵蓋出發前座艙調整、自動檔踩剎、擰頭望盲點（Shoulder Check）、四路停牌路權、平行泊車、斜坡泊車，以及考官隨機抽問的危險預判（Hazard Perception）。": "Class 7 (N) and Class 5 road test guide: covers pre-trip setup, progressive braking, shoulder checks, 4-way stop right-of-way, parallel parking, hill parking, and hazard perception.",

    // Cockpit Module 01
    "Module 01 · 第一課": "Module 01 · Lesson 1",
    "車廂座艙與出發前檢查": "Pre-Trip Inspection & Cockpit Controls",
    "考官第一件事就是看你上車之後點樣準備。座位、後視鏡、腳位與檔位都要先調好，才開始駕駛。": "The examiner evaluates how you prepare from the moment you sit down. Adjust your seat, mirrors, pedals, and gears before starting.",
    "360 度車外檢查": "360° Vehicle Exterior Inspection",
    "上車前繞車一圈，每項打勾。進度會保存在瀏覽器中。": "Walk around your vehicle before driving. Progress saves automatically.",
    "輪胎胎壓與花紋": "Tire Pressure & Tread Depth",
    "四隻輪胎都要目測，唔好有明顯扁胎或鐵線外露。": "Inspect all 4 tires visually for proper inflation, tread wear, and no visible damage.",
    "煞車燈、指揮燈、倒車燈、車牌燈": "Brake Lights, Signals, Reverse & License Plate Lights",
    "請另一人幫手，或對著玻璃反光檢查。": "Ask someone to assist or check reflections against glass walls/garage doors.",
    "車底無漏液": "No Underbody Fluid Leaks",
    "地面有無油、水或冷氣液滴下。": "Check the ground underneath for oil, coolant, or transmission fluid leaks.",
    "車身、後車窗與後視鏡": "Windows, Mirrors & Windshield",
    "玻璃清潔，鏡面無遮擋。": "Clean glass surfaces, clear wiper blades, unobstructed mirror views.",
    "車牌清晰": "License Plates Clear",
    "前後牌照無遮擋，燈光正常。": "Front and rear plates clean, decals valid, license plate lamps working.",
    "座位與後視鏡「黃金調整法」": "Seat & Mirror 'Golden Alignment' Technique",
    "調好座位再調鏡，左腳踩實休息踏板，右腳以腳跟為軸。": "Adjust your seat before mirrors. Keep your left foot on the footrest and pivot your right heel.",
    "臀部貼緊椅背，雙腿微曲": "Hips firmly against seatback, slight bend in knees",
    "踩實煞車踏板時，膝蓋依然有自然彎曲，唔好伸直雙腿。": "When depressing the brake pedal fully, your knee must remain slightly bent.",
    "手腕自然垂放方向盤頂部": "Wrists resting atop steering wheel",
    "雙手放在 9 點同 3 點位置，轉向最省力且安全氣囊彈出時安全。": "Hold the wheel at 9 and 3 o'clock for optimal control and airbag safety.",
    "中央後視鏡：框住整個後窗": "Rearview Mirror: Frame the entire rear window",
    "坐直時一眼望清後車窗四個角，唔需要移動頭部。": "You should see the four corners of the rear window without moving your head.",
    "左右側鏡：車身佔內側 1/4 到 1/5": "Side Mirrors: Car body visible only 1/4 to 1/5",
    "地平線喺鏡子中央二分之一。車身佔鏡內側邊緣少量即可，減少盲點。": "Horizon centered horizontally. Minimize seeing your own car to reduce blind spots.",
    "自動波檔位深度剖析": "Automatic Transmission Gear Guide",
    "P (Park) 停車檔": "P (Park) - Mechanical Lock",
    "每次停車先拉手煞車，再入 P 檔，保護變速箱棘爪。": "Always apply parking brake BEFORE shifting into Park to protect gearbox pawls.",
    "R (Reverse) 倒車檔": "R (Reverse) - Backing Gear",
    "倒車前必須 360 度環視，並直接向後望後窗。": "Always do a 360° scan and look directly out the rear window before reversing.",
    "N (Neutral) 空檔": "N (Neutral) - Free Wheeling",
    "洗車機或拖車使用，平時行車不可用 N 檔溜車。": "Used for car washes or towing. Never coast downhill in Neutral.",
    "D (Drive) 前進檔": "D (Drive) - Forward Driving",
    "路試正常巡航使用，變速箱自動升降檔。": "Standard driving gear. The transmission shifts automatically.",
    "2 / 1 / L 低速檔": "2 / 1 / L - Low Gears & Engine Braking",
    "大斜坡落斜引擎制動，或雪地起步防打滑。": "Used for descending steep hills with engine braking or snowy starts.",
    "儀表板必備警示燈圖鑑": "Essential Dashboard Warning Lights",
    "煞車系統警示燈": "Brake System Warning Light",
    "手煞未鬆開，或煞車油不足。行車前一定要確認熄滅。": "Parking brake engaged or low brake fluid. Ensure it is off before driving.",
    "引擎故障燈 (Check Engine)": "Check Engine Light",
    "亮起代表引擎或排氣系統有異常，考試用車不可亮起。": "Indicates engine or emissions issues. Not allowed on test day.",
    "機油壓力警示燈": "Oil Pressure Warning Light",
    "亮起必須立即安全停車熄匙，代表機油嚴重不足。": "Stop safely immediately if lit; indicates critically low oil pressure.",
    "冷卻液水溫燈": "Coolant Temperature Warning Light",
    "水溫過高，繼續行駛會燒毀引擎。": "Coolant is overheating; engine damage will occur if you continue driving.",
    "防抱死煞車 (ABS) 燈": "Anti-lock Braking System (ABS) Light",
    "ABS 系統自我檢測未通過，急煞時輪胎可能抱死打滑。": "ABS self-check failed; wheels may lock up during emergency braking.",
    "安全帶警示燈": "Seatbelt Reminder Light",
    "未扣安全帶。出發前確保自己同考官都已扣好。": "Ensure all occupants are buckled up before releasing the brake.",

    // Driving basics Module 02
    "Module 02 · 第二課": "Module 02 · Lesson 2",
    "自動波技巧與 See - Think - Do": "Automatic Driving Skills & See-Think-Do",
    "路試評分重點不在你車開得幾快，而在你點樣控制車速、點樣觀察、點樣讓其他使用者知道你會做什麼。": "Examiners assess your speed control, systematic observation, and clear communication with road users, not how fast you drive.",
    "腳跟點地法與漸進煞車": "Heel-Pivot Technique & Progressive Braking",
    "腳跟永遠留在地板上": "Keep your heel anchored on the floorboard",
    "腳跟對齊煞車踏板右緣，用腳掌前部去踩煞車或油門。腳跟做支點，可以減少誤踩油門。": "Align your heel with the brake pedal's right edge. Pivot smoothly between gas and brake to prevent accidental acceleration.",
    "漸進式煞車（Progressive Braking）": "Progressive Braking Technique",
    "前半段柔和踩下，車速降低後微微放鬆，最後平穩停定。避免車頭急速點頭，乘客也會感覺舒服。": "Apply smooth initial pressure, ease off slightly as speed drops, then stop gently without nose-diving.",
    "停車前一定要停定": "Come to a complete stop before moving",
    "停牌線前完全靜止，才可以再起步。停牌不完全停定（Rolling Stop）屬即時不及格。": "Vehicle speed must reach 0 km/h before the line. Rolling stops result in an automatic failure.",
    "觀察循環：每 5 至 8 秒重複一次": "Observation Cycle: Repeat Every 5–8 Seconds",
    "See（看） → Think（想） → Do（做）。考官最想見到你不停掃視，而不是盯住前面一個點。": "See → Think → Do. The examiner expects systematic scanning, never staring fixated ahead.",
    "看前方": "Look Ahead",
    "前車、行人、紅綠燈": "Lead traffic, pedestrians, signals",
    "看中鏡": "Rearview Mirror",
    "後方來車速度": "Following vehicle distance & speed",
    "掃描儀表": "Scan Dashboard",
    "時速、燈號": "Speedometer & indicators",
    "看遠方": "Scan Horizon",
    "約 12 秒前的路況": "12-second visual lead time",
    "轉彎轉線五步鐵律": "5-Step Turn & Lane Change Rule",
    "1. 中鏡檢查（Mirror Check）": "1. Mirror Check (Rearview)",
    "2. 打指揮燈（Signal 至少 30 公尺）": "2. Signal (At least 30 meters / 3 seconds ahead)",
    "3. 側鏡檢查（Side Mirror）": "3. Side Mirror Check",
    "4. 扭頭望盲點（Shoulder Check 45-90度）": "4. Shoulder Check (Turn head 45°–90°)",
    "5. 平穩完成操作（Manoeuvre）": "5. Smooth Manoeuvre",
    "盲點視野與扭頭模擬器": "Blind Spot & Shoulder Check Visualizer",
    "拖動滑桿模擬你向左或向右扭頭的角度。綠色扇形代表你眼睛看到嘅範圍；紅色陰影係後視鏡睇唔到嘅盲點。": "Drag the slider to turn your head. Green shows your visual field; red indicates mirror blind spots.",
    "扭頭角度": "Head Turn Angle",
    "跟車距離法則": "Following Distance Rules",
    "乾燥路面 2 秒法則": "2-Second Rule (Dry Roads)",
    "雨雪或高速 3 至 4 秒": "3–4 Seconds (Rain/Snow/Highway)",
    "停在路口：看到前車後輪著地": "Stop Position: Tires Touching Tarmac",

    // Intersections Module 03
    "Module 03 · 第三課": "Module 03 · Lesson 3",
    "路口路權與轉彎規則": "Intersections & Right-of-Way Rules",
    "路口係路試最多扣分嘅地方。搞清楚邊個先行、點樣掃描、幾時可以出發，就已經贏咗一半。": "Intersections account for most test demerits. Knowing who has right-of-way and scanning correctly is half the test.",
    "四路停牌（4-Way Stop）先後次序": "4-Way Stop Right-of-Way Rules",
    "四邊都有停牌標誌時，按以下規則決定先行次序。": "When all 4 approaches have Stop signs, apply these rules in order:",
    "先到先走（First to arrive, first to leave）": "First to Arrive, First to Proceed",
    "你先完全停定，你先行。": "The vehicle that reaches a complete stop first goes first.",
    "同時到達，讓右方車輛先行": "Tie: Yield to Vehicle on Your Right",
    "兩輛車同時到達，讓你右手邊嘅車先過。": "When two vehicles arrive simultaneously, yield to the vehicle on your right.",
    "對頭車同時到達": "Head-on Tie: Straight over Turning, Right over Left",
    "直行車先於轉彎車；右轉車先於左轉車。": "Straight traffic has priority over turning; right turns have priority over left turns.",
    "兩路停牌（2-Way Stop）": "2-Way Stop (Cross Traffic Has Priority)",
    "橫向車有絕對路權。你要在停牌白線前完全靜止，確認冇車後才慢慢向前探頭（Creep forward）。": "Cross traffic has complete right-of-way. Stop 100% behind the line, then creep forward slowly to check sightlines.",
    "路口掃描：左 ➔ 中 ➔ 右 ➔ 左": "Intersection Scan: Left ➔ Center ➔ Right ➔ Left",
    "即使有綠燈，進入路口前都要掃描，因為有人會衝紅燈。掃描次序係左、中、右、再左。": "Scan every intersection even on green lights to detect red-light runners: Left, Center, Right, Left.",
    "殘舊綠燈（Stale Green Light）": "Stale Green Light (Cover the Brake)",
    "遠處見到綠燈已經亮咗好耐（可能會轉黃），即刻鬆開油門，右腳放喺煞車上方備煞（Cover the brake）。": "If a green light has been active for a long time, release gas and cover the brake pedal.",
    "心中設定一個不歸點（Point of No Return）：如果車速可以安全煞停就停；如果已經超過不歸點，就要平穩通過，唔好急煞。": "Identify a Point of No Return: stop smoothly if safe; proceed steadily if you have passed it without slamming brakes.",
    "紅燈右轉（Right Turn on Red）": "Right Turn on Red (Full Stop First)",
    "白線前完全停定 100%": "Come to a 100% complete stop behind the stop line",
    "確認沒有「No Turn on Red」禁制標誌": "Check for 'No Turn on Red' prohibitive signs",
    "望左看橫向來車，望前看對面左轉車": "Look left for cross traffic and ahead for oncoming left turners",
    "向右扭頭望盲點（Shoulder Check）！檢查單車道同行人": "Shoulder check right! Verify bicycle lanes and pedestrians",
    "安全才轉出，切入最近的右側車道": "Turn smoothly into the closest curb lane only when completely safe",
    "無保護左轉（Unprotected Left Turn）": "Unprotected Left Turn (Straight Wheels)",
    "車輪絕對保持直線！如果在等待時提前打斜車輪，後車追撞會將你推向對面來車車道。": "Keep your wheels pointed straight ahead! If rear-ended with wheels turned, you will be pushed into oncoming traffic.",

    // Maneuvers Module 04
    "Module 04 · 第四課": "Module 04 · Lesson 4",
    "必考泊車與調頭技巧": "Required Parking & Maneuvers",
    "平行泊車、斜坡泊車、三點調頭同倒車入庫，每一項都係路試常見考核。下面有互動模擬，可以自己試下。": "Parallel parking, hill parking, 3-point turns, and backing in are core test maneuvers. Use the interactive simulators below.",
    "平行泊車（Parallel Parking）黃金 4 步法": "Parallel Parking: 4-Step Golden Reference Guide",
    "第 1 步": "Step 1",
    "第 2 步": "Step 2",
    "第 3 步": "Step 3",
    "第 4 步": "Step 4",
    "當前步驟": "Current Step",
    "第 1 步：與目標車並排約 1 公尺，後視鏡對齊，入 R 檔，打右燈，360 度環視 + 右後扭頭。": "Step 1: Align parallel ~1m from target car, mirrors even, shift to R, signal right, 360° scan + right shoulder check.",
    "第 2 步：向右打一圈方向盤，緩慢倒退至車身呈 45 度角。": "Step 2: Turn steering wheel one turn right, reverse slowly until car reaches a 45° angle to the curb.",
    "第 3 步：方向盤回正直倒，直看右側後視鏡看到前車左尾燈。": "Step 3: Straighten wheel, reverse straight until your right mirror aligns with target car's left rear corner.",
    "第 4 步：方向盤向左打到底，平穩入位，回正車身，距離路緣約 30 公分，入 P 檔拉手煞。": "Step 4: Turn wheel fully left, glide into space within 30cm (1ft) of curb, shift to P and engage parking brake.",
    "注意：整個過程要慢，時速保持在步行速度；如果後輪已碰到路緣，即時不及格。": "Note: Keep speed at a walking pace. Hitting or mounting the curb is an instant failure.",
    "斜坡泊車（Hill Parking）輪胎方向口訣": "Hill Parking Wheel Orientation Guide",
    "上坡有路緣（Uphill with curb）": "Uphill with Curb",
    "上坡無路緣（Uphill without curb）": "Uphill without Curb",
    "下坡有/無路緣（Downhill）": "Downhill (With or Without Curb)",
    "方向盤向左打到底": "Turn wheels all the way LEFT",
    "方向盤向右打到底": "Turn wheels all the way RIGHT",
    "三點調頭（Three-Point Turn / Y-Turn）": "Three-Point Turn (Y-Turn)",
    "倒車入庫（Stall Parking - Backing In）": "Stall Parking (Backing In)",

    // Speed zones Module 05
    "Module 05 · 第五課": "Module 05 · Lesson 5",
    "車速控制與限速特區": "Speed Management & Special Zones",
    "超速係最容易即時不及格嘅位置之一，尤其係學校區同遊樂場區。先記住數字，再記住時段。": "Speeding is the #1 instant fail on road tests. Memorize both the speed limits and active hours.",
    "限速總覽（溫哥華）": "Speed Limits Overview (Vancouver / BC)",
    "區域": "Zone",
    "限速": "Speed Limit",
    "時段 / 條件": "Active Hours / Conditions",
    "注意": "Key Caution",
    "市區預設（無標誌）": "Municipal Default (Unposted)",
    "沒有標誌時的法定上限": "Statutory limit unless posted otherwise",
    "見到標誌要以標誌為準": "Always obey posted regulatory signs",
    "學校區（School Zone）": "School Zone",
    "上課日 8am – 5pm": "School days 8:00 AM – 5:00 PM",
    "超速 1 km/h 亦可能即刻不及格": "Exceeding by 1 km/h can trigger an instant fail",
    "遊樂場區（Playground Zone）": "Playground Zone",
    "全年，黎明至黃昏（Dawn to Dusk）": "365 days, Dawn to Dusk",
    "即使冇小朋友，都要跟住限速": "Mandatory 30 km/h even if no children are visible",
    "高速公路（Highway）": "Highways / Freeways",
    "以標誌為準": "As posted (typically 80–100 km/h)",
    "匯入時需與車流同步": "Must accelerate to match traffic speed",
    "見下面匯入步驟": "See merging steps below",
    "學校區與遊樂場區": "School Zones & Playground Zones",
    "高速公路匯入（Highway Merging）": "Highway Merging Technique",
    "加速線就係用嚟加速到車流速度。唔好喺加速道末端先踩煞車。": "The on-ramp is designed for accelerating. Never stop or brake at the end of the merge lane.",
    "加速": "1. Accelerate",
    "喺加速線充分加速，接近車流速度（約 80–90 km/h）": "Accelerate firmly on the ramp to match freeway speed (80–90 km/h)",
    "打左燈": "2. Signal Left",
    "提早打燈，俾後方車知道你會切入": "Signal early to announce your intention to merge",
    "鏡子": "3. Mirrors",
    "中鏡與左側鏡，確認後方車距": "Check rearview and left side mirror for gap spacing",
    "盲點": "4. Shoulder Check",
    "扭頭望左方盲點（Shoulder Check）": "Check left blind spot over your shoulder",
    "順暢切入": "5. Merge Smoothly",
    "平穩切入車道，然後回正方向盤": "Merge smoothly into the opening and cancel your signal",
    "限速自檢": "Speed Limit Self-Check",

    // Hazard perception Module 06
    "Module 06 · 第六課": "Module 06 · Lesson 6",
    "動態危險預判問答": "Dynamic Hazard Perception Simulator",
    "考官可能會話：「Please point out the hazards you see ahead.」你要講出看到咩、可能發生咩、你會點樣處理。": "The examiner will ask: 'Please point out the hazards you see ahead.' Name what you see, what might happen, and how you will respond.",
    "互動場景：點擊找出 4 個危險": "Interactive Scene: Click to Identify 4 Hazards",
    "假設你以 50 km/h 行駛。點擊畫面上你認為有危險嘅位置（每個位置會顯示提示）。": "Assuming you are driving at 50 km/h: click areas on the scene you consider hazards.",
    "實質危險 vs 潛在危險": "Real Hazards vs. Potential Hazards",
    "實質危險（Real Hazard）": "Real Hazards (Immediate Action)",
    "已經出現、直接影響你行車安全嘅事物。必須立刻採取行動（例如減速或煞車）。": "Active hazards requiring immediate response (e.g. car braking in front, pedestrian in road).",
    "潛在危險（Potential Hazard）": "Potential Hazards (Anticipate & Prepare)",
    "現時未造成威脅，但可能突然變化嘅事物。需要提早觀察並備煞。": "Situations that could develop into real hazards (e.g. parked cars with occupants, kids near curb).",
    "回答模板：See - Think - Do 說話法": "Answering Formula: See - Think - Do",

    // Mock test Module 07
    "Module 07 · 最後一課": "Module 07 · Final Lesson",
    "即死位與模擬評分": "Instant Auto-Fails & Mock Road Test Scoring",
    "路試一旦踩中即死位，之前做得幾好都冇用。下面先檢查即死位，再用練習評分表記錄扣分。": "Hitting any automatic fail terminates the test immediately. Check auto-fails first, then tally practice demerit points.",
    "模擬結果": "Mock Test Result",
    "練習通過": "Practice Pass",
    "練習不及格": "Practice Failed",
    "不及格（即時 Fail）": "Failed (Automatic Disqualification)",
    "練習不及格（扣分過多）": "Failed (Excessive Demerits)",
    "重設評分表": "Reset Score Sheet",
    "第一部分：即死位（Automatic Fails）": "Part 1: Automatic Fails (Instant Disqualification)",
    "第二部分：練習扣分表（Demerit Points）": "Part 2: Practice Demerit Points Sheet",
    "如果喺路試中出現下面任何一項，考官會即時評定不及格。模擬時請誠實勾選。": "Committing any of these during an ICBC exam triggers immediate disqualification. Mark honestly.",
    "1. 停牌未完全停定": "1. Rolling stop at a Stop sign",
    "2. 學校區 / 遊樂場區超速": "2. Speeding in School / Playground zone",
    "3. 轉彎 / 轉線漏做 Shoulder Check": "3. Missing shoulder check when turning or changing lanes",
    "4. 車輪騎上路緣或碰到路石": "4. Mounting or bumping the curb",
    "5. 搶路權（迫使其他車減速避讓）": "5. Failing to yield right-of-way",
    "6. 殘舊綠燈衝黃燈（明明可以平穩停下）": "6. Running an amber light when able to stop safely",
    "7. 左轉等待時提前打斜車輪": "7. Turning wheels prematurely while waiting to turn left",
    "8. 斑馬線行人未過完就開車": "8. Failing to yield to pedestrians in crosswalk",
    "9. 雙手同時離開方向盤或單手手掌摸軚盤": "9. Taking both hands off wheel or palming the wheel",
    "10. 考官踩副煞車或碰方向盤介入": "10. Examiner intervention (brake or steering)"
  };

  // Convert Traditional Chinese / Cantonese to Simplified Chinese
  var ZH_DICT = {
    '自動波': '自动挡',
    '私家車': '私家车',
    '座艙': '座舱',
    '車廂': '车厢',
    '後視鏡': '后视镜',
    '方向盤': '方向盘',
    '煞車': '刹车',
    '剎車': '刹车',
    '胎壓': '胎压',
    '輪胎': '轮胎',
    '指揮燈': '转向灯',
    '車牌': '车牌',
    '路緣': '路缘',
    '踩剎': '踩刹',
    '盲點': '盲区',
    '停牌': '停牌',
    '路權': '路权',
    '泊車': '停车',
    '倒車入庫': '倒车入库',
    '調頭': '掉头',
    '三點調頭': '三点掉头',
    '危險預判': '危险预判',
    '即死位': '致命扣分位',
    '考官': '考官',
    '不及格': '不及格',
    '通關': '通关',
    '指南': '指南',
    '點樣': '如何',
    '喺': '在',
    '嘅': '的',
    '冇': '无',
    '睇': '看',
    '轉彎': '转弯',
    '轉線': '变道',
    '擰頭': '扭头',
    '斜坡': '斜坡',
    '車速': '车速',
    '時速': '时速',
    '公里': '公里',
    '練習': '练习',
    '評分': '评分',
    '扣分': '扣分',
    '清單': '清单',
    '重設': '重置',
    '完成': '完成',
    '進度': '进度',
    '首頁': '首页',
    '總覽': '总览',
    '檢查': '检查',
    '技巧': '技巧',
    '特區': '特区',
    '限速': '限速',
    '預判': '预判',
    '模擬': '模拟',
    '問答': '问答',
    '選單': '菜单',
    '搜尋': '搜索',
    '模組': '模块',
    '關鍵字': '关键词',
    '學校區': '学校区',
    '遊樂場區': '游乐场区',
    '高速公路': '高速公路',
    '平行泊車': '平行停车',
    '斜坡泊車': '斜坡停车',
    '手煞車': '手刹车',
    '低速檔': '低速挡',
    '變速箱': '变速箱',
    '儀表板': '仪表盘',
    '警示燈': '警示灯',
    '安全帶': '安全带',
    '後車窗': '后车窗',
    '擋風玻璃': '挡风玻璃',
    '雨刷': '雨刮',
    '水窪': '水洼',
    '斑馬線': '斑马线',
    '行人': '行人',
    '單車': '自行车',
    '騎乘': '骑行',
    '衝紅燈': '闯红灯',
    '衝黃燈': '闯黄灯',
    '綠燈': '绿灯',
    '紅燈': '红灯',
    '黃燈': '黄灯',
    '殘舊綠燈': '陈旧绿灯',
    '不歸點': '不归点',
    '優先權': '优先权',
    '路口': '路口',
    '十字路口': '十字路口',
    '匯入': '汇入',
    '加速線': '加速道',
    '里程碑': '里程碑',
    '路線圖': '路线图',
    '核心': '核心',
    '學習': '学习',
    '重點': '重点',
    '打勾': '勾选',
    '保存': '保存',
    '瀏覽器': '浏览器',
    '實質危險': '实质危险',
    '潛在危險': '潜在危险',
    '對頭車': '对向车',
    '直行車': '直行车',
    '橫向車': '横向车',
    '探頭': '探头观察',
    '備煞': '备刹',
    '急煞': '急刹',
    '點頭': '点头',
    '腳跟': '脚跟',
    '踏板': '踏板',
    '油門': '油门',
    '雙腳': '双脚',
    '手腕': '手腕',
    '椅背': '椅背',
    '膝蓋': '膝盖',
    '氣囊': '气囊',
    '棘爪': '棘爪',
    '引擎': '发动机',
    '制動': '制动',
    '打滑': '打滑',
    '扁胎': '瘪胎',
    '漏液': '漏液',
    '牌照': '牌照',
    '花紋': '花纹',
    '視野': '视野',
    '扇形': '扇形',
    '陰影': '阴影',
    '跟車距離': '跟车距离',
    '兩秒法則': '两秒法则',
    '車流': '车流',
    '同步': '同步',
    '切入': '切入',
    '常規': '常规',
    '致命': '致命',
    '失誤': '失误',
    '取消資格': '取消资格',
    '扣分表': '扣分表',
    '合格': '合格',
    '恭喜': '恭喜',
    '重考': '重考'
  };

  // Convert string to Simplified Chinese using vocabulary and char map
  function toSimplified(text) {
    if (!text) return text;
    var res = text;
    // Replace terms
    for (var k in ZH_DICT) {
      if (res.indexOf(k) !== -1) {
        res = res.split(k).join(ZH_DICT[k]);
      }
    }
    // High-frequency single characters
    var t2s = {
      '車': '车', '門': '门', '開': '开', '關': '关', '電': '电', '視': '视', '鏡': '镜', '後': '后',
      '點': '点', '頭': '头', '動': '动', '轉': '转', '線': '线', '發': '发', '現': '现', '變': '变',
      '規': '规', '則': '则', '權': '权', '讓': '让', '過': '过', '進': '进', '時': '时', '間': '间',
      '學': '学', '區': '区', '場': '场', '遊': '游', '樂': '乐', '員': '员', '試': '试', '驗': '验',
      '確': '确', '認': '认', '標': '标', '誌': '志', '燈': '灯', '號': '号', '險': '险', '處': '处',
      '理': '理', '與': '与', '這': '这', '樣': '样', '個': '个', '們': '们', '來': '来', '見': '见',
      '講': '讲', '話': '话', '聽': '听', '覺': '觉', '觀': '观', '察': '察', '總': '总', '覽': '览',
      '網': '网', '站': '站', '書': '书', '冊': '册', '單': '单', '雙': '双', '腳': '脚', '輪': '轮',
      '盤': '盘', '測': '测', '算': '算', '數': '数', '據': '据', '圖': '图', '畫': '画', '面': '面',
      '體': '体', '係': '是', '邊': '哪', '乜': '什么', '幾': '几', '咗': '了', '緊': '紧', '鬆': '松',
      '離': '离', '開': '开', '難': '难', '輕': '轻', '重': '重', '剛': '刚', '才': '才', '無': '无',
      '條': '条', '項': '项', '目': '目', '內': '内', '外': '外', '寬': '宽', '長': '长', '短': '短',
      '高': '高', '低': '低', '速': '速', '度': '度', '標': '标', '準': '准', '計': '计', '劃': '划'
    };
    var chars = res.split('');
    for (var i = 0; i < chars.length; i++) {
      if (t2s[chars[i]]) {
        chars[i] = t2s[chars[i]];
      }
    }
    return chars.join('');
  }

  // Node cache for restoring original text
  var textCache = new WeakMap();

  function getLang() {
    try {
      var saved = localStorage.getItem('bcdm.lang');
      return (saved === 'en' || saved === 'zh') ? saved : 'yue';
    } catch (e) {
      return 'yue';
    }
  }

  function t(text) {
    if (!text) return text;
    var lang = getLang();
    if (lang === 'en') {
      var trimmed = text.trim();
      var clean = trimmed.replace(/^[：:\s]+/, '').replace(/[：:\s]+$/, '');
      if (EN_PHRASES[clean]) return EN_PHRASES[clean];
      if (EN_PHRASES[trimmed]) return EN_PHRASES[trimmed];
      var replaced = text;
      for (var p in EN_PHRASES) {
        if (p.length > 3 && replaced.indexOf(p) !== -1) {
          replaced = replaced.split(p).join(EN_PHRASES[p]);
        }
      }
      return replaced;
    }
    if (lang === 'zh') {
      return toSimplified(text);
    }
    return text;
  }

  function setLang(lang) {
    try {
      localStorage.setItem('bcdm.lang', lang);
    } catch (e) {}
    apply(lang);
    window.dispatchEvent(new CustomEvent('bcdm:langchange', { detail: { lang: lang } }));
  }

  function apply(lang) {
    lang = lang || getLang();
    var meta = LANGS.filter(function (l) { return l.code === lang; })[0] || LANGS[0];

    // 1. Update HTML lang
    document.documentElement.lang = meta.htmlLang;

    // 2. Update Header & Footer
    var ui = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.yue;
    var curPage = location.pathname.split('/').pop() || 'index.html';
    if (!curPage.endsWith('.html')) curPage = 'index.html';

    // Banner
    var banner = document.querySelector('#site-header .bg-amber-500 span span');
    if (banner) banner.textContent = ui.banner_text;
    var bannerTag = document.querySelector('#site-header .bg-amber-500 .font-mono');
    if (bannerTag) bannerTag.textContent = ui.banner_tag;

    // Site sub
    var sub = document.querySelector('#site-header p.text-xs');
    if (sub) sub.textContent = ui.site_sub;

    // Demerit button
    var demeritBtn = document.querySelector('#site-header a[href*="mock-test.html"] span');
    if (demeritBtn) demeritBtn.textContent = ui.btn_demerit;

    // Nav links
    document.querySelectorAll('#site-header nav a, #site-header details div a').forEach(function (a) {
      var href = a.getAttribute('href').replace('./', '');
      if (ui.nav[href]) {
        a.textContent = ui.nav[href];
      }
    });

    // Language button label
    document.querySelectorAll('[data-lang-label]').forEach(function (el) {
      el.textContent = meta.label;
    });
    document.querySelectorAll('[data-lang-check]').forEach(function (el) {
      var c = el.getAttribute('data-lang-check');
      el.classList.toggle('hidden', c !== lang);
    });

    // Footer
    var footTitle = document.querySelector('#site-footer footer p.font-semibold');
    if (footTitle) footTitle.textContent = ui.footer_title;
    var footSub = document.querySelector('#site-footer footer p.text-xs');
    if (footSub) footSub.textContent = ui.footer_sub;

    // Search input placeholder
    var searchInput = document.getElementById('search');
    if (searchInput) {
      searchInput.placeholder = ui.search_placeholder;
    }
    var searchEmpty = document.getElementById('search-empty');
    if (searchEmpty) {
      searchEmpty.textContent = ui.search_empty;
    }

    // 3. Translate main body content
    var main = document.querySelector('main');
    var hero = document.querySelector('.gradient-hero');
    var targets = [];
    if (hero) targets.push(hero);
    if (main) targets.push(main);

    targets.forEach(function (root) {
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
      var node;
      while ((node = walker.nextNode())) {
        var raw = node.nodeValue;
        if (!raw || !raw.trim()) continue;

        // Cache original text
        if (!textCache.has(node)) {
          textCache.set(node, raw);
        }
        var orig = textCache.get(node);

        if (lang === 'yue') {
          node.nodeValue = orig;
        } else if (lang === 'zh') {
          node.nodeValue = toSimplified(orig);
        } else if (lang === 'en') {
          var trimmed = orig.trim();
          var clean = trimmed.replace(/^[：:\s]+/, '').replace(/[：:\s]+$/, '');
          var prefix = trimmed.startsWith('：') ? ': ' : (trimmed.startsWith(':') ? ': ' : '');

          if (EN_PHRASES[clean]) {
            node.nodeValue = prefix + EN_PHRASES[clean];
          } else {
            // Check substrings for headings/labels
            var replaced = orig;
            var matched = false;
            for (var phrase in EN_PHRASES) {
              if (phrase.length > 3 && replaced.indexOf(phrase) !== -1) {
                replaced = replaced.split(phrase).join(EN_PHRASES[phrase]);
                matched = true;
              }
            }
            node.nodeValue = matched ? replaced : orig;
          }
        }
      }
    });

    // Re-create icons in case any were altered
    if (window.lucide && window.lucide.createIcons) {
      window.lucide.createIcons();
    }
  }

  // Create Language Dropdown HTML markup
  function createDropdownMarkup() {
    var cur = getLang();
    var curMeta = LANGS.filter(function (l) { return l.code === cur; })[0] || LANGS[0];

    var items = LANGS.map(function (l) {
      var isCur = l.code === cur;
      return (
        '<button type="button" data-switch-lang="' + l.code + '" class="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-medium flex items-center justify-between text-xs text-slate-700 transition">' +
          '<span>' + l.flag + ' ' + l.label + '</span>' +
          '<span data-lang-check="' + l.code + '" class="text-blue-600 font-bold ' + (isCur ? '' : 'hidden') + '">✓</span>' +
        '</button>'
      );
    }).join('');

    return (
      '<details class="relative inline-block text-left" id="lang-details">' +
        '<summary class="list-none cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition select-none">' +
          '<i data-lucide="globe" class="w-4 h-4 text-blue-600"></i>' +
          '<span data-lang-label>' + curMeta.label + '</span>' +
          '<i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400"></i>' +
        '</summary>' +
        '<div class="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-50 flex flex-col gap-0.5">' +
          items +
        '</div>' +
      '</details>'
    );
  }

  function initSwitcher() {
    // Attach click listeners
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-switch-lang]');
      if (btn) {
        var targetLang = btn.getAttribute('data-switch-lang');
        setLang(targetLang);
        // Close dropdown
        var details = document.getElementById('lang-details');
        if (details) details.removeAttribute('open');
      } else {
        // Click outside details closes it
        var details = document.getElementById('lang-details');
        if (details && details.hasAttribute('open') && !details.contains(e.target)) {
          details.removeAttribute('open');
        }
      }
    });

    // Apply on load
    apply(getLang());
  }

  window.BCDM_I18N = {
    LANGS: LANGS,
    getLang: getLang,
    setLang: setLang,
    apply: apply,
    t: t,
    createDropdownMarkup: createDropdownMarkup,
    initSwitcher: initSwitcher
  };

})(window);

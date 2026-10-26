// All project content lives here. Numbers come from the Daily Logs, the
// CarRacing README, the TurtleBot3 write-up and the trading_rl logs in
// C:\AI Testing, and from the gomi_app logs in C:\Personal\extra projects.

export type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][]; caption?: string }
  | {
      type: "figure";
      src: string;
      alt: string;
      caption: string;
      width: number;
      height: number;
    }
  | {
      type: "pair";
      items: { src: string; poster?: string; alt: string; label: string; width: number; height: number }[];
      caption: string;
    }
  | { type: "gridworld" }
  | { type: "code"; id: string; caption?: string }
  | { type: "quote"; text: string };

export type Section = { heading: string; blocks: Block[] };

export type Media = {
  src: string;
  poster: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  pixelated?: boolean;
};

export type Project = {
  slug: string;
  title: string;
  short: string;
  group: "rl" | "nara" | "earlier";
  when?: string;
  role: string;
  stack: string[];
  links?: { label: string; href: string }[];
  showcase?: {
    kind: "video" | "image";
    src: string;
    poster?: string;
    alt: string;
    label: string;
    width: number;
    height: number;
  }[];
  showcaseCaption?: string;
  media?: Media;
  stats?: { value: string; label: string }[];
  intro: string;
  sections: Section[];
};

export const projects: Project[] = [
  {
    slug: "gomi-rubbish-app",
    title: "Gomi, rubbish sorting for foreigners",
    short:
      "An Android app that tells you which bin something goes in and when it gets collected, using Yamatokoriyama City's official rules.",
    group: "nara",
    when: "22 Oct 2026",
    role: "Solo",
    stack: [
      "Flutter",
      "Dart",
      "Google ML Kit (Japanese text recognition)",
      "Local notifications",
      "Python + PyMuPDF (data pipeline)",
      "Claude API (optional)",
    ],
    showcase: [
      {
        kind: "image",
        src: "/phones/gomi-week.png",
        alt: "Week screen: the next collection is Burnable 燃えるごみ on Monday 26 October, out by 7:30 a.m., with non-burnable on Wednesday 4 November and PET bottles on Wednesday 11 November coming up.",
        label: "this week",
        width: 720,
        height: 1520,
      },
      {
        kind: "image",
        src: "/phones/gomi-search.png",
        alt: "Search for battery: dry-cell, button, lithium-ion, rechargeable and coin batteries and power banks are Hazardous rubbish; car batteries are not collected by the city.",
        label: "search, English or Japanese",
        width: 720,
        height: 1520,
      },
      {
        kind: "image",
        src: "/phones/gomi-item.png",
        alt: "Button battery ボタン電池: Hazardous rubbish, a Newer city guidance note, three steps (tape both ends, battery box or bulky-rubbish day, never in any other bag) and the source checked 22 Oct.",
        label: "item, with its source",
        width: 720,
        height: 1520,
      },
      {
        kind: "image",
        src: "/phones/gomi-pet.png",
        alt: "PET bottles ペットボトル: collected on the 2nd Wednesday, next on 11 November, then 9 December, 13 January, 10 February and 10 March, with three steps: cap off, rinse, label off.",
        label: "category and dates",
        width: 720,
        height: 1520,
      },
      {
        kind: "image",
        src: "/phones/gomi-scan.png",
        alt: "Scan screen: the camera preview with a guide box and the instruction to fill the box with the mark, above a Scan mark button.",
        label: "recycling-mark scanner",
        width: 720,
        height: 1520,
      },
    ],
    showcaseCaption:
      "Screenshots from the release build on the Android emulator. Names are always in English and Japanese, so you can match them to the signs and bags.",
    stats: [
      { value: "455", label: "items from the city's sorting dictionary, searchable in English, kanji or kana" },
      { value: "137", label: "automated tests, including every holiday and New Year change to the collection days" },
      { value: "8 / 17", label: "real recycling-mark photos the scanner got right, with no false alarms on 10 photos without a mark" },
    ],
    intro:
      "When I got to Japan, rubbish was the first thing that confused me. Every city has its own rules, they're all in Japanese, and if you put out the wrong bag on the wrong day, it just gets left there with a sticker on it. So I made an app that tells me two things: which category something is, and when that category gets collected. My one rule was that everything in it has to come from the city's own website. If I can't confirm something, the app says so instead of guessing.",
    sections: [
      {
        heading: "Which city am I even in?",
        blocks: [
          {
            type: "p",
            text: "My college, NIT Nara College, is actually in Yamatokoriyama City (大和郡山市), not Nara City (奈良市), and the two have different rules. When I searched online, most results were for Nara City, or for Koriyama City in Fukushima (郡山市), which just has a similar name. I didn't use any of those. Everything in the app comes from city.yamatokoriyama.lg.jp.",
          },
          {
            type: "list",
            items: [
              "Burnable rubbish goes out twice a week. Which two days depends on which side of the Kintetsu Kashihara Line and Route 25 you live. The area around my college is Monday and Thursday.",
              "Plastic packaging (プラ) counts as burnable here, and cans and bottles count as non-burnable. A lot of cities do it differently, so I really couldn't copy rules from anywhere else.",
              "Non-burnable rubbish goes out once a month, on a day that depends on your neighbourhood. The city's timetable has 12 groups, and the college dorm (高専寮) is listed by name in the 1st Wednesday group.",
              "The city doesn't publish the days for bulky and hazardous rubbish, because each neighbourhood association (自治会) decides its own. So instead of making up a date, the app tells you to ask your 自治会.",
            ],
          },
          {
            type: "figure",
            src: "/figures/gomi_sources.png",
            alt: "The app's Official sources screen: collection days, the area map, the FY2026 holiday schedule, the non-burnable timetable PDF and the sorting leaflet, each with its Japanese title, its city URL and the date it was checked.",
            caption: "Every rule in the app links to the city page it came from, with the date I checked it.",
            width: 720,
            height: 780,
          },
        ],
      },
      {
        heading: "Getting the rules out of PDFs",
        blocks: [
          {
            type: "list",
            items: [
              "The city's leaflet is a Japanese PDF, and the first PDF tool I tried couldn't read the Japanese text at all. PyMuPDF could.",
              "The non-burnable timetable is a scanned image, so there's no text to copy. The dates had to be copied from the page images by hand, so I had a script check every one. Each date has to land on the right weekday for its group, like “1st Wednesday”, unless the PDF has a note next to it. None of them failed.",
              "The sorting dictionary is 448 rows over 20 pages. A script counts the rows on each page and compares them with the PDF, so I know nothing got skipped.",
              "A Python script puts the rules, the dictionary, the timetable and Japan's public holidays into one file per city. To add another city, I only need to add its data.",
            ],
          },
        ],
      },
      {
        heading: "When the city disagrees with itself",
        blocks: [
          {
            type: "p",
            text: "While checking batteries, I found two official pages that said different things. The sorting dictionary from March 2024 says button batteries and lithium-ion batteries aren't collected, and you should ask the shop. The city's battery page, updated on 1 October 2026, says they're hazardous rubbish or go in the battery collection boxes.",
          },
          {
            type: "p",
            text: "I went with the newer page, but I didn't want the app to change the answer quietly. It shows a “Newer city guidance” note that explains what changed and links to the newer page. I also added 7 items that only appear on the newer pages, like power banks and PET bottle caps.",
          },
          {
            type: "p",
            text: "Then that fix caused a bug. On the button battery page, the new “hazardous” box showed up, but further down, the old note still said to ask the shop. Now when a newer page overrides an item, the old note gets removed.",
          },
        ],
      },
      {
        heading: "The camera doesn't work that well yet",
        blocks: [
          {
            type: "p",
            text: "Packaging in Japan has recycling marks printed on it, like プラ, PET, 紙, アルミ and スチール. The Scan tab reads them with Google's Japanese text recognition, which runs on the phone, so it works offline. If it can't find a mark it knows, it tells you to use Search. It never guesses a category.",
          },
          {
            type: "table",
            head: ["Test images", "Read correctly"],
            rows: [
              ["Real photos and drawings of marks", "8 / 17"],
              ["Generated marks", "36 / 49"],
              ["Images with no mark (false alarms)", "0 / 10"],
            ],
            caption: "Tested on the emulator with the real text recogniser. The real images are from Wikimedia Commons.",
          },
          {
            type: "list",
            items: [
              "Most of the misses weren't wrong readings. The recogniser just didn't find any text, usually when the mark was small or inside the recycling arrows.",
              "I added a box on the camera screen to line the mark up with, and a second try that zooms into that box. That took real images from 7 to 8 out of 17, and generated ones from 28 to 36 out of 49. Zooming into the whole photo didn't help, so I dropped that.",
              "Some wrong readings were easy to fix. アルミ came back as カルミ, and 紙パック as 紙バック, so now パ and バ count as the same when matching.",
              "One fix caused a false alarm. ペットフード (pet food) got read as ペットフート and matched PET. Now the words it should ignore are matched without the small dakuten marks, and that fixed it.",
            ],
          },
          {
            type: "p",
            text: "Getting about half of the real images right isn't good enough yet. Next I want to test it on my own photos of packaging I actually throw away.",
          },
        ],
      },
      {
        heading: "Reminders, and bugs I found by looking",
        blocks: [
          {
            type: "figure",
            src: "/figures/gomi_notification.png",
            alt: "An Android notification from Gomi: Tomorrow: Burnable 燃えるごみ. Put it out by 7:30 a.m., followed by the same in Japanese.",
            caption: "A real reminder going off on the emulator. This was the first build, before I made the app icon.",
            width: 1080,
            height: 345,
          },
          {
            type: "list",
            items: [
              "The night before a collection, you get a notification saying what goes out tomorrow. The app handles the 2nd and 4th Wednesday rules, holidays and the New Year break. For example, PET collection on 23 September 2026 moves to 30 September. If a usual collection day is cancelled, the week screen says why.",
              "The camera permission popped up as soon as the app opened. Every tab was being loaded at start-up, so the Scan tab thought it was on screen. Now each tab knows whether it's actually showing.",
              "At 08:08 the home screen still said “Today: Burnable, out by 7:30 a.m.”, which was already too late. Now after 7:30 it moves on to the next collection day.",
              "And the old battery note from earlier. The tests didn't catch any of these. I only found them by going through every screen on the emulator.",
            ],
          },
        ],
      },
      {
        heading: "Too much text",
        blocks: [
          {
            type: "p",
            text: "The first version had the right rules, but every screen had paragraphs of official text in two languages, and honestly it was annoying to read. So I redesigned it so each screen does one thing. Each category now has 2 or 3 short steps, each one shortened from an official sentence and still linked to its source. The full official wording is one tap away, and the Japanese rules are behind a switch, or you can turn them on everywhere in Settings.",
          },
        ],
      },
      {
        heading: "Optional: an AI photo check",
        blocks: [
          {
            type: "p",
            text: "For things without a mark, the app can send a photo to Claude Haiku, a cheap and fast AI model that can read images. It can only pick from this city's categories. The app labels the answer “AI suggestion, may be wrong”, shows the city's actual rule under it, and warns you if the city's dictionary disagrees.",
          },
          {
            type: "p",
            text: "It asks before sending any photo, and the button only shows up if the app was built with an API key. I've tested it with fake responses, and once against the real API with a wrong key, to check the error shows up properly. I haven't tried it with a real key yet.",
          },
        ],
      },
      {
        heading: "What's next",
        blocks: [
          {
            type: "list",
            items: [
              "Test the scanner with photos from my own phone.",
              "Ask the dorm whether it even uses the city's collection points.",
              "Update the timetable when the city publishes the April 2027 one. Until then, dates after 31 March 2027 show as unverified.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "rl-trading",
    title: "Putting RL trading to the test",
    short:
      "PPO agents that trade currencies, tested against doing nothing and against simple rules, on simulated and real data. None of them had a real edge after costs.",
    group: "nara",
    when: "Oct 2026, ongoing",
    role: "Solo side project",
    stack: ["Python", "Stable-Baselines3 (PPO)", "Gymnasium", "NumPy", "scikit-learn", "matplotlib"],
    stats: [
      { value: "27 years", label: "of real EUR/USD tested, plus six more currency pairs" },
      { value: "19", label: "automated checks a result had to pass before I trusted it" },
      { value: "0", label: "strategies with a reliable edge on real currency data after trading costs" },
    ],
    intro:
      "I wanted an AI that could trade for me. Most RL trading projects online report big profits that don't survive new data, so I did the opposite: I built reinforcement learning agents that trade currencies, then tried hard to prove them wrong. Across a simulated market, 27 years of real EUR/USD, seven currency pairs, support and resistance zones and a popular YouTube strategy, nothing beat simple baselines after trading costs. This page is how I found that out. Backtesting and paper trading only, no real money.",
    sections: [
      {
        heading: "The rules I held myself to",
        blocks: [
          {
            type: "list",
            items: [
              "Always compare with doing nothing (staying out of the market), and with random entries that use the same stops and targets. A strategy has to beat both to count.",
              "Test on data the model never saw. Data is split by time, never shuffled, and the test years stay untouched until the end.",
              "Include trading costs in every result.",
              "Train 5 seeds per setup and report the spread, not the best one.",
              "Write down a prediction before each run, then compare.",
              "Treat a result that looks too good as a bug until proven otherwise.",
              "Pass 19 automated checks before trusting anything, including look-ahead tests (changing future prices must not change any decision) and the environment's reward matching an independent backtest exactly.",
            ],
          },
        ],
      },
      {
        heading: "A market where I know the answer",
        blocks: [
          {
            type: "p",
            text: "First, a simulated EUR/USD-like price with hidden up and down trends lasting about 50 steps each, where the trend is 12 times smaller than the noise, like real markets. The agent picks short, flat or long each step and earns the next step's price move minus a 1 pip cost. Because the market is simulated, I could also build an “oracle” that knows the hidden trend, which shows the best realistic result.",
          },
          {
            type: "list",
            items: [
              "Run 1 memorised its training data. Its training reward reached about +95% a year, while the oracle's ceiling is about +13%. It had seen each training step about 70 times and learned that one path's noise, then lost 15.5% on test data. Fix: a brand-new simulated path every episode.",
              "Given raw price changes as input, PPO never found the trend, even with 4 times more training (2M steps). It traded on almost every step and lost to costs.",
              "Giving it three trend averages (over 10, 50 and 100 steps) fixed it. Trades fell from about 1,050 to about 80 per test period. The inputs mattered more than the training time.",
            ],
          },
          {
            type: "figure",
            src: "/figures/trading_sweep.png",
            alt: "Line chart of Sharpe ratio against pattern strength 0, 1, 2, 4 and 8. The oracle rises to about 9.8, PPO to about 7.8, the moving-average rule to about 6.4, buy and hold stays near 1. PPO is below the moving-average rule up to strength 2 and above it from strength 4.",
            caption: "Making the hidden trend louder. PPO only overtakes a moving-average rule from strength 4, where the trend is a third of the noise.",
            width: 1350,
            height: 825,
          },
          {
            type: "p",
            text: "A fair comparison then changed my conclusion. On 200 fresh test paths, PPO first looked better than the moving-average rule I'd been using. But that rule had been tuned on a single path. Tuned on its own 200 paths, the best moving-average rule scored +0.129, and PPO +0.123: a tie.",
          },
          {
            type: "figure",
            src: "/figures/trading_fair_test.png",
            alt: "Dot plot of mean log return over 200 test paths: flat 0, buy and hold +0.02, MA 10/100 +0.09, oracle +0.69, PPO with raw returns −0.05, PPO with trend features +0.12.",
            caption: "Before the fair re-tune: PPO with trend features (+0.12) ahead of the MA 10/100 rule (+0.09). The re-tuned MA 5/50 rule caught up.",
            width: 1350,
            height: 720,
          },
          {
            type: "figure",
            src: "/figures/trading_robustness.png",
            alt: "PPO minus the tuned moving-average rule in 8 market settings, with 95% intervals. Every interval crosses zero except double the trend, where PPO is about 0.05 to 0.06 behind.",
            caption: "In 7 market settings it never trained on, PPO tied the tuned rule, except with twice-as-strong trends, where it fell behind. Training on randomised markets didn't fix that.",
            width: 1425,
            height: 900,
          },
          {
            type: "p",
            text: "To see what PPO had learned, I fitted a small decision tree to its choices. A depth-3 tree copies it almost exactly: stay in your position until both the 10-step and 50-step trends turn clearly against you. One trap here: a tree can agree with the agent on 95% of steps and still never trade, because the agent keeps its position most of the time. An extracted rule has to be judged by playing it, not by how often it agrees.",
          },
          {
            type: "quote",
            text: "Verdict: PPO learned a sensible trend-following rule from scratch, about as good as a well-tuned moving-average crossover, and no better.",
          },
        ],
      },
      {
        heading: "Real EUR/USD and six more pairs",
        blocks: [
          {
            type: "p",
            text: "Then real daily EUR/USD from 1999 to 2026, split into training (1999-2016), validation (2017-2020) and test (2021-2026), then six more major pairs. The strategies trained only on the simulator had never seen any real data, so I could score them on the whole history.",
          },
          {
            type: "figure",
            src: "/figures/trading_real_history.png",
            alt: "Cumulative log return on real EUR/USD from 1999 to 2026 for buy and hold, MA 5/50, momentum 40 and two PPO variants. All end between +0.07 and +0.25; the trend rules rise until about 2011, then go sideways.",
            caption: "Strategies tuned or trained only on the simulator, run on 27 years of real EUR/USD. Trend following made almost all its gains before 2011, then went nowhere for 15 years.",
            width: 1650,
            height: 825,
          },
          {
            type: "list",
            items: [
              "One price history can't separate these strategies. Over the 6-year test period, the uncertainty on the difference between two strategies was about ±0.16 log return. Telling apart two strategies whose Sharpe ratios differ by 0.1 would take roughly 400 years of data.",
              "Seven pairs aren't seven times the evidence. They all trade against the US dollar and move together, and I measured them as worth about 2.6 independent histories.",
              "PPO trained on real 1999-2016 data overfitted (+8 to 10% a year on training data). Choosing its checkpoint on 2017-2020 picked a “mostly long” model, because the euro happened to rise then, and it lost when the euro fell in 2021-2026.",
            ],
          },
          {
            type: "figure",
            src: "/figures/trading_pairs.png",
            alt: "Bar chart of Sharpe ratios for five strategies on seven currency pairs and an equal-weight portfolio of all seven. Results are mixed in sign on every pair, and the portfolio bars are all close to zero.",
            caption: "Across seven pairs, trend following was positive on only 2 or 3. EUR/USD had been the lucky pair.",
            width: 1650,
            height: 825,
          },
        ],
      },
      {
        heading: "Support and resistance",
        blocks: [
          {
            type: "p",
            text: "I'm a beginner trader. I paper trade on TradingView and mostly follow the trend, and I didn't know how to mark support and resistance zones myself. So before learning to, I tested whether they work at all. I built a zone finder (swing highs and lows grouped into zones, plus unfilled fair value gaps) on 16 years of hourly data.",
          },
          {
            type: "figure",
            src: "/figures/trading_zones.png",
            alt: "Hourly EUR/USD candles from 22 to 30 September 2026 with shaded support zones, resistance zones and bullish and bearish fair value gaps, each labelled with the number of swings in it.",
            caption: "What the zone finder marks on an hourly chart. Each zone uses only prices known at that moment.",
            width: 1800,
            height: 900,
          },
          {
            type: "list",
            items: [
              "Zones and fair value gaps didn't make price bounce more often than random levels of the same width, on 4-hour or 1-hour charts.",
              "The first test said random levels “bounced” 75% of the time. The bounce measure was uneven depending on the zone's width, so real zones are now compared against fake zones of the same width, and the measure was checked as unbiased on random walks.",
              "Rule-based strategies flipped with the market. Breakout rules were the best in 1999-2016 and lost money on every setting in 2017-2026. The settings that looked best on the past did worst afterwards.",
            ],
          },
          {
            type: "figure",
            src: "/figures/trading_sr_rules.png",
            alt: "Sharpe ratios on 2017-2026 for three support and resistance rules, buy and hold and two trend rules, across seven pairs. Every 95% interval crosses zero; the breakout rule is the worst at about −0.63.",
            caption: "Settings tuned on 1999-2016, tested on 2017-2026 across all seven pairs.",
            width: 1500,
            height: 750,
          },
          {
            type: "p",
            text: "Finally an RL bot that sees the zones. As a control, an identical bot was given fake zones, taken from 4 months earlier. Five seeds each, tested on 2024-2026.",
          },
          {
            type: "figure",
            src: "/figures/trading_sr_bot.png",
            alt: "Account value from January 2024 to September 2026 for ten PPO bots, five with real zones and five with fake zones, plus an always-long rule and a trend rule. The real and fake bots are mixed together, ending between about 0.55 and 1.2.",
            caption: "Real zones (blue) and fake zones (purple) can't be told apart. Both made a little before costs and lost it to the spread over about 1,500 trades.",
            width: 1650,
            height: 825,
          },
          {
            type: "p",
            text: "Training on four pairs instead of one cut trading by a third and reduced losses on those pairs, but didn't help on a pair it had never seen (USD/CAD).",
          },
        ],
      },
      {
        heading: "A YouTube “65% win rate” strategy",
        blocks: [
          {
            type: "p",
            text: "A popular day-trading video (about 690k views) claimed a 50 EMA break-and-pullback strategy won 21 of 32 trades on AUD/JPY 4-hour charts from 2020 to 2024, with a 2:1 target. I wrote its rules as exact code, noted every place I had to interpret them, and added a control: the same trades with random directions. With a 2:1 target, a strategy with no edge wins about 33%.",
          },
          {
            type: "table",
            head: ["Test", "Trades", "Won", "Per trade, after costs"],
            rows: [
              ["The video's claim", "32", "65%", ""],
              ["My code, same pair, chart and years", "29", "34%", "+0.02R"],
              ["Random directions on those entries", "29", "38%", "+0.13R"],
              ["6 pairs, 1h and 4h charts, 2010-2026", "2,702", "35%", "+0.02R"],
            ],
            caption: "R is the amount risked on a trade, so +0.02R is about break-even.",
          },
          {
            type: "list",
            items: [
              "My version finds the setups at about the same rate as the video, but wins half as often.",
              "The rules are vague in places, so I tried 12 readings of them. The best won 46% on the video's data, then 34% on the other pairs and years. Picking the best of many variants makes results that vanish on new data, which is likely how many impressive backtests are made.",
              "Practising the strategy on a replay chart, I spotted a sell signal with no EMA cross anywhere on screen. Tracing it showed the break had happened 8 hours earlier: the video never says how soon the pullback has to come, and my code waited forever. I chose a limit of 12 candles before seeing any results. With it, the video's own data gave 28 trades and 29% won, at −0.15R a trade, and all 6 pairs gave 2,508 trades and 34% won. The verdict didn't change.",
            ],
          },
          {
            type: "quote",
            text: "Verdict: the claimed result did not replicate.",
          },
        ],
      },
      {
        heading: "Bugs and traps I caught",
        blocks: [
          {
            type: "table",
            head: ["What looked wrong", "Cause", "Fix"],
            rows: [
              ["Training reward of +95% a year, 7 times the best possible", "The agent memorised its single training path", "A new simulated path every episode"],
              ["The raw-return agent traded on almost every step", "It couldn't average 50 noisy returns by itself", "Trend-average inputs"],
              ["A “Saved” message, but no file", "An edit by line number had replaced the save call", "Fixed, and output files are now checked"],
              ["A 109-pip-wide “resistance zone”", "Zone merging chained a whole sideways range into one zone", "Zones capped at 1 ATR wide; the earlier test was thrown out"],
              ["Random levels “bounced” 75% of the time", "The bounce measure was uneven by zone width", "Compared against width-matched fake zones"],
              ["Real-zone bots beat fake ones at their best checkpoints", "Luck in picking checkpoints", "Final models showed no difference"],
              ["Data with 16% one-day spikes", "Bad prices in Yahoo's FX data", "Switched to Dukascopy, checked against FRED (0.979 correlation)"],
              ["A 46% win rate for one reading of the rules", "Picked from 12 variants on the same data", "Tested on other pairs: 34%"],
            ],
          },
        ],
      },
      {
        heading: "My predictions against the results",
        blocks: [
          {
            type: "table",
            head: ["Experiment", "My prediction", "Result"],
            rows: [
              ["Run 1, one fixed training path", "Below the moving-average rule", "Right: −15.5% against +14%"],
              ["Run 2, fresh paths", "Stops flipping every step, still below MA", "Half right: still about 1,050 trades, below MA"],
              ["Trend-strength sweep", "PPO beats MA only beyond strength 8", "Earlier than expected: from strength 4"],
              ["Seven currency pairs", "PPO ties MA; trend following positive on most pairs", "Half right: PPO ties MA, but positive on only 2 or 3 of 7"],
              ["Breakout against bounce", "Breakout wins", "True for 1999-2016, false for 2017-2026"],
              ["Zones against fake zones", "Real zones bounce more", "Not supported"],
              ["RL bot, real against fake zones", "Real zones win", "No reliable difference"],
            ],
          },
        ],
      },
      {
        heading: "Limits, and what's running now",
        blocks: [
          {
            type: "list",
            items: [
              "My support and resistance is one mechanical definition. A human marks zones with judgement.",
              "Costs of half a pip each way are optimistic for many retail brokers.",
              "Since 23 October 2026 a live paper-trading test has been running: five frozen support and resistance bots and a trend rule on live hourly EUR/USD, using the same mechanics as the backtest, logged to a ledger that's only ever added to.",
              "Next idea: use RL to decide position size instead of direction. Volatility is far more predictable than price direction, so a sizing agent has a real, stable pattern to learn.",
            ],
          },
        ],
      },
      {
        heading: "What I learned",
        blocks: [
          {
            type: "list",
            items: [
              "A training result that beats the best possible strategy is a bug, not a breakthrough.",
              "One price history can't prove a trading strategy. The comparison that matters is paired: the same data and the same costs, against doing nothing and against random entries.",
              "Inputs mattered more than training time: 4 times more training didn't help raw returns, while three trend averages did.",
              "Trying many variants and keeping the best one creates results that disappear on new data.",
              "Most of the real work was building the baselines, controls and checks.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "turtlebot3-lidar-robot",
    title: "Crash or carry on: training a LiDAR robot",
    short:
      "My own 2D simulator for a TurtleBot3 Burger and two reward designs, checked in Gazebo through ROS 2, tested with people walking through the room, and finally run on a real robot.",
    group: "rl",
    when: "22-30 Sep 2026",
    role: "Solo",
    stack: [
      "Python",
      "Gymnasium",
      "Stable-Baselines3 (PPO)",
      "ROS 2 Humble",
      "Gazebo Classic",
      "WSL2 / Ubuntu 22.04",
    ],
    stats: [
      { value: "59 / 60", label: "Gazebo episodes with the same outcome as my simulator" },
      { value: "53.7 → 87.3%", label: "wall arm on hard starts, after hard-start training" },
      { value: "3 / 5", label: "goals reached on a real FastBot robot, driven remotely" },
    ],
    intro:
      "When a robot hits a wall during training, should the episode end with a penalty, or should the robot be penalised gradually for getting close and allowed to carry on? I compared the two on a simulated TurtleBot3 Burger that only has its LiDAR and the direction to a goal.",
    sections: [
      {
        heading: "Why I built my own simulator",
        blocks: [
          {
            type: "p",
            text: "The robot decides 5 times a second, so 500,000 training steps is about 27 hours of simulated time. Gazebo runs at roughly real time. A 2D simulator made of line segments runs thousands of steps a second, which is what made 3 seeds per arm possible. Gazebo became the check at the end instead of the training ground.",
          },
          {
            type: "p",
            text: "BurgerEnv is matched to the Burger's Gazebo model using ROBOTIS's own model file and the Gazebo drive plugin's source: a 360-reading LiDAR from 0.12 to 3.5 m with 1 cm noise, mounted 3.2 cm behind the centre, and wheels that accelerate at 1.0 m/s². Each episode generates a new 5 × 5 m room with 2 to 5 rectangular obstacles, a random start and a random goal. A flood fill over the generated layouts found the goal inside an obstacle in 10 of 200, so I added a check. After that, all 200 were solvable.",
          },
        ],
      },
      {
        heading: "What the policy sees and does",
        blocks: [
          {
            type: "list",
            items: [
              "Observation, 105 numbers: the LiDAR cut into 50 sectors over the 270° in front (closest reading in each) for the current and previous scan, the measured speed and turn rate, and the distance and direction to the goal as sine and cosine.",
              "Action: a forward speed from 0 to 0.22 m/s, and a turn given as a fraction of the maximum allowed at that speed.",
              "Shared reward: +20 per metre of progress toward the goal, +100 on arrival, −0.2 per step, and a small penalty for jerky turning.",
            ],
          },
          {
            type: "table",
            head: ["", "Wall arm", "Graded arm"],
            rows: [
              ["Hitting a wall", "episode ends, −50", "robot is stopped, episode continues"],
              ["Near a wall", "nothing", "up to −2 per step when closer than 0.3 m"],
            ],
            caption: "The only difference between the two arms.",
          },
          {
            type: "p",
            text: "PPO, 8 parallel environments, 3 seeds per arm. Every model is scored on the same 200 held-out layouts that never appear in training.",
          },
        ],
      },
      {
        heading: "Result 1: they fail in different ways, every time",
        blocks: [
          {
            type: "p",
            text: "The wall arm fails by crashing. The graded arm never ends an episode on contact, so it fails by getting pinned against an obstacle until time runs out. This held in every setting I tried: both penalty strengths, the Gazebo-matched simulator, hard-start training and Gazebo itself. For a real robot, getting stuck is the better failure, since someone can rescue it.",
          },
          {
            type: "figure",
            src: "/figures/1_failure_modes.png",
            alt: "Bar chart. Wall arm: 89.7% reached goal, 10.2% crashed, 0.2% ran out of time. Graded arm: 91.7% reached goal, 0% crashed, 8.3% ran out of time.",
            caption: "Share of 600 test episodes (3 seeds × 200 layouts) on the Gazebo-matched simulator.",
            width: 1205,
            height: 567,
          },
          {
            type: "figure",
            src: "/figures/4_trajectories.png",
            alt: "Two top-down room plans with the same start and goal. The wall-arm robot drives into a box and crashes after 66 steps. The graded-arm robot takes the same route and stays pressed against the box for 300 steps.",
            caption: "Both robots take the same route from the same start. Only what happens at the box differs.",
            width: 1448,
            height: 729,
          },
        ],
      },
      {
        heading: "Result 2: the success-rate gap doesn't hold",
        blocks: [
          {
            type: "p",
            text: "At the base penalty strength the graded arm reached the goal slightly more often, 91.7% against 87.8%. With every penalty doubled the gap disappeared: 90.3% against 90.2%, and the graded arm's seeds became much less consistent (95.5%, 92.5%, 82.5%). Neither arm is reliably better at reaching the goal, so that isn't the finding. The failure modes are.",
          },
        ],
      },
      {
        heading: "Result 3: hard starts help, beyond just training longer",
        blocks: [
          {
            type: "p",
            text: "After watching the robot crash in Gazebo when it started next to a box, I fine-tuned with half of all episodes starting 0.2 to 0.4 m from an obstacle that blocks the way to the goal. A control group got the same extra steps with normal starts, so I could separate the effect of hard starts from the effect of more training.",
          },
          {
            type: "figure",
            src: "/figures/2_hard_starts.png",
            alt: "Line chart of success rate when every test episode starts hard. Wall arm: 53.7% originally, 84.8% after 200k hard-start steps, 87.3% after 400k, versus 74.2% and 81.0% with normal starts. Graded arm: 71.0% originally, 87.5% and 89.3% with hard starts, versus 83.2% and 85.7% with normal starts.",
            caption: "Success rate on a test set where every start is hard. Solid lines trained with hard starts, dashed with normal starts.",
            width: 1064,
            height: 721,
          },
          {
            type: "list",
            items: [
              "About 20 of the wall arm's first 31-point gain came from the extra training alone. The control run is what showed that.",
              "At equal budgets (+400k steps each) hard starts still won: wall 87.3% against 81.0%, with crashes down from 18.0% to 10.2%; graded 89.3% against 85.7%, with wall contacts per episode down from 37.1 to 24.4. Seeds agreed within 2 points in every group.",
              "The wall arm gains more, probably because a crash ends the episode, so it gets very little practice at the moments just before one. Hard starts give it exactly that.",
            ],
          },
        ],
      },
      {
        heading: "Result 4: the simulator transfers to Gazebo",
        blocks: [
          {
            type: "p",
            text: "I installed ROS 2 Humble, Gazebo Classic and the TurtleBot3 packages in WSL2, wrote a ROS 2 node that reads /scan and /odom, runs the policy and publishes /cmd_vel, and a script that rebuilds each simulator test layout in Gazebo. The sensor and command handling sits in one shared module used by both the simulator and the node, so the code that ran in Gazebo is the code that will run on the robot.",
          },
          {
            type: "figure",
            src: "/figures/3_gazebo_agreement.png",
            alt: "Scatter plot of steps in Gazebo against steps in my simulator. Almost every point sits on the diagonal. Two points marked as different outcomes sit off it.",
            caption: "Each point is one episode: the same model on the same layout in both. On the line means the same number of steps.",
            width: 869,
            height: 875,
          },
          {
            type: "list",
            items: [
              "Gazebo's LiDAR matched my simulator's to within 7 to 9 mm on average at the same pose.",
              "On 30 layouts with the +400k hard-start models, 59 of 60 episodes had the same outcome, and 48 of those 59 took exactly the same number of steps. Both models reached the goal on 29 of 30.",
              "The one disagreement was layout 90001, a tight start the wall model has clipped in almost every test.",
            ],
          },
        ],
      },
      {
        heading: "A model for the TurtleBot's LiDAR",
        blocks: [
          {
            type: "p",
            text: "The real Burger uses the newer LDS-02 LiDAR, not the LDS-01 that Gazebo simulates. I added it to the simulator from the e-Manual and ROBOTIS's driver, and fine-tuned the best wall-arm model on it for 400k steps with hard starts and odometry drift. On 200 layouts it reached the goal 98.0% of the time, up from 95.5%, with half the crashes. In plain Gazebo it reached the goal on all 30 layouts.",
          },
          {
            type: "table",
            head: ["Change made to Gazebo", "Goal", "Crash", "Timeout", "Steps to goal"],
            rows: [
              ["none", "30", "0", "0", "62.3"],
              ["motors reach only 85% of the command", "30", "0", "0", "72.9"],
              ["+2 cm LiDAR noise, 3% of readings dropped", "30", "0", "0", "62.3"],
              ["odometry drift", "29", "1", "0", "64.0"],
            ],
            caption: "Robustness, 30 layouts each, one change at a time.",
          },
          {
            type: "p",
            text: "Lowering wheel friction first looked like the model's weak spot. Before training against it I measured Gazebo directly with a fixed command sequence. At friction 0.6 the robot lost 80 to 95% of its turning and turned left when told to turn right, while the Burger only needs a friction of about 0.1 to accelerate at its limit. That's a Gazebo contact-model artefact, not real slip, so I dropped it from the tests. Measuring first stopped me training against a problem that doesn't exist.",
          },
        ],
      },
      {
        heading: "Moving obstacles: does the answer hold with people around?",
        blocks: [
          {
            type: "p",
            text: "With no real robot available yet, I extended the experiment instead. Each room now gets 1 to 3 people as well as the usual 2 to 5 boxes. They're modelled as leg-sized cylinders (0.07 m radius) walking at 0.35 m/s between random points, and they don't steer around the robot. The LiDAR sees them like walls, so the graded arm's closeness penalty applies to them too, and driving into a person costs 30 in both arms. The robot now sees 4 stacked scans instead of 2, so it can tell which way someone is moving. Both arms trained from scratch for 600k steps, 3 seeds each.",
          },
          {
            type: "p",
            text: "Before training I wrote down a prediction: the wall arm would do better, and the graded arm would slow down around people and lose episodes to timeouts. The first run said the opposite, graded 94.0% against wall 86.0%. But the graded robot was driving into people 4.41 times per episode, and about 280 times in its worst ones. That looked wrong, so I traced it episode by episode.",
          },
          {
            type: "figure",
            src: "/figures/people_bug_trace.png",
            alt: "Bar chart of how often the graded robot drove into a person per episode: 4.41 in run 1, 3.17 in run 2, 0.17 in run 3.",
            caption: "The average hid that almost all the contacts came from a handful of stuck episodes.",
            width: 1260,
            height: 570,
          },
          {
            type: "list",
            items: [
              "Bug 1: when the robot bumped someone, the rest of that simulation step was skipped, including the people's movement. The bumped person never got to step back, so the robot bumped the same frozen person every step until time ran out.",
              "Bug 2: after that fix, a few episodes still had over 200 contacts. A bumped person whose step back was blocked by a wall, a box or another person just waited, and two people about to collide both froze. I made them behave more like real people: sidestep at an angle if the way back is blocked, and pick a new route instead of freezing.",
              "Both arms had to be retrained after the second fix. It changed how people move in both training worlds, and the comparison is only fair if both arms trained in the same world.",
            ],
          },
          {
            type: "p",
            text: "On the fixed simulator the graded arm reached the goal 96.8% of the time with no crashes, against 85.7% for the wall arm. That comparison isn't fair either: the wall arm's episodes end at its first contact, so it can never show more than one. I re-scored the wall models with episodes carrying on after contact, testing only, with the models unchanged. I predicted the wall arm would do worse once allowed to carry on. It didn't:",
          },
          {
            type: "figure",
            src: "/figures/people_results.png",
            alt: "Grouped bar chart. Under training rules, wall 85.7% and graded 96.8% reached the goal. Under the same rules on 1,000 layouts, wall 95.7% and graded 96.8%. A person was hit in 10.8% of wall episodes and 11.0% of graded ones.",
            caption: "Wall arm in blue, graded arm in orange, 3 seeds each. Under the same rules the seeds overlap.",
            width: 1260,
            height: 600,
          },
          {
            type: "p",
            text: "Both robots also kept about the same distance from people, around 0.51 m at the closest, so the graded robot wasn't shying away from them. And each arm still had one episode in 3,000 with over 200 contacts, so a rare stuck case remains in both.",
          },
          {
            type: "quote",
            text: "Both models are about as good at avoiding people and reaching the goal. Personally I'd pick the graded arm, because it doesn't need the robot to crash, and damage itself or its surroundings, in order to learn.",
          },
        ],
      },
      {
        heading: "On a real robot: the FastBot",
        blocks: [
          {
            type: "p",
            text: "I never got access to a TurtleBot3, so I moved to The Construct's remote lab, where you book a slot and drive a real FastBot robot over the internet.",
          },
          {
            type: "list",
            items: [
              "In a 25-minute slot I measured what I needed: its LiDAR gives 449 readings about 9.5 times a second, and it tracked gentle commands well (0.15 m/s, 1 rad/s) but not fast ones. So I limited the policy to the gentle range.",
              "I added the FastBot to my simulator as a second robot and fine-tuned the Burger model on it. I predicted it would reach the goal more often than the Burger model's 98.0%. It didn't: 98.0% on normal starts, and 91.0% on hard starts against the Burger's 94.5%.",
              "The FastBot's model file suggested its LiDAR might be mounted backwards, which would make it see obstacles on the wrong side. I checked on the robot before trusting it: turning left shifted the scan the way my simulator assumes, and driving 10 cm forward shortened the front reading from 1.60 m to 1.51 m.",
            ],
          },
          {
            type: "table",
            head: ["Run", "Goal", "What happened"],
            rows: [
              ["1", "1.0 m straight ahead", "reached"],
              ["2", "0.9 m behind and to the right", "reached in 7.3 s, close to the fastest possible"],
              ["3", "1.3 m ahead and to the left", "stopped 0.12 to 0.19 m from an obstacle until the 40 s limit"],
              ["4", "0.8 m behind, starting where run 3 stopped", "ended 0.3 m from the goal when the 30 s limit ran out"],
              ["5", "0.6 m to the left", "reached in 5.9 s"],
            ],
            caption: "3 of 5 goals reached, in a model city rather than a room like the ones it trained in.",
          },
          {
            type: "pair",
            items: [
              {
                src: "/media/fastbot-run5.mp4",
                poster: "/media/fastbot-run5-poster.jpg",
                alt: "Top-down view built from the robot's LiDAR: grey dots show walls around it, and the robot drives a short curve into the green goal circle.",
                label: "run 5: reached in 5.9 s",
                width: 500,
                height: 500,
              },
              {
                src: "/media/fastbot-run4.mp4",
                poster: "/media/fastbot-run4-poster.jpg",
                alt: "Top-down view built from the robot's LiDAR: the robot drives about half a metre and stops just outside the green goal circle.",
                label: "run 4: 0.3 m short at the time limit",
                width: 500,
                height: 500,
              },
            ],
            caption: "Recorded on the real robot and drawn from its own LiDAR scans and odometry: grey dots are what it saw, the blue line is where it drove.",
          },
          {
            type: "p",
            text: "As a first real-robot demonstration it was weak. The failed runs looked like the “stuck in front of an obstacle” failure I'd seen in simulation, the model city is nothing like my training rooms, and not all of the FastBot's specs were published, so my simulated version wasn't an exact match. Whether a real TurtleBot3 would do better stays a hypothesis until I can test on one.",
          },
        ],
      },
      {
        heading: "Bugs worth remembering",
        blocks: [
          {
            type: "list",
            items: [
              "My evaluation first reported 0% crashes for both arms, because it checked whether the robot's final position overlapped a wall, and a blocked move never leaves it overlapping.",
              "Models reaching 17 of 20 goals dropped to 0. PPO collects 16,384 steps per update, so a 200,000-step budget overshoots to 212,992 and the linear learning-rate schedule went negative on the last update. Clamping it fixed the sweep.",
              "The first Gazebo run placed every box at double its height and position, so they floated above the LiDAR. Gazebo positions boxes by their centre.",
              "Models trained on Windows wouldn't load in Ubuntu, which has to stay on NumPy 1 for ROS Humble. The node now rebuilds the weights instead of unpickling the whole file, and makes identical decisions on both machines.",
            ],
          },
        ],
      },
      {
        heading: "Limits and what's next",
        blocks: [
          {
            type: "list",
            items: [
              "3 seeds per arm. The original 200k-step models were undertrained; the best ones had 400k extra steps.",
              "The real-robot test is 5 runs on a different robot, which is a demonstration, not a success rate. The TurtleBot3 itself was never tested on hardware.",
              "Obstacles are all rectangles, and people are simple cylinders that don't react to the robot beyond stepping away.",
            ],
          },
          {
            type: "p",
            text: "Next: a longer real-robot test with a proper success rate and a camera recording, and measuring real wheel slip with the same command sequence I used in Gazebo.",
          },
        ],
      },
    ],
  },
  {
    slug: "car-racing",
    title: "CarRacing from pixels",
    short:
      "PPO driving CarRacing-v3 from a 96×96 image. Best model: 849 mean reward on 30 random tracks, 18 laps finished, 0.56% of steps off the road.",
    group: "rl",
    when: "14-22 Sep 2026",
    role: "Solo",
    stack: ["Python", "Gymnasium", "Stable-Baselines3 (PPO, CnnPolicy)", "PyTorch (CUDA)"],
    media: {
      src: "/media/car.mp4",
      poster: "/media/car-poster.jpg",
      alt: "Top-down view of the red car following a grey track through green grass.",
      caption: "The final model (1,835,008 steps) on track seed 3, recorded for this page. It finished that lap with a reward of 912.9.",
      width: 840,
      height: 490,
    },
    stats: [
      { value: "849.0 ± 10.2", label: "mean reward on 30 random tracks" },
      { value: "18 / 30", label: "laps finished" },
      { value: "0.56%", label: "steps with 2+ wheels off the road" },
    ],
    intro:
      "CarRacing gives the agent a 96×96 colour image and nothing else: no speed, no track map. The track is random every episode. I spent a week and a half on it, and most of what I learned came from things going wrong.",
    sections: [
      {
        heading: "Setup",
        blocks: [
          {
            type: "list",
            items: [
              "PPO with a CNN policy, 16 environments in parallel through SubprocVecEnv, and the last 4 frames stacked so the agent can see speed and direction.",
              "My first 20k-step test took 24 minutes. With the default batch size of 64, PPO ran 5,120 tiny updates per chunk of data. Raising it to 512 cut that to 640.",
              "Switched PyTorch to the CUDA build for my RTX 4060. One learning update went from 212 ms to 23 ms, but overall training only got about 2.5× faster, because the game itself still runs on the CPU.",
              "An interrupted run lost about 164k steps of progress, and the next run overwrote its checkpoints. So I added resume logic that detects an interrupted run with a marker file and restarts from the newest checkpoint.",
              "An end-of-run comparison between the previously saved model, the best evaluated model and the final model, keeping the winner. It mattered: in several runs the final model was clearly worse than one saved partway through.",
            ],
          },
        ],
      },
      {
        heading: "Stuck: the car wouldn't brake",
        blocks: [
          {
            type: "p",
            text: "At 753k steps the car drove the road reasonably well but lost it at every hairpin: full speed into the turn, a slide, then stuck on the grass. I checked the policy's outputs instead of just watching. Its average brake output was −0.77, which clips to zero, and only 4% of its actions braked harder than 0.3.",
          },
          {
            type: "pair",
            items: [
              {
                src: "/media/hairpin-before.mp4",
                poster: "/media/hairpin-before-poster.jpg",
                alt: "The red car arrives at a bend at speed, slides off the track and spins on the grass, leaving skid marks.",
                label: "753,664 steps: slides off",
                width: 420,
                height: 245,
              },
              {
                src: "/media/hairpin-after.mp4",
                poster: "/media/hairpin-after-poster.jpg",
                alt: "The red car takes the same bend and stays on the grey track.",
                label: "final model, a week later: stays on",
                width: 420,
                height: 245,
              },
            ],
            caption: "The same bend on the same track (seed 0), recorded for this page. On the way in, the old model's brake never went above 0.23.",
          },
          {
            type: "p",
            text: "My explanation: braking at random moments early in training cost reward, so it learned to avoid braking altogether. More training then shrinks the exploration it would need to discover when braking helps. It had fallen into a local trap.",
          },
        ],
      },
      {
        heading: "Trying gSDE, and why it didn't help",
        blocks: [
          {
            type: "p",
            text: "I started a separate run with gSDE exploration, keeping the original as a baseline. The first thing I measured was the stuck states: the policy was asking for brake values up to +3.75 and steering up to ±17. Stable-Baselines3 only clips those, so the car sat at full lock and full brake with no way out. Adding `squash_output=True` and an early cut-off for stuck episodes fixed that, and it never got stuck again across 5 test tracks.",
          },
          {
            type: "p",
            text: "Evaluation then hung forever. `make_vec_env` had put my cut-off wrapper outside `Monitor`, so `Monitor` never saw the episode end and `evaluate_policy` waited for an episode count that never came. Building the environment myself with the wrapper on the inside fixed it.",
          },
          {
            type: "p",
            text: "The gSDE model trained to 4M steps and still couldn't take a hairpin. So I wrote `log_run.py` to record speed, steering, gas and brake for every frame of a track, and looked only at the run-up to each place it stopped collecting tiles:",
          },
          {
            type: "figure",
            src: "/figures/car_brake_log.png",
            alt: "Two stacked line charts over about 180 frames. Speed falls from about 83 to 74. Below, steering slams between −1 and +1 while the brake line stays flat at zero the whole time.",
            caption: "From my drive log for track seed 1. The brake is 0.000 on every frame, while steering bangs between its limits. It was the same on every seed I checked.",
            width: 1260,
            height: 720,
          },
          {
            type: "p",
            text: "That ruled out the control rate as the problem, which was my other suspect. It simply wasn't braking.",
          },
        ],
      },
      {
        heading: "Frame skip, two collapses, and what gSDE was really doing",
        blocks: [
          {
            type: "p",
            text: "Next I added frame skip, which repeats each action for 4 frames and shortens how many correct decisions a corner needs. The first frame-skip run scored 289.5 at 65k steps, then fell to about 15 and stayed there. Lowering the epochs and adding `target_kl` helped the second run reach 257.9, and then it fell the same way.",
          },
          {
            type: "p",
            text: "In both collapses the spread of scores across the 5 evaluation tracks shrank to almost nothing: the policy was doing the same thing no matter what the track looked like. Since then I watch the spread as well as the mean. It caught both collapses earlier than the mean did.",
          },
          {
            type: "p",
            text: "Evaluating the 65k model two ways showed the cause. Its mean action scored 293.9 across 5 seeds, but its sampled actions scored −88.5, and PPO only ever trains on the sampled ones. So I measured the noise gSDE was really adding. Under gSDE the noise is the CNN's latent features multiplied by a random matrix, so with `log_std_init` at −2, which should mean small noise, the real steering noise was about 0.87 on an axis that only runs from −1 to +1.",
          },
          {
            type: "p",
            text: "I switched to plain Gaussian noise, where the setting is the actual noise. Frame skip already did the job I'd added gSDE for, so keeping both had been the mistake. But at −2 the noise was now too small: measured across a whole lap, the steering never left −0.07 to +0.07. It drove straight at low gas, and 229k steps had taught it almost nothing. A fresh run at −1 finally learned, scoring 348 by 131k steps and 520 by 196k.",
          },
        ],
      },
      {
        heading: "The wrappers that did the work",
        blocks: [
          {
            type: "p",
            text: "I read `car_dynamics.py` to understand grip and braking, and found that CarRacing doesn't penalise driving on grass at all. Running wide and rejoining cost the agent almost nothing.",
          },
          {
            type: "code",
            id: "off-track-penalty",
            caption: "My off-track penalty: 1.2 per frame with 2 or more wheels touching no road tile. Time off the road fell from 30.5% to 7.8%. The first version compared a generator to 0, which is always False, and penalised nothing. Wrapping it in sum() fixed it.",
          },
          {
            type: "p",
            text: "The car also wobbled: its steering reversed direction on about 16% of steps. My first fix, blending each command with the previous one, made it worse. The agent learned to push harder against the lag, so the wobble got slower and bigger. Smoothing limits how fast steering can change, but gives the agent no reason to want smooth steering. Only the reward can do that:",
          },
          {
            type: "code",
            id: "steering-penalty",
            caption: "The steering penalty: the squared change in steering between decisions, so a swing of 1.5 costs 9 times as much as a swing of 0.5. My first version squared the steering itself, which would have penalised every corner.",
          },
          {
            type: "p",
            text: "Before picking a strength I measured what the current model's steering would cost. The multiplier I'd picked by feel would have cost about 1.2 points an episode, 25 times too small to notice against scores around 500.",
          },
        ],
      },
      {
        heading: "Staged training, and the car that parked",
        blocks: [
          {
            type: "p",
            text: "Turning every penalty on from step 0 produced a car that parked at the start line and held the brake, scoring about −4 for 393,216 steps. Driving badly cost 4.8 per step off the road, while standing still cost 0.1 per frame and ended the episode after 25 steps. Doing nothing was the best policy it could find. Adding one wrapper at a time, each stage starting from the last stage's winner, worked:",
          },
          {
            type: "table",
            head: ["Stage", "Added", "Mean reward (10 tracks)", "Off the road"],
            rows: [
              ["1", "frame skip, smoothing, early cut-off", "529.9", "33.8%"],
              ["2", "off-track penalty", "755.8", "10.6%"],
              ["3", "steering penalty ×2", "835.7", "0.6%"],
            ],
          },
          {
            type: "p",
            text: "Then a control run: stage 2 trained for the same extra 500,000 steps without the steering penalty. It scored 838.5 against stage 3's 835.7, so the 80-point gain came from the extra training and the decaying learning rate, not the penalty. Without that run I would have credited the penalty with it. Its real effect showed up on 30 tracks: 0.93% ± 0.24 of steps off the road against 6.41% ± 1.23, and no spin-outs.",
          },
        ],
      },
      {
        heading: "How strong should the penalty be?",
        blocks: [
          {
            type: "figure",
            src: "/figures/car_sweep.png",
            alt: "Horizontal bar chart of mean reward on 30 tracks. No penalty 775.7, ×2 812.1, ×4 810.7, ×8 from the stage 2 model 632.8, ×8 from the ×4 model 849.0.",
            caption: "Every arm trained the same number of steps. At ×16 (not shown) the model collapsed to about −150.",
            width: 1260,
            height: 540,
          },
          {
            type: "table",
            head: ["Penalty", "Off the road", "Laps of 30"],
            rows: [
              ["none", "6.41%", "12"],
              ["×2", "0.93%", "13"],
              ["×4", "2.83%", "16"],
              ["×8, from the stage 2 model", "13.79%", "7"],
              ["×8, from the ×4 model", "0.56%", "18"],
              ["×16, from the ×8 model", "off the track", "0"],
            ],
          },
          {
            type: "p",
            text: "The same ×8 penalty gave 633 on a model still learning to drive and 849 on one that already drove well, so when a penalty arrives matters more than how strong it is. At ×16 the agent stopped steering altogether: the penalty charges for changes in steering, so holding the wheel at −1 and driving off the track costs nothing. That's the opposite failure to the parked car, and both come from a penalty being cheaper to satisfy than the task.",
          },
        ],
      },
      {
        heading: "What I took from it",
        blocks: [
          {
            type: "list",
            items: [
              "Look at what the policy actually outputs, not just the score. The brake values and the steering range told me more than any reward curve.",
              "Size a penalty by measuring what the current behaviour would cost.",
              "Change one thing per run, and run a control.",
              "Five-episode evaluations aren't a result. Scores swung by 300 points between evaluations of the same model, so my comparisons use 10 or 30 fixed tracks with standard errors.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "gridworld",
    title: "GridWorld, my first custom environment",
    short:
      "A Gymnasium environment written from scratch, trained with PPO and DQN, then broken and fixed until both reached the goal from every starting cell.",
    group: "rl",
    when: "9-11 Sep 2026",
    role: "Solo",
    stack: ["Python", "Gymnasium", "Stable-Baselines3 (PPO, DQN)", "NumPy"],
    stats: [
      { value: "58 / 58", label: "valid starting cells solved by both PPO and DQN on the 8×8 grid" },
      { value: "8.21", label: "PPO's mean episode length on 5×5, where the minimum is 8" },
    ],
    intro:
      "After LunarLander and FrozenLake I wanted to write an environment myself instead of using one. I wrote __init__, reset(), step() and render(), tested every move by hand, then trained PPO and DQN on it and fixed whatever broke.",
    sections: [
      {
        heading: "The 5×5 version",
        blocks: [
          { type: "gridworld" },
          {
            type: "p",
            text: "Even the basics took some working out. My first check for “did the agent bump a wall”, `row != 0 or row != size-1`, is true everywhere, so it never caught anything. Comparing the position before and after the move was the right test.",
          },
          {
            type: "p",
            text: "PPO converged cleanly: mean episode length fell from 32.8 to 8.21 (the shortest path is 8) and mean reward rose from −31.8 to 2.8 (the maximum is 3). It reached the goal in 100 of 100 evaluation episodes and from all 23 valid starting cells.",
          },
          {
            type: "p",
            text: "DQN diverged. Episodes hit the 50-step limit with a reward of about −3, which didn't add up until I worked out why: bumping a wall cost 0 while a real move cost −1. An agent stuck against a wall paid almost nothing, 46 bumps at 0 plus 3 real moves at −1. Making a wall bump cost −1 fixed it.",
          },
        ],
      },
      {
        heading: "Scaling to 8×8 with 5 traps",
        blocks: [
          {
            type: "p",
            text: "With a flat −1 per step, PPO learned to walk into a trap after about 4 steps (reward ≈ −13) instead of finding the real 14-step path (reward ≈ −3). Dying fast was the best thing it had discovered. The reward had to make the long good path findable, not just eventually better, so I switched to rewarding progress toward the goal:",
          },
          {
            type: "figure",
            src: "/figures/grid_distance.png",
            alt: "An 8 by 8 grid where each cell shows its distance to the goal in the bottom-right corner, from 14 down to 1. An arrow from 9 to 8 is labelled +1, and an arrow from 4 to 5 is labelled −1.",
            caption: "Each cell's distance to the goal. A move earns old distance minus new distance: +1 closer, −1 farther.",
            width: 780,
            height: 780,
          },
          {
            type: "code",
            id: "gridworld-reward",
            caption: "The reward in step(). This is the current version of the file, where a wall bump costs −3.",
          },
          {
            type: "p",
            text: "DQN then did something I didn't expect. It found the optimal path about 5k steps into a 20k run, then drifted away from it before training finished. Unlike my Q-table, a neural network can get worse after finding the answer, probably because its replay buffer was still full of earlier bad experience. Training for 50k steps fixed it.",
          },
        ],
      },
      {
        heading: "Why some starts failed",
        blocks: [
          {
            type: "p",
            text: "I swept every valid starting cell. PPO failed in two clusters near the traps, and DQN failed at only two cells next to one trap. The first sweep's results looked wrong, and they were: an (x, y) versus (row, col) mix-up meant it wasn't excluding the traps at all, and some failing cells weren't the ones I thought I was testing.",
          },
          {
            type: "p",
            text: "After fixing that, the two algorithms still failed in almost entirely different places. Both had trained from the same fixed start, so a region neither had seen would have failed for both. Each algorithm's own exploration was shaping its blind spots. Rendering the DQN failures step by step showed it walking straight into the trap.",
          },
        ],
      },
      {
        heading: "The fix: train from where you'll be tested",
        blocks: [
          {
            type: "p",
            text: "Both models had only ever started from (0, 0). I rewrote reset() to draw a random start from a precomputed list of valid cells. My first two attempts drew separate random indices for the row and the column, which combines two unrelated valid cells instead of picking one. One index into the list guarantees a valid cell. A smoke test of 2,000 resets hit all 58 valid cells and never an invalid one.",
          },
          {
            type: "p",
            text: "After retraining, both PPO and DQN reached the goal from every valid starting cell. It was a training-distribution problem, not a reward or coordinate bug, and not just “needs more training”.",
          },
          {
            type: "p",
            text: "I also added EvalCallback with best-checkpoint saving, plus a step that scores the old saved model against the new best one and only overwrites if the new one wins, after reruns had overwritten good models more than once. Reading its source showed it always names the file best_model.zip, so a PPO run and a DQN run sharing a folder would silently overwrite each other.",
          },
        ],
      },
      {
        heading: "What else tripped me up",
        blocks: [
          {
            type: "list",
            items: [
              "The environment had no step limit, so a bad policy could loop forever. FrozenLake's built-in wrapper had been hiding that requirement from me.",
              "`self.np_random` is an object with methods, not a function. I tried calling `self.np_random(7)` before finding `.integers()`.",
              "Random starts change what “optimal reward” means. With one fixed start it was a single number, 23. With 58 starts it ranges from 10 to 23, so the training curve needed a different baseline.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "frozen-lake",
    title: "FrozenLake: Q-learning from scratch",
    short:
      "Tabular Q-learning with no RL library, to see the update rule work directly instead of through a black-box .learn().",
    group: "rl",
    when: "9 Sep 2026",
    role: "Solo",
    stack: ["Python", "Gymnasium", "NumPy"],
    media: {
      src: "/media/frozen.mp4",
      poster: "/media/frozen-poster.jpg",
      alt: "A 4×4 grid of ice with four holes. The elf walks from the top-left corner to the present in the bottom-right.",
      caption: "My trained Q-table playing greedily on the slippery map, recorded for this page.",
      width: 360,
      height: 360,
      pixelated: true,
    },
    stats: [
      { value: "100 / 100", label: "on the non-slippery map after 5,000 episodes" },
      { value: "~78%", label: "best success rate on the slippery map" },
    ],
    intro:
      "PPO had worked on LunarLander, but I couldn't say how. Q-learning on a 16-cell lake is small enough to watch a reward at one step change the value of the steps before it, which is the same idea PPO and DQN use with a neural network instead of a table.",
    sections: [
      {
        heading: "What I wrote",
        blocks: [
          {
            type: "list",
            items: [
              "A 16 × 4 Q-table, one value per state and action, starting at zero.",
              "Epsilon-greedy action selection: explore at random with probability epsilon, otherwise take the best known action. Epsilon starts at 1.0, since trusting an all-zero table is pointless, and decays by 0.999 per episode to 0.01.",
              "The TD update, below.",
              "A separate greedy evaluation loop over 100 episodes.",
            ],
          },
          {
            type: "code",
            id: "q-update",
            caption: "Look one step ahead, then nudge the old estimate toward the reward plus the discounted best next value.",
          },
          {
            type: "p",
            text: "To check I really understood it, I rewrote the whole thing from a skeleton afterwards (that's where the TODO comments come from). It came out with about 3 small syntax errors and 2 look-backs at my first version.",
          },
        ],
      },
      {
        heading: "Bugs that taught me something",
        blocks: [
          {
            type: "list",
            items: [
              "`np.zeros(16, 4)` reads the 4 as a dtype and gives a 1D array. The shape has to be a tuple, `np.zeros((16, 4))`.",
              "`np.argmax` gives the index of the best action, `np.max` its value. The TD target needs the value.",
              "Forgetting `state = next_state` in the evaluation loop kept looking up the starting state's Q-values on every step.",
            ],
          },
        ],
      },
      {
        heading: "Results, and a ceiling I didn't expect",
        blocks: [
          {
            type: "p",
            text: "On the non-slippery map, 5,000 episodes was enough: the Q-values settled near 1.0 close to the goal and fell off with distance, and the greedy policy succeeded 100 times out of 100. Then I turned the ice slippery:",
          },
          {
            type: "table",
            head: ["Training episodes (slippery)", "Success rate"],
            rows: [
              ["20,000", "71-78%"],
              ["100,000", "78%"],
              ["200,000", "71-72%"],
            ],
          },
          {
            type: "p",
            text: "I couldn't work out why 100k wouldn't go above 78%, or why 200k did worse than 20k. The answer to the first: slippery ice only moves you the way you meant a third of the time, so no policy can win every time, and around 78% is close to the ceiling. The dip at 200k is probably noise in a 100-episode evaluation rather than a worse policy.",
          },
          {
            type: "figure",
            src: "/figures/frozen_policy.png",
            alt: "The 4 by 4 lake with an arrow in each safe cell showing the chosen move and a number showing its value, rising from about 0.5 at the start to 0.90 next to the goal. Holes are dark and the goal is gold.",
            caption: "What my saved Q-table learned: the move it picks on each tile, and that move's value. Some arrows look odd, like pointing left at the start. On slippery ice you slide sideways two times in three, and pushing left into the wall there means the only slip that can happen is down, never into a hole.",
            width: 780,
            height: 780,
          },
        ],
      },
    ],
  },
  {
    slug: "lunar-lander",
    title: "LunarLander, my first RL agent",
    short:
      "PPO landing a spacecraft between two flags, then reading the environment's source to explain why it lands where it does.",
    group: "rl",
    when: "7-8 Sep 2026",
    role: "Solo",
    stack: ["Python", "Gymnasium", "Stable-Baselines3 (PPO)", "Box2D"],
    media: {
      src: "/media/lunar.mp4",
      poster: "/media/lunar-poster.jpg",
      alt: "A purple lander descending on its main engine and settling between two yellow flags on white ground.",
      caption: "The trained model (about 1M steps) landing on seed 3, recorded for this page. Episode return 235.3; 200 counts as solved.",
      width: 480,
      height: 320,
    },
    intro:
      "The first thing I trained. I started from a script I didn't understand yet, got a lander that touched down between the flags, and spent the next day working out why it behaved the way it did.",
    sections: [
      {
        heading: "Day 1: change the one thing I understood",
        blocks: [
          {
            type: "p",
            text: "I couldn't read the code yet, but I could change how long it trained. So I retrained at different step counts and watched each one land:",
          },
          {
            type: "table",
            head: ["Training steps", "What the lander did"],
            rows: [
              ["100k", "Never tried to land. Flew upward every time."],
              ["200k", "Descended slowly toward the flags, but did most of its steering after touching down."],
              ["300k", "Landed between the flags about 40% of the time, on or near a flag otherwise."],
              ["400k", "Mostly landed on a flag instead of the centre."],
              ["500k", "Landed between the flags most of the time."],
            ],
          },
          {
            type: "figure",
            src: "/figures/lunar_timelapse.png",
            alt: "A time-lapse of the trained lander's descent: ten faint copies of the lander stacked from the top of the screen down to the pad between the two yellow flags, the last one brightest.",
            caption: "Where the training ended up: the trained model's whole descent as a time-lapse, one exposure every 30 steps.",
            width: 600,
            height: 400,
          },
          {
            type: "p",
            text: "My guess for the 100k agent: crashing is penalised heavily, so an agent that can't land yet does better by not trying. Landing only pays off once it has learned how.",
          },
        ],
      },
      {
        heading: "Day 2: read the source, then test",
        blocks: [
          {
            type: "p",
            text: "To explain why the 400k agent aimed for a flag, I stopped guessing from the outside and read LunarLander's reward function on GitHub. Then I retrained at 400k with a different seed (100) to check the first run wasn't a fluke. It landed near the flags again, so the behaviour was real.",
          },
          {
            type: "code",
            id: "lunar-shaping",
            caption: "From Gymnasium's LunarLander source, the part I spent the day on.",
          },
          {
            type: "figure",
            src: "/figures/lunar_shaping.png",
            alt: "Line chart of the four shaping terms over 243 steps of one landing. Distance to pad rises from −141 toward zero, speed dips to about −70 then climbs back, tilt stays near zero, and legs touching jumps to +20 at step 212.",
            caption: "The same four terms, measured through the landing at the top of this page. The reward each step is how much their total went up.",
            width: 1260,
            height: 630,
          },
          {
            type: "list",
            items: [
              "Why shape at all: if the only reward were a perfect landing, every other attempt would score the same and the agent would need a lucky landing to learn anything.",
              "Every term is graded, not pass or fail. Slightly closer to the pad, slightly slower or slightly more upright is always slightly better, so every step tells the agent “warmer” or “colder”.",
              "The reward is `shaping - prev_shaping`: it pays for improving on the last step, not for being in a good spot. Where `prev_shaping` started was one of my questions that day. It's reset at the start of every episode in `reset()`.",
              "Badly designed shaping leads to reward hacking, where the agent chases points instead of the task. I ran into exactly that later, in GridWorld and CarRacing.",
            ],
          },
        ],
      },
      {
        heading: "Python I picked up on the way",
        blocks: [
          {
            type: "list",
            items: [
              "A class is a template, a bit like a Flutter widget. `self` is what lets values set in `__init__` survive for `step()` and `reset()` to use.",
              "LunarLander is a subclass of `gym.Env`, so it has to fill in `reset()`, `step()` and `render()`. Every environment does.",
              "`spaces.Discrete(4)` means pick one of 4 actions: do nothing, or fire one of the 3 engines. `spaces.Box(shape=(8,))` means 8 continuous numbers, like position, velocity and angle.",
            ],
          },
          {
            type: "p",
            text: "That was enough to write my own environment soon after. First, though, I wanted to see a learning update happen with my own eyes instead of inside `.learn()`, which is where FrozenLake came from.",
          },
        ],
      },
    ],
  },
  {
    slug: "healthcare-app",
    title: "Healthcare mobile app",
    short:
      "A two-person Flutter app for finding clinics anywhere in Singapore, booking appointments, looking up food nutrition and reading health news.",
    group: "earlier",
    when: "Jul-Aug 2026",
    role: "Team of 2",
    stack: ["Flutter", "Dart", "Android Studio", "Firebase Auth", "Cloud Firestore", "Geoapify Places API", "USDA FoodData Central API"],
    links: [{ label: "View the code on GitHub", href: "https://github.com/lebaaaa/healthcare" }],
    showcase: [
      {
        kind: "video",
        src: "/media/healthcare-booking.mp4",
        poster: "/media/healthcare-booking.jpg",
        alt: "Screen recording: the home screen shows no appointments; on Clinics the area is changed to Clementi, MyHealth Medical Centre is booked for 14 Oct 2026 at 4:00 PM, and the appointment then appears on the home screen.",
        label: "booking, start to finish",
        width: 480,
        height: 1014,
      },
      {
        kind: "image",
        src: "/phones/clinics.png",
        alt: "Clinics screen with Clementi selected, showing clinic cards with address, phone number, opening hours and a Book Appointment button.",
        label: "clinics by area",
        width: 720,
        height: 1520,
      },
      {
        kind: "image",
        src: "/phones/food-search.png",
        alt: "Food Search screen with salmon typed in and a list of matching foods.",
        label: "food search",
        width: 720,
        height: 1520,
      },
      {
        kind: "image",
        src: "/phones/nutrition.png",
        alt: "Nutrition Detail screen for salmon: calories, protein, fat and carbs, then calcium, iron, sodium and vitamins C and D.",
        label: "nutrition detail",
        width: 720,
        height: 1520,
      },
      {
        kind: "image",
        src: "/phones/home.png",
        alt: "Home screen welcoming the user, with one upcoming appointment at MyHealth Medical Centre on 14 Oct 2026 at 4:00 PM.",
        label: "home, after booking",
        width: 720,
        height: 1520,
      },
    ],
    showcaseCaption:
      "Recorded on the Android emulator from Android Studio. The recording is real time: picking Clementi, booking a 4:00 PM slot, and the appointment appearing on the home screen, which my teammate built.",
    intro:
      "A mobile app with five tabs: home, clinics, food, news and a user profile. You sign in with Firebase, pick an area of Singapore to see nearby clinics, book a slot, and manage your appointments from the home screen. I built it with one teammate over about a month, splitting the app by screen.",
    sections: [
      {
        heading: "What I built",
        blocks: [
          {
            type: "list",
            items: [
              "Clinics screen: a dropdown of all 55 planning areas in Singapore, each mapped to its Geoapify place ID. Picking an area fetches up to 20 clinics and shows each one's address, phone number and opening hours, with a Book Appointment button.",
              "Appointment booking: a bottom sheet with a date picker limited to today through one year ahead, and a set of 6 time slots. Confirm Booking stays disabled until both are chosen, then the appointment is saved to Cloud Firestore against the signed-in user.",
              "Food search: searches the USDA FoodData Central database and lists up to 20 matches. The detail screen pulls calories, protein, fat and carbs, plus calcium, iron, sodium and vitamins C and D, out of each food's nutrient list.",
              "The data layer behind those screens: the clinic, appointment, food and user models, the API calls, the Firestore calls for saving and loading appointments, and the bottom navigation bar.",
            ],
          },
        ],
      },
      {
        heading: "What my teammate built",
        blocks: [
          {
            type: "p",
            text: "The home screen, which streams your appointments live from Firestore and lets you tap one to change it or hold to delete it; the health news screen; the sign-in and profile screens; and the teal colour scheme the whole app shares. We split the work by screen and shared one repository, 21 commits from me and 19 from them.",
          },
        ],
      },
      {
        heading: "What I learned",
        blocks: [
          {
            type: "list",
            items: [
              "Handling slow network calls in a UI with `FutureBuilder`: showing a spinner while waiting, an error if the request fails, and the list once data arrives.",
              "Turning another service's JSON into my own models, with a fallback like “Contact not found” for every field a clinic might be missing, so one incomplete listing doesn't crash the screen.",
              "Storing per-user data in Firestore by tagging each appointment with the user's ID and querying on it.",
              "Working in one repository with someone else at the same time, including sorting out our merge commits.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "automated-store-system",
    title: "Automated Store System",
    short:
      "A web dashboard for data from a BeagleBone Black Wireless, coordinating four modules to take manual stock and expiry checks off store workers.",
    group: "earlier",
    role: "Group member",
    stack: ["BeagleBone Black Wireless", "Python", "Node.js", "C"],
    intro:
      "Created a web-based dashboard to monitor data from the BeagleBone Black Wireless and coordinated four modules to optimise tasks for store workers.",
    sections: [
      {
        heading: "Problem",
        blocks: [
          {
            type: "p",
            text: "Many small retail stores rely on manual processes to track inventory and check product expiry dates. That's time-consuming for employees and increases the risk of human error.",
          },
        ],
      },
      {
        heading: "Goal",
        blocks: [
          {
            type: "p",
            text: "Reduce manual work for retail employees with a centralised dashboard that automates inventory monitoring and expiry tracking.",
          },
        ],
      },
      {
        heading: "Solution",
        blocks: [
          {
            type: "p",
            text: "I developed an integrated module that tracks item stock, alerts the user when stock is low, and tracks item popularity. It connects to the project lead's computer along with the other modules to simulate how the product would work in a small retail store.",
          },
        ],
      },
      {
        heading: "My role",
        blocks: [
          {
            type: "p",
            text: "Project documentation, integrating data from the hardware modules into the dashboard, helping develop the dashboard, and supporting team members with technical problems.",
          },
        ],
      },
      {
        heading: "Challenges",
        blocks: [
          {
            type: "p",
            text: "Coordinating data from multiple modules reliably. We addressed it by structuring the data flow clearly and keeping communication between the hardware and the dashboard consistent.",
          },
        ],
      },
      {
        heading: "Outcome and what I learned",
        blocks: [
          {
            type: "p",
            text: "The final system automates the key inventory tasks, cutting the need for manual checks. The project strengthened my understanding of embedded systems integration, hardware-to-software communication, and building practical web dashboards.",
          },
        ],
      },
    ],
  },
  {
    slug: "paint-style-drawing-app",
    title: "Paint-Style Drawing Application",
    short:
      "A Windows drawing app modelled on Microsoft Paint, with free drawing, colour selection and simple editing.",
    group: "earlier",
    role: "Project lead",
    stack: ["C#", "Windows Forms"],
    intro:
      "A Windows desktop drawing application inspired by Microsoft Paint. Users can draw freely, pick colours and do basic editing through a graphical interface.",
    sections: [
      {
        heading: "Goal",
        blocks: [
          {
            type: "p",
            text: "Build a working desktop application that shows core C# skills, event-driven input handling and GUI development with Windows Forms.",
          },
        ],
      },
      {
        heading: "Solution",
        blocks: [
          {
            type: "p",
            text: "The app supports free drawing, colour selection and simple editing. Mouse movements and clicks are captured through event handlers and turned into drawing on the canvas in real time.",
          },
        ],
      },
      {
        heading: "My role",
        blocks: [
          {
            type: "p",
            text: "I designed and implemented the application logic, handled the user input events, and built the interface with Windows Forms.",
          },
        ],
      },
      {
        heading: "Challenges",
        blocks: [
          {
            type: "p",
            text: "Keeping drawing smooth while tracking continuous mouse input. I solved it by handling the mouse events correctly and optimising how drawing actions were rendered on the canvas.",
          },
        ],
      },
      {
        heading: "Outcome",
        blocks: [
          {
            type: "p",
            text: "A fully working Windows desktop program that demonstrates practical Windows Forms development and how to structure a desktop application in C#.",
          },
        ],
      },
    ],
  },
  {
    slug: "food-stall-ordering-site",
    title: "Food Stall Ordering Website",
    short:
      "A multi-page front-end site that lets customers place online orders at a food stall, with form validation in JavaScript.",
    group: "earlier",
    role: "Project lead",
    stack: ["HTML", "CSS", "JavaScript"],
    intro:
      "Designed and developed a working website that lets customers place online orders for a food stall.",
    sections: [
      {
        heading: "Problem",
        blocks: [
          {
            type: "p",
            text: "Many small food stalls have no simple online presence for taking orders. This project simulated a real-world case where a basic website could make ordering more accessible and convenient.",
          },
        ],
      },
      {
        heading: "Goal",
        blocks: [
          {
            type: "p",
            text: "A working web prototype that shows core front-end skills: layout design, navigation and form handling.",
          },
        ],
      },
      {
        heading: "Solution",
        blocks: [
          {
            type: "p",
            text: "A multi-page site with a clear interface, structured navigation and an order form. The focus was usability and responsiveness, with user input checked in JavaScript.",
          },
        ],
      },
      {
        heading: "My role",
        blocks: [
          {
            type: "p",
            text: "I designed the layout, built the front-end interface and added the interactive functionality in JavaScript.",
          },
        ],
      },
      {
        heading: "Challenges",
        blocks: [
          {
            type: "p",
            text: "Making the order form work correctly while keeping the layout clean. Structuring the HTML properly and validating inputs with JavaScript solved it.",
          },
        ],
      },
      {
        heading: "Outcome and what I learned",
        blocks: [
          {
            type: "p",
            text: "A fully working prototype of the site. It improved my understanding of responsive layout, front-end logic and building interfaces around the user.",
          },
        ],
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export const rlProjects = projects.filter((p) => p.group === "rl");
export const naraProjects = projects.filter((p) => p.group === "nara");
export const earlierProjects = projects.filter((p) => p.group === "earlier");

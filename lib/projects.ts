// All project content lives here. Numbers come from the Daily Logs, the
// CarRacing README and the TurtleBot3 write-up in C:\AI Testing.

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
  group: "rl" | "earlier";
  when?: string;
  role: string;
  stack: string[];
  links?: { label: string; href: string }[];
  media?: Media;
  stats?: { value: string; label: string }[];
  intro: string;
  sections: Section[];
};

export const projects: Project[] = [
  {
    slug: "turtlebot3-lidar-robot",
    title: "Crash or carry on: training a LiDAR robot",
    short:
      "My own 2D simulator for a TurtleBot3 Burger, two reward designs compared over 3 seeds each, then checked in Gazebo through ROS 2.",
    group: "rl",
    when: "22–25 Sep 2026",
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
      { value: "98.0%", label: "goals reached by the real-robot model (LDS-02 LiDAR, odometry drift)" },
      { value: "53.7 → 87.3%", label: "wall arm on hard starts, after hard-start training" },
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
        heading: "A model for a real robot",
        blocks: [
          {
            type: "p",
            text: "The Burger I'm hoping to test on carries the newer LDS-02 LiDAR, not the LDS-01 that Gazebo simulates. I added it to the simulator from the e-Manual and ROBOTIS's driver, and fine-tuned the best wall-arm model on it for 400k steps with hard starts and odometry drift. On 200 layouts it reached the goal 98.0% of the time, up from 95.5%, with half the crashes. In plain Gazebo it reached the goal on all 30 layouts.",
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
            type: "p",
            text: "Limits: 3 seeds per arm, only rectangular obstacles, and no real robot yet. Next is measuring real wheel slip on a Burger with the same command sequence I used in Gazebo, then testing the LDS-02 model on a small course.",
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
    when: "14–22 Sep 2026",
    role: "Solo",
    stack: ["Python", "Gymnasium", "Stable-Baselines3 (PPO, CnnPolicy)", "PyTorch (CUDA)"],
    media: {
      src: "/media/car.webp",
      poster: "/media/car.jpg",
      alt: "Top-down view of the red car following a grey track through green grass.",
      caption: "The final model (1,835,008 steps) on track seed 3, recorded for this page. It finished that lap with a reward of 912.9.",
      width: 420,
      height: 245,
    },
    stats: [
      { value: "849.0 ± 10.2", label: "mean reward on 30 random tracks" },
      { value: "18 / 30", label: "laps finished" },
      { value: "0.56%", label: "steps with 2+ wheels off the road" },
    ],
    intro:
      "The agent only gets a 96×96 image: no speed, no map, and a new random track every episode. Most of what I learned came from things going wrong.",
    sections: [
      {
        heading: "Setup",
        blocks: [
          {
            type: "list",
            items: [
              "PPO with a CNN policy, 16 environments in parallel, and the last 4 frames stacked so it can see speed.",
              "On my RTX 4060 one learning update went from 212 ms to 23 ms. Training overall only got about 2.5× faster, because the game itself runs on the CPU.",
              "At the end of every run I keep the best of three: the old saved model, the best evaluated one and the final one. In several runs the final one was worse.",
            ],
          },
        ],
      },
      {
        heading: "The car never braked",
        blocks: [
          {
            type: "p",
            text: "At 753k steps it drove well until a hairpin. Its average brake output was −0.77, which clips to zero: braking at random early on had cost reward, so it learned never to brake. gSDE exploration didn't fix it: the brake still read 0.000 before every crash, and the real steering noise measured 0.874 on an axis from −1 to +1. Plain Gaussian noise, where the setting is the actual noise, trained properly.",
          },
        ],
      },
      {
        heading: "The two wrappers that mattered",
        blocks: [
          {
            type: "code",
            id: "off-track-penalty",
            caption: "CarRacing doesn't penalise grass at all. This costs 1.2 per frame with 2 or more wheels off the road. Time off the road fell from 30.5% to 7.8%.",
          },
          {
            type: "code",
            id: "steering-penalty",
            caption: "Charges the squared change in steering between decisions, so big swings cost far more than small corrections. Smoothing the actions hadn't stopped the wobble. Putting smoothness in the reward did.",
          },
        ],
      },
      {
        heading: "Staged training",
        blocks: [
          {
            type: "p",
            text: "With every penalty on from step 0, the car parked at the start line: standing still was cheaper than driving badly. Adding one wrapper at a time worked.",
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
            text: "A control run without the steering penalty scored the same (838.5), so that gain came from the extra training. The penalty's real effect showed on 30 tracks: 0.93% of steps off the road against 6.41%, and no spin-outs.",
          },
        ],
      },
      {
        heading: "How strong a penalty?",
        blocks: [
          {
            type: "table",
            head: ["Steering penalty", "Mean reward (30 tracks)", "Off the road", "Laps of 30"],
            rows: [
              ["none", "775.7 ± 27.3", "6.41%", "12"],
              ["×2", "812.1 ± 15.7", "0.93%", "13"],
              ["×4", "810.7 ± 23.9", "2.83%", "16"],
              ["×8, from the stage 2 model", "632.8 ± 35.7", "13.79%", "7"],
              ["×8, from the ×4 model", "849.0 ± 10.2", "0.56%", "18"],
              ["×16, from the ×8 model", "collapsed to about −150", "off the track", "0"],
            ],
            caption: "Same number of training steps for every row. ± is the standard error.",
          },
          {
            type: "p",
            text: "The same ×8 penalty gave 633 on a model still learning to drive and 849 on one that already drove well. At ×16 it stopped steering entirely, since a wheel held still costs nothing.",
          },
        ],
      },
      {
        heading: "What I took from it",
        blocks: [
          {
            type: "list",
            items: [
              "Size a penalty by measuring what the current behaviour would cost. My first guess was about 25 times too small.",
              "Change one thing per run, and run a control.",
              "Five-episode evaluations aren't a result. Scores swung by 300 points on the same model, so comparisons here use 10 or 30 fixed tracks.",
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
    when: "9–11 Sep 2026",
    role: "Solo",
    stack: ["Python", "Gymnasium", "Stable-Baselines3 (PPO, DQN)", "NumPy"],
    stats: [
      { value: "58 / 58", label: "valid starting cells solved by both PPO and DQN on the 8×8 grid" },
      { value: "8.21", label: "PPO's mean episode length on 5×5, where the minimum is 8" },
    ],
    intro:
      "My first environment written from scratch: a grid, a goal and some traps. I wrote reset(), step() and render() myself, trained PPO and DQN on it, and fixed whatever broke.",
    sections: [
      {
        heading: "5×5, one trap",
        blocks: [
          { type: "gridworld" },
          {
            type: "list",
            items: [
              "PPO: episode length fell from 32.8 to 8.21 (the shortest path is 8), and it reached the goal 100 times out of 100.",
              "DQN diverged. Bumping a wall cost 0 while a move cost −1, so it sat bumping walls for free. Charging −1 for a bump fixed it.",
            ],
          },
        ],
      },
      {
        heading: "8×8, five traps",
        blocks: [
          {
            type: "p",
            text: "With a flat −1 per step, walking into a trap after 4 steps (reward ≈ −13) beat finding the 14-step path (≈ −3). Rewarding progress toward the goal made the long path findable.",
          },
          {
            type: "code",
            id: "gridworld-reward",
            caption: "The reward in step(). This is the current version of the file, where a wall bump costs −3.",
          },
        ],
      },
      {
        heading: "Train where you test",
        blocks: [
          {
            type: "p",
            text: "Both models still failed from some cells near the traps, because they had only ever started at (0, 0). Drawing random starts from a list of valid cells fixed it: both reached the goal from all 58.",
          },
        ],
      },
      {
        heading: "Mistakes I made",
        blocks: [
          {
            type: "list",
            items: [
              "No step limit, so a bad policy could loop forever. FrozenLake's built-in wrapper had hidden that from me.",
              "An (x, y) versus (row, col) mix-up meant my sweep wasn't excluding the traps at all.",
              "`EvalCallback` always names its file best_model.zip, so PPO and DQN runs sharing a folder would overwrite each other.",
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
      src: "/media/frozen.webp",
      poster: "/media/frozen.jpg",
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
      "PPO had worked on LunarLander, but I couldn't say how. A 16-cell lake is small enough to watch a reward change the value of the steps before it, the same idea PPO and DQN use with a neural network instead of a table.",
    sections: [
      {
        heading: "The update rule",
        blocks: [
          {
            type: "code",
            id: "q-update",
            caption: "Look one step ahead, then nudge the old estimate toward the reward plus the discounted best next value. The TODO comments are from the skeleton I rewrote it from.",
          },
          {
            type: "p",
            text: "Around it: a 16 × 4 table of zeros, and epsilon-greedy exploration that starts at 1.0 and decays by 0.999 per episode to 0.01.",
          },
        ],
      },
      {
        heading: "Results",
        blocks: [
          {
            type: "table",
            head: ["Training episodes (slippery)", "Success rate"],
            rows: [
              ["20,000", "71–78%"],
              ["100,000", "78%"],
              ["200,000", "71–72%"],
            ],
          },
          {
            type: "p",
            text: "The slippery ice only moves you where you meant a third of the time, so no policy wins every time. Around 78% is close to that ceiling.",
          },
        ],
      },
      {
        heading: "Bugs that taught me something",
        blocks: [
          {
            type: "list",
            items: [
              "`np.zeros(16, 4)` reads the 4 as a dtype. The shape has to be a tuple.",
              "`np.argmax` gives the best action, `np.max` its value. The update needs the value.",
              "Forgetting `state = next_state` in evaluation kept looking up the start state every step.",
            ],
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
    when: "7–8 Sep 2026",
    role: "Solo",
    stack: ["Python", "Gymnasium", "Stable-Baselines3 (PPO)", "Box2D"],
    media: {
      src: "/media/lunar.webp",
      poster: "/media/lunar.jpg",
      alt: "A purple lander descending on its main engine and settling between two yellow flags on white ground.",
      caption: "The trained model (about 1M steps) landing on seed 3, recorded for this page. Episode return 235.3; 200 counts as solved.",
      width: 480,
      height: 320,
    },
    intro:
      "The first thing I trained. I got a lander that touched down between the flags, then spent the next day working out why it behaved the way it did.",
    sections: [
      {
        heading: "Changing one number",
        blocks: [
          {
            type: "table",
            head: ["Training steps", "What the lander did"],
            rows: [
              ["100k", "Never tried to land. Flew upward every time."],
              ["200k", "Descended slowly, but steered mostly after touching down."],
              ["300k", "Landed between the flags about 40% of the time."],
              ["400k", "Mostly landed on a flag, not the centre, on two seeds."],
              ["500k", "Landed between the flags most of the time."],
            ],
          },
          {
            type: "p",
            text: "Crashing is penalised heavily, so the 100k agent found it safer not to try landing at all.",
          },
        ],
      },
      {
        heading: "Reading the reward",
        blocks: [
          {
            type: "code",
            id: "lunar-shaping",
            caption: "From Gymnasium's source. Each step is rewarded for improving on the last: closer to the pad, slower, more upright, legs down.",
          },
          {
            type: "p",
            text: "Because every step says \"warmer\" or \"colder\", the agent never has to stumble onto a perfect landing by luck. Reading this is also how I learned how a Gymnasium environment is built, which I needed for GridWorld.",
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
    when: "Jul–Aug 2026",
    role: "Team of 2",
    stack: ["Flutter", "Dart", "Android Studio", "Firebase Auth", "Cloud Firestore", "Geoapify Places API", "USDA FoodData Central API"],
    links: [{ label: "View the code on GitHub", href: "https://github.com/lebaaaa/healthcare" }],
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
              "Turning another service's JSON into my own models, with a fallback like \"Contact not found\" for every field a clinic might be missing, so one incomplete listing doesn't crash the screen.",
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
export const earlierProjects = projects.filter((p) => p.group === "earlier");

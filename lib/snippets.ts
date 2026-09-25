// Verbatim excerpts from the project files in C:\AI Testing (and, for LunarLander,
// Gymnasium's MIT-licensed source). Line numbers match the original files.

export type Snippet = { file: string; start: number; code: string };

export const snippets: Record<string, Snippet> = {
  "steering-penalty": {
    "file": "car_racing_skip/steering_penalty.py",
    "start": 14,
    "code": "def step(self, action):\n    obs, reward, terminated, truncated, info = self.env.step(action)\n    angle = action.copy()\n    if self.prev is None:\n        self.prev = angle[0]\n        self.penalty = 0\n    else:\n        self.penalty = ((angle[0] - self.prev) ** 2) * self.penalty_multi\n        self.prev = angle[0]\n\n\n    reward -= self.penalty\n    return obs, reward, terminated, truncated, info"
  },
  "off-track-penalty": {
    "file": "car_racing_skip/off_track_penalty.py",
    "start": 10,
    "code": "def step(self, action):\n    obs, reward, terminated, truncated, info = self.env.step(action)\n    wheels = self.env.unwrapped.car.wheels\n\n    if sum(len(w.tiles)==0 for w in wheels) >= self.wheels_off:\n        reward -= self.penalty"
  },
  "q-update": {
    "file": "frozen_lake/train_qlearning.py",
    "start": 34,
    "code": "next_state, reward, terminated, truncated, info = env.step(action)\n\n# TODO 3: compute best_next_q, td_target, and update q_table[state, action]\n# (remember: multiply the gamma*best_next_q term by (not terminated))\nbest_next_q = np.max(q_table[next_state])\ntd_target = reward + gamma * best_next_q * (not terminated)\nq_table[state, action] += learning_rate * (td_target - q_table[state, action])\nstate = next_state"
  },
  "gridworld-reward": {
    "file": "personal_testing/custom_env1.py",
    "start": 82,
    "code": "if self.agent_pos == self.goal_pos:\n    reward += 10\n    terminated = True\nelif self.agent_pos in self.bad_pos:\n    reward -= 10\n    terminated = True\nelif (row, col) == (old_row, old_col):\n    reward -= 3\n    terminated = False\nelse:\n    old_dist = self._distance_to_goal((old_row, old_col))\n    new_dist = self._distance_to_goal((row, col))\n    reward = old_dist - new_dist  # +1 if closer, -1 if farther\n    terminated = False"
  },
  "lunar-shaping": {
    "file": "gymnasium/envs/box2d/lunar_lander.py",
    "start": 637,
    "code": "reward = 0\nshaping = (\n    -100 * np.sqrt(state[0] * state[0] + state[1] * state[1])\n    - 100 * np.sqrt(state[2] * state[2] + state[3] * state[3])\n    - 100 * abs(state[4])\n    + 10 * state[6]\n    + 10 * state[7]\n)  # And ten points for legs contact, the idea is if you\n# lose contact again after landing, you get negative reward\nif self.prev_shaping is not None:\n    reward = shaping - self.prev_shaping\nself.prev_shaping = shaping"
  }
};

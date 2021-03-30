import { SWITCH_NETWORK, SWITCH_THEME, SWITCH_MODE } from "./actionTypes";

export const switchNetwork = (network) => ({
  type: SWITCH_NETWORK,
  payload: { network },
});

export const switchTheme = (theme) => ({
  type: SWITCH_THEME,
  payload: { theme },
});

export const switchMode = (mode) => ({
  type: SWITCH_MODE,
  payload: { mode },
});

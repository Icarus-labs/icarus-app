import { SWITCH_NETWORK, SWITCH_THEME, SWITCH_MODE } from "../actionTypes";
import config from "config";

const queryParams = new URLSearchParams(window.location.search);
const paramNetwork = queryParams.get("network");

const initialState = {
  network:
    localStorage.getItem("network") || paramNetwork || config.defaultNetwork,
  theme: localStorage.getItem("theme") || "light",
  mode: localStorage.getItem("mode") || "card",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SWITCH_NETWORK: {
      const { network } = action.payload;
      localStorage.setItem('network', network)
      return {
        ...state,
        network: network,
      };
    }
    case SWITCH_THEME: {
      const { theme } = action.payload;
      localStorage.setItem('theme', theme)
      return {
        ...state,
        theme: theme,
      };
    }
    case SWITCH_MODE: {
      const { mode } = action.payload;
      localStorage.setItem('mode', mode)
      return {
        ...state,
        mode: mode,
      };
    }
    default:
      return state;
  }
}

export const switchNetwork = () => (dispatch) => {
  dispatch({ type: "SWITCH_NETWORK" });
};

export const switchTheme = () => (dispatch) => {
    dispatch({ type: "SWITCH_THEME" });
  };

  
  export const switchMode = () => (dispatch) => {
    dispatch({ type: "SWITCH_MODE" });
  };
  

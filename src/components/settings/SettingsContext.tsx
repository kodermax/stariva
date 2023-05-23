/* eslint-disable @typescript-eslint/no-empty-function */
import {
  useMemo,
  useState,
  ReactNode,
  useEffect,
  useContext,
  useCallback,
  createContext,
} from "react";

//
import { defaultSettings } from "./config";
import { defaultPreset, getPresets, presetsOption } from "./presets";
import {
  ThemeModeValue,
  ThemeLayoutValue,
  ThemeStretchValue,
  ThemeContrastValue,
  SettingsContextProps,
  ThemeColorPresetsValue,
} from "./types";

// ----------------------------------------------------------------------

const initialState: SettingsContextProps = {
  ...defaultSettings,

  // Mode
  onToggleMode: () => {},
  onChangeMode: () => {},

  // Layout
  onChangeLayout: () => {},

  // Contrast
  onToggleContrast: () => {},
  onChangeContrast: () => {},

  // Color
  onChangeColorPresets: () => {},
  presetsColor: defaultPreset,
  presetsOption: [],

  // Stretch
  onToggleStretch: () => {},

  // Reset
  onResetSetting: () => {},
};

// ----------------------------------------------------------------------

export const SettingsContext = createContext(initialState);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);

  if (!context)
    throw new Error("useSettingsContext must be use inside SettingsProvider");

  return context;
};

// ----------------------------------------------------------------------

type SettingsProviderProps = {
  children: ReactNode;
};

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [themeMode, setThemeMode] = useState(defaultSettings.themeMode);
  const [themeLayout, setThemeLayout] = useState(defaultSettings.themeLayout);
  const [themeStretch, setThemeStretch] = useState(
    defaultSettings.themeStretch
  );
  const [themeContrast, setThemeContrast] = useState(
    defaultSettings.themeContrast
  );
  const [themeColorPresets, setThemeColorPresets] = useState(
    defaultSettings.themeColorPresets
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mode = getCookie("themeMode") || defaultSettings.themeMode;
      const layout = getCookie("themeLayout") || defaultSettings.themeLayout;
      const stretch = getCookie("themeStretch") || defaultSettings.themeStretch;
      const contrast =
        getCookie("themeContrast") || defaultSettings.themeContrast;
      const colorPresets =
        getCookie("themeColorPresets") || defaultSettings.themeColorPresets;

      setThemeMode(mode as ThemeModeValue);
      setThemeLayout(layout as ThemeLayoutValue);
      setThemeStretch(stretch as ThemeStretchValue);
      setThemeContrast(contrast as ThemeContrastValue);
      setThemeColorPresets(colorPresets as ThemeColorPresetsValue);
    }
  }, []);

  // Mode

  const onToggleMode = useCallback(() => {
    const value = themeMode === "light" ? "dark" : "light";
    setThemeMode(value);
    setCookie("themeMode", value);
  }, [themeMode]);

  const onChangeMode = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value as ThemeModeValue;
      setThemeMode(value);
      setCookie("themeMode", value);
    },
    []
  );

  // Layout
  const onChangeLayout = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value as ThemeLayoutValue;
      setThemeLayout(value);
      setCookie("themeLayout", value);
    },
    []
  );

  // Contrast
  const onToggleContrast = useCallback(() => {
    const value = themeContrast === "default" ? "bold" : "default";
    setThemeContrast(value);
    setCookie("themeContrast", value);
  }, [themeContrast]);

  const onChangeContrast = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value as ThemeContrastValue;
      setThemeContrast(value);
      setCookie("themeContrast", value);
    },
    []
  );

  // Color
  const onChangeColorPresets = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value as ThemeColorPresetsValue;
      setThemeColorPresets(value);
      setCookie("themeColorPresets", value);
    },
    []
  );

  // Stretch
  const onToggleStretch = useCallback(() => {
    const value = !themeStretch;
    setThemeStretch(value);
    setCookie("themeStretch", JSON.stringify(value));
  }, [themeStretch]);

  // Reset
  const onResetSetting = useCallback(() => {
    setThemeMode(defaultSettings.themeMode);
    setThemeLayout(defaultSettings.themeLayout);
    setThemeStretch(defaultSettings.themeStretch);
    setThemeContrast(defaultSettings.themeContrast);
    setThemeColorPresets(defaultSettings.themeColorPresets);
    removeCookie("themeMode");
    removeCookie("themeLayout");
    removeCookie("themeStretch");
    removeCookie("themeContrast");
    removeCookie("themeDirection");
    removeCookie("themeColorPresets");
  }, []);

  const value = useMemo(
    () => ({
      // Mode
      themeMode,
      onToggleMode,
      onChangeMode,

      // Layout
      themeLayout,
      onChangeLayout,

      // Contrast
      themeContrast,
      onChangeContrast,
      onToggleContrast,

      // Stretch
      themeStretch,
      onToggleStretch,

      // Color
      themeColorPresets,
      onChangeColorPresets,
      presetsOption,
      presetsColor: getPresets(themeColorPresets),

      // Reset
      onResetSetting,
    }),
    [
      onChangeColorPresets,
      onChangeContrast,
      onChangeLayout,
      onChangeMode,
      onResetSetting,
      onToggleContrast,
      onToggleMode,
      onToggleStretch,
      themeColorPresets,
      themeContrast,
      themeLayout,
      themeMode,
      themeStretch,
    ]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// ----------------------------------------------------------------------

function getCookie(name: string) {
  if (typeof document === "undefined") {
    throw new Error(
      "getCookie() is not supported on the server. Fallback to a different value when rendering on the server."
    );
  }

  const value = `; ${document.cookie}`;

  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts[1].split(";").shift();
  }

  return undefined;
}

function setCookie(name: string, value: string, exdays = 3) {
  const date = new Date();
  date.setTime(date.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function removeCookie(name: string) {
  document.cookie = `${name}=;path=/;max-age=0`;
}

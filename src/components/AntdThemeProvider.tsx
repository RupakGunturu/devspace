import { ConfigProvider, theme as antdTheme } from "antd";
import type { ReactNode } from "react";
import { useTheme } from "./ThemeProvider";

const lightTokens = {
  colorPrimary: "#d4a843",
  colorBgContainer: "#f5f3ee",
  colorBgElevated: "#f5f3ee",
  colorBgLayout: "#fcfbf8",
  colorText: "#1a1a2e",
  colorTextSecondary: "#6b7280",
  colorBorder: "#d6d3c8",
  colorBorderSecondary: "#e5e2d9",
  borderRadius: 6,
  fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
};

const darkTokens = {
  colorPrimary: "#d4a843",
  colorBgContainer: "#2a2a3e",
  colorBgElevated: "#2a2a3e",
  colorBgLayout: "#121220",
  colorText: "#e8e6e3",
  colorTextSecondary: "#9ca3af",
  colorBorder: "#3f3f5a",
  colorBorderSecondary: "#35354d",
  borderRadius: 6,
  fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
};

export function AntdThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: isDark ? darkTokens : lightTokens,
        components: {
          DatePicker: {
            controlHeight: 36,
            fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
          },
          Calendar: {
            fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

import Core from "@airbnb/lunar";

function applyThemeColors() {
  const { aesthetic } = Core;
  const { themes } = aesthetic;
  const { light } = themes;
  const { color, pattern, ui, unit } = light;

  light.unit = 8;

  // color.accent.border = borderColor;
  // color.accent.borderError = "#DF2323";
  // color.accent.borderActive = primary[3];
  // color.accent.textActive = primary[3];

  // ui.border = `${ui.borderWidth}px solid ${borderColor}`;
  // ui.borderThick = `${ui.borderWidthThick}px solid ${borderColor}`;
  ui.borderRadius = 2;
  ui.transitionTime = "175ms";
  ui.boxShadow = "rgb(48 48 48 / 100%) 0px 4px 16px";
  ui.boxShadowMedium = "rgb(48 48 48 / 100%) 0px 4px 16px";
  ui.boxShadowLarge = "rgb(48 48 48 / 100%) 0px 4px 16px";

  // color.core.primary = primary;

  // pattern.smallButton.borderWidth = 1;
  // pattern.smallButton.padding = `${
  //   unit / 2 - pattern.smallButton.borderWidth
  // }px ${unit - pattern.smallButton.borderWidth}px`;
}

Core.initialize({
  defaultLocale: "en",
  defaultTimezone: "UTC",
  name: "AppName",
});

applyThemeColors();

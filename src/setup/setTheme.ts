import Core from "@airbnb/lunar";

function applyThemeColors() {
  const { aesthetic } = Core;
  const { themes } = aesthetic;
  const { light } = themes;
  const { dark } = themes;
  const { color, pattern, ui, unit } = light;
  Object.keys(light).forEach((key) => {
    light[key] = dark[key];
  });

  light.unit = 8;
  light.ui.borderRadius = 4;
  light.ui.borderWidth = 1;
  light.ui.borderWidthThick = 1;
  // light.ui.border = `1px solid black`;
  // light.ui.borderThick = `1px solid black`;

  // color.accent.border = borderColor;
  // color.accent.borderError = "#DF2323";
  // color.accent.borderActive = primary[3];
  // color.accent.textActive = primary[3];

  // ui.border = `${ui.borderWidth}px solid ${borderColor}`;
  // ui.borderThick = `${ui.borderWidthThick}px solid ${borderColor}`;
  // ui.transitionTime = "175ms";
  // ui.boxShadow = "rgb(48 48 48 / 100%) 0px 4px 16px";
  // ui.boxShadowMedium = "rgb(48 48 48 / 100%) 0px 4px 16px";
  // ui.boxShadowLarge = "rgb(48 48 48 / 100%) 0px 4px 16px";
  // ui.borderWidth = 1;
  // ui.borderWidthThick = 1;

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

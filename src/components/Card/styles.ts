import { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";

export const styleSheetCard: StyleSheet = ({ color, pattern, ui }) => ({
  card: {
    // ...pattern.box,
    border: "1px solid rgba(214, 214, 214, 0.5)",
    borderRadius: 2,
    background: color.accent.bg,
    overflow: "hidden",
    // position: "relative",

    // ":after": {
    //   position: "absolute",
    //   content: "''",
    //   width: "100%",
    //   height: "100%",
    //   left: 0,
    //   top: 0,
    //   boxShadow: `rgb(48 48 48 / 14%) 0px 4px 16px !important`,
    //   opacity: 1,
    //   transition: `opacity 125ms ease-in-out`,
    // },
  },

  card_overflow: {
    overflow: "visible",
  },

  card_noShadow: {
    // ":after": {
    //   opacity: 0,
    // },
  },

  card_selected: {
    border: ui.borderThick,
    borderColor: color.core.primary[3],
  },
});

export const styleSheetContent: StyleSheet = ({
  color,
  pattern,
  ui,
  unit,
}) => ({
  container: {
    borderBottom: ui.border,

    ":last-child": {
      borderBottom: 0,
    },
  },

  container_button: {
    ...pattern.resetButton,
    borderBottom: ui.border,
    display: "block",
    textAlign: "left",
    width: "100%",

    "@selectors": {
      ":hover, :focus": {
        backgroundColor: color.accent.bgHover,
        outline: "none",
      },
    },
  },

  side: {
    display: "flex",
    height: "100%",
    alignItems: "flex-start",
    paddingTop: unit * 3,
    paddingBottom: unit * 3,
  },

  side_middleAlign: {
    alignItems: "center",
  },

  side_compact: {
    paddingTop: unit * 1.5,
    paddingBottom: unit * 1.5,
  },

  side_noPadding: {
    padding: 0,
  },

  sideButton: {
    ...pattern.resetButton,
    height: "100%",

    "@selectors": {
      ":hover, :focus": {
        outline: "none",
      },

      "> span": {
        height: "100%",
        display: "block",
      },
    },
  },

  after: {
    paddingRight: unit * 3,
  },

  after_compact: {
    paddingRight: unit * 1.5,
  },

  before: {
    paddingLeft: unit * 3,
  },

  before_compact: {
    paddingLeft: unit * 1.5,
  },
});

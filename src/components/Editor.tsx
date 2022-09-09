import useTheme from "@airbnb/lunar/lib/hooks/useTheme";
import useStyles, { StyleSheet } from "@airbnb/lunar/lib/hooks/useStyles";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { db } from "../setup/setupFirebase";
import { set, ref } from "firebase/database";
import { useRecoilValue } from "recoil";

import IconAdd from "@airbnb/lunar-icons/lib/interface/IconAdd";
import IconClose from "@airbnb/lunar-icons/lib/interface/IconClose";
import IconTitle from "@airbnb/lunar-icons/lib/general/IconTitle";
import IconChevronDown from "@airbnb/lunar-icons/lib/interface/IconChevronDown";
import IconChevronUp from "@airbnb/lunar-icons/lib/interface/IconChevronUp";

import toRGBA from "@airbnb/lunar/lib/utils/toRGBA";
import { uidState } from "../atoms";

import HiddenButtons, { HiddenButton } from "./HiddenButtons";

export const editorStyleSheet: StyleSheet = ({ color, ui }) => ({
  editor_content_wrap: {},
  editor_wrap_hide_toolbar: {
    "@selectors": {
      "> span > .editor > .ql-toolbar": {
        display: "none",
      },
    },
  },
  editor_wrap_max_height: {
    display: "block",
    maxHeight: 40,
    overflow: "scroll",
    "::-webkit-scrollbar": {
      display: "none",
    },
  },
  editor_wrap: {
    position: "relative",
    background: "white",
    border: `1px solid ${toRGBA(color.accent.border, 50)}`,
    borderRadius: ui.borderRadius,
    "@selectors": {
      "> span > .editor > .ql-container": {
        width: "100%",
        border: "none",
        fontSize: 15,
      },

      "> span > .editor  > .ql-container > .ql-editor": {
        padding: "8px 12px 8px 12px",
      },

      "> span > .editor  > .ql-container > .ql-editor > ul": {
        paddingLeft: "0em",
      },

      "> span > .editor > .ql-container > .ql-editor > ul > li:before": {
        paddingRight: "0.5em",
      },
    },
  },
});

type EditorProps = {
  hover: boolean;
  id: string;
  content: string;
  initialCollapsed?: boolean;
  initialHideToolbar?: boolean;
};

export default function Editor({
  hover,
  id,
  content,
  initialCollapsed,
  initialHideToolbar,
}: EditorProps) {
  const [value, setValue] = useState(content);
  const [styles, cx] = useStyles(editorStyleSheet);
  const [focus, setFocus] = useState(false);
  const [collapsed, setCollapsed] = useState(initialCollapsed ?? true);
  const [hideToolbar, setHideToolbar] = useState(initialHideToolbar);
  const { color } = useTheme();

  const uid = useRecoilValue(uidState);

  return (
    <div
      className={cx(
        styles.editor_wrap,
        !hideToolbar && styles.editor_wrap_hide_toolbar
      )}
    >
      <HiddenButtons isHidden={!hover && !focus}>
        <>
          <HiddenButton
            onClick={() => {
              set(ref(db, `${uid}/tasks/${id}/hideToolbar`), !hideToolbar);
              setHideToolbar(!hideToolbar);
            }}
          >
            {hideToolbar ? (
              <IconTitle decorative color={color.core.secondary[6]} />
            ) : (
              <IconTitle decorative />
            )}
          </HiddenButton>
          <HiddenButton
            onClick={() => {
              set(ref(db, `${uid}/tasks/${id}/collapsed`), !collapsed);

              setCollapsed(!collapsed);
            }}
          >
            {collapsed ? (
              <IconChevronDown decorative />
            ) : (
              <IconChevronUp decorative />
            )}
          </HiddenButton>
        </>
      </HiddenButtons>
      <span className={cx(collapsed && styles.editor_wrap_max_height)}>
        <ReactQuill
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className="editor"
          theme="snow"
          value={value}
          onChange={(value) => {
            set(ref(db, `${uid}/tasks/${id}/title`), value);
            setValue(value);
          }}
        />
      </span>
    </div>
  );
}

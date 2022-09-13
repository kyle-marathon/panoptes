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

export const editorStyleSheet: any = ({ color, unit }: any) => {
  const stylesObj: any = {
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
      maxHeight: 24,
      overflow: "scroll",
      "::-webkit-scrollbar": {
        display: "none",
      },
    },
    editor_wrap: {
      width: "100%",
      position: "relative",
      "@selectors": {
        "> span > .editor > .ql-toolbar": {
          border: "none",
          borderBottom: `1px solid ${toRGBA(color.accent.border, 50)}`,
          marginBottom: unit,
          marginLeft: -1.5 * unit,
          paddingTop: 0,
        },
        "> span > .editor > .ql-container": {
          width: "100%",
          border: "none",
          fontSize: 15,
        },

        "> span > .editor  > .ql-container > .ql-editor": {
          padding: 0,
        },

        "> span > .editor  > .ql-container > .ql-editor > ul": {
          paddingLeft: "0em",
        },

        "> span > .editor > .ql-container > .ql-editor > ul > li:before": {
          paddingRight: "0.25em",
        },
      },
    },
  };

  [1, 2, 3, 4, 5, 6, 7, 8].forEach((x) => {
    stylesObj.editor_wrap["@selectors"][
      `> span > .editor  > .ql-container > .ql-editor > ul > li.ql-indent-${x}`
    ] = { paddingLeft: `${1.5 * (x + 1)}em` };
  });

  return stylesObj;
};

type EditorProps = {
  id: string;
  content: string;
  collapsed?: boolean;
  hideToolbar?: boolean;
  extraHiddenButtons: JSX.Element;
  onFocus: () => void;
  onBlur: () => void;
};

export default function Editor({
  id,
  content,
  collapsed,
  hideToolbar,
  onFocus,
  onBlur,
}: EditorProps) {
  const [value, setValue] = useState(content);
  const [styles, cx] = useStyles(editorStyleSheet);

  const uid = useRecoilValue(uidState);

  return (
    <div
      className={cx(
        styles.editor_wrap,
        (!hideToolbar || collapsed) && styles.editor_wrap_hide_toolbar
      )}
    >
      <span className={cx(collapsed && styles.editor_wrap_max_height)}>
        <ReactQuill
          onFocus={onFocus}
          onBlur={onBlur}
          className="editor"
          theme="snow"
          value={value}
          modules={{
            clipboard: {
              matchVisual: false,
            },
          }}
          onChange={(value) => {
            set(ref(db, `${uid}/tasks/${id}/title`), value);
            setValue(value);
          }}
        />
      </span>
    </div>
  );
}

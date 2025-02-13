import { CSSProperties } from "react";

type Transformation = {
  style: CSSProperties;
  condition: (value: string) => boolean;
  transformation: (value: string, cursorPosition: number) => string;
};

const H1_SIZE = "3.75rem"; // 60px
const H2_SIZE = "3rem"; // 48px
const H3_SIZE = "2.25rem"; // 36px
const H4_SIZE = "1.875rem"; // 30px
const H5_SIZE = "1.5rem"; // 24px
const H6_SIZE = "1.25rem"; // 20px

const H1_LINE_HEIGHT = "4.5rem"; // 1.2x header height
const H2_LINE_HEIGHT = "3.75rem"; // 1.25x header height
const H3_LINE_HEIGHT = "3rem"; // ~1.33x header height
const H4_LINE_HEIGHT = "2.5rem"; // ~1.33x header height
const H5_LINE_HEIGHT = "2rem"; // ~1.33x header height
const H6_LINE_HEIGHT = "1.75rem"; // 1.4x header height

export const transformations: Transformation[] = [
  {
    style: {
      fontSize: H1_SIZE,
      lineHeight: H1_LINE_HEIGHT,
      height: H1_LINE_HEIGHT,
    },
    condition: (value) => value.startsWith("# "),
    transformation: (value) => value.slice(2),
  },
  {
    style: {
      fontSize: H2_SIZE,
      lineHeight: H2_LINE_HEIGHT,
      height: H2_LINE_HEIGHT,
    },
    condition: (value) => value.startsWith("## "),
    transformation: (value) => value.slice(3),
  },
  {
    style: {
      fontSize: H3_SIZE,
      lineHeight: H3_LINE_HEIGHT,
      height: H3_LINE_HEIGHT,
    },
    condition: (value) => value.startsWith("### "),
    transformation: (value) => value.slice(4),
  },
  {
    style: {
      fontSize: H4_SIZE,
      lineHeight: H4_LINE_HEIGHT,
      height: H4_LINE_HEIGHT,
    },
    condition: (value) => value.startsWith("#### "),
    transformation: (value) => value.slice(5),
  },
  {
    style: {
      fontSize: H5_SIZE,
      lineHeight: H5_LINE_HEIGHT,
      height: H5_LINE_HEIGHT,
    },
    condition: (value) => value.startsWith("##### "),
    transformation: (value) => value.slice(6),
  },
  {
    style: {
      fontSize: H6_SIZE,
      lineHeight: H6_LINE_HEIGHT,
      height: H6_LINE_HEIGHT,
    },
    condition: (value) => value.startsWith("###### "),
    transformation: (value) => value.slice(7),
  },
];

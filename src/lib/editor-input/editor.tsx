import { createContext, createRef, useContext, useRef } from "react";
import { createStore, StateCreator, StoreApi, useStore } from "zustand";
import { transformations } from "./utils/transformation";

type LineProps = {
  index: number;
};

const LINE_HEIGHT = 20;
const FONT_SIZE = 16;
const FONT_FAMILY = "Mukta Malar";
const COLOR = "#1d1d1d";

const PREVENTED_KEYS = ["Enter", "Tab", "ArrowUp", "ArrowDown"];

const Line = ({ index }: LineProps) => {
  const { store } = useContext(context);
  const line = useStore(store, (state) => state.line);
  const edit = useStore(store, (state) => state.edit);
  const setCursorPosition = useStore(store, (state) => state.setCursorPosition);
  const content = useStore(store, (state) => state.content[index]);

  function getCursorPosition() {
    const input = content.ref.current;
    if (!input) return { line: index, column: 0 };
    const { selectionStart } = input;

    if (!selectionStart) return { line: index, column: 0 };

    const column = selectionStart;
    return { line: index, column };
  }

  const transformation = transformations.find((t) => {
    return t.condition(content.value);
  });

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        position: "relative",
        minHeight: `${LINE_HEIGHT}px`,
        paddingBottom: ".5rem",
        boxSizing: "content-box",
        ...transformation?.margins,
      }}
    >
      <textarea
        type="text"
        ref={content.ref}
        value={content.value}
        onChange={(e) => {
          setCursorPosition(index, e.target.selectionStart ?? 0);
          edit(index, e.target.value);
          adjustTextareaHeight(e.target as HTMLTextAreaElement);
        }}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "start",
          justifyContent: "start",
          minHeight: `${LINE_HEIGHT}px`,
          height: "auto",
          fontSize: `${FONT_SIZE}px`,
          fontFamily: FONT_FAMILY,
          letterSpacing: "normal",
          fontWeight: "inherit",
          backgroundColor: "transparent",
          color: "transparent",
          borderColor: "#d3d3d3",
          border: "none",
          width: "100%",
          margin: 0,
          outline: "none",
          padding: 0,
          resize: "none",
          overflow: "hidden",
          ...transformation?.style,
          position: "absolute",
          caretColor: COLOR,
          zIndex: 1,
        }}
        onKeyDown={(e) => {
          if (PREVENTED_KEYS.includes(e.key)) {
            e.preventDefault();
          }

          const { selectionStart, selectionEnd } = content.ref.current;

          if (
            e.key === "Backspace" &&
            selectionStart === 0 &&
            selectionEnd === 0
          ) {
            e.preventDefault();
            store.getState().deleteLine(index);
          }

          if (e.key === "ArrowRight") {
            if (selectionEnd === content.value.length) {
              e.preventDefault();
              store.getState().move("down", "start");
            } else {
              requestAnimationFrame(() => {
                const { column } = getCursorPosition();
                setCursorPosition(
                  index,
                  Math.min(column, content.value.length)
                );
              });
            }
          }

          if (e.key === "ArrowLeft") {
            if (selectionStart === 0) {
              if (index > 0) {
                e.preventDefault();
                store.getState().move("up", "end");
              }
            } else {
              requestAnimationFrame(() => {
                const { column } = getCursorPosition();
                setCursorPosition(index, Math.max(column, 0));
              });
            }
          }
        }}
        onClick={() => {
          const { column } = getCursorPosition();
          setCursorPosition(index, column);
        }}
        onFocus={() => {
          requestAnimationFrame(() => {
            const { column } = getCursorPosition();
            setCursorPosition(index, column);
          });
        }}
      />
      <div
        style={{
          display: "flex",
          width: "100%",
          minHeight: `${LINE_HEIGHT}px`,
          height: "auto",
          fontSize: `${FONT_SIZE}px`,
          fontFamily: FONT_FAMILY,
          letterSpacing: "normal",
          fontWeight: "inherit",
          padding: 0,
          margin: 0,
          zIndex: 0,
          whiteSpace: "pre-wrap",
          ...transformation?.style,
        }}
      >
        {line === index && transformation && (
          <span style={{ color: "grey", whiteSpace: "pre-wrap" }}>
            {transformation.indicator}
          </span>
        )}
        <span style={{ color: COLOR, whiteSpace: "pre-wrap" }}>
          {content.value.slice(transformation?.indicator.length)}
        </span>
      </div>
    </div>
  );
};

export function Editor() {
  const rootStyle = {
    width: "100%",
    border: "1px solid #ccc",
    padding: "10px",
    backgroundColor: "#f0f0f0",
    minHeight: 400,
    color: "black",
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    justifyContent: "start",
  } as const;

  const store = useRef(createEditorStore());
  const lines = useStore(store.current, (state) => state.content.length);

  //   const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      console.log("Enter key pressed");
      store.current.getState().addLine();
    }

    if (event.key === "Tab") {
      event.preventDefault();
      console.log("Tab key pressed");
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      store.current.getState().move("up");
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      store.current.getState().move("down");
    }
  };

  return (
    <context.Provider value={{ store: store.current }}>
      <div
        style={rootStyle}
        // onFocus={() => setIsFocused(true)}
        // onBlur={() => setIsFocused(false)}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {Array.from({ length: lines }).map((_, index) => (
          <Line key={index} index={index} />
        ))}
        {/* <Inspector /> */}
      </div>
    </context.Provider>
  );
}

type EditorContext = {
  store: StoreApi<EditorStore>;
};

const context = createContext<EditorContext>({
  get store(): StoreApi<EditorStore> {
    throw new Error("EditorContext not found");
  },
});

interface CursorStore {
  line: number;
  column: number;
  move(
    direction: "up" | "down" | "left" | "right",
    position?: "start" | "end"
  ): void;
  setCursorPosition(line: number, column: number): void;
}

type LineT = {
  value: string;
  ref: React.RefObject<HTMLInputElement>;
};

interface ContentStore {
  content: Array<LineT>;
  setContent: (
    content: { value: string; ref: React.RefObject<HTMLInputElement> }[]
  ) => void;
  addLine: () => void;
  deleteLine: (index: number) => void;
  edit: (line: number, value: string) => void;
}

interface EditorStore extends CursorStore, ContentStore {}

function setCaretPosition(input: HTMLInputElement, position?: "start" | "end") {
  if (position === "start") {
    input.setSelectionRange(0, 0);
  } else if (position === "end") {
    input.setSelectionRange(input.value.length, input.value.length);
  }
}

const createCursorStore: StateCreator<EditorStore, [], [], CursorStore> = (
  set
) => ({
  line: 0,
  column: 0,
  move: (
    direction: "up" | "down" | "left" | "right",
    position?: "start" | "end"
  ) => {
    set((state) => {
      const line = state.line;
      const column = state.column;

      if (direction === "up" && line > 0) {
        const next = state.content[line - 1];
        next.ref.current?.focus();
        setCaretPosition(next.ref.current, position);
        return { line: line - 1, column };
      }

      if (direction === "down" && line < state.content.length - 1) {
        const next = state.content[line + 1];
        next.ref.current?.focus();
        setCaretPosition(next.ref.current, position);

        return { line: line + 1, column };
      }

      return state;
    });
  },
  setCursorPosition: (line: number, column: number) => {
    set(() => {
      return { line, column };
    });
  },
});

const createContentStore: StateCreator<EditorStore, [], [], ContentStore> = (
  set
) => ({
  content: [
    { value: "# A Brief History of JavaScript", ref: createInputRef() },
    {
      value:
        "JavaScript is a programming language that represents one of the three core languages used to develop websites, alongside HTML and CSS. Whereas HTML and CSS give a website structure and style, JavaScript lets you add functionality and behaviors to your website. This allows visitors to interact with your website in various creative ways.",
      ref: createInputRef(),
    },
    {
      value:
        "Mosaic was the first web browser with a graphical user interface. It was first released in 1993 and played a key role in the rapid development of the web as we know it today. The lead developers of Mosaic founded Netscape (now Mozilla) and released a more elegant browser called Netscape Navigator in 1994.",
      ref: createInputRef(),
    },
    {
      value:
        "In September 1995, a Netscape programmer named Brendan Eich developed a new scripting language in just 10 days. It was originally called Mocha, but quickly became known as LiveScript and, later, JavaScript.",
      ref: createInputRef(),
    },
    {
      value:
        "> The best software developers are those who can balance creativity and logic.",
      ref: createInputRef(),
    },
    { value: "- Brendan Eich", ref: createInputRef() },
    {
      value:
        "The language derived its syntax from Java, its first-class functions from Scheme, and its prototype-based inheritance from Self. Since then, JavaScript has been adopted by all major graphical web browsers.",
      ref: createInputRef(),
    },
    {
      value: "## JavaScript vs. Java",
      ref: createInputRef(),
    },
    {
      value:
        "The choice of using the name “JavaScript” has always caused some confusion that the language is directly related to Java. However, except for syntactic resemblance, JavaScript has almost nothing to do with the Java programming language. They are both completely different languages.",
      ref: createInputRef(),
    },
    {
      value:
        "When JavaScript was initially introduced, Java was being heavily marketed and was the most talked-about language at the time. So Netscape thought it would be a good idea to capitalize on this success by creating the name.",
      ref: createInputRef(),
    },
  ],
  setContent: (
    content: { value: string; ref: React.RefObject<HTMLInputElement> }[]
  ) => {
    set({ content });
  },
  edit: (line: number, value: string) => {
    set((state) => {
      return {
        content: state.content.map((l, i) =>
          i === line ? { ...l, value } : l
        ),
      };
    });
  },
  addLine: () => {
    set((state) => {
      const { line, column } = state;
      const lineContent = state.content[line];
      const emptyLine = { value: "", ref: createInputRef() };

      if (lineContent.value.length > 0 && column !== lineContent.value.length) {
        emptyLine.value = lineContent.value.slice(column);
        state.content[line] = {
          ...lineContent,
          value: lineContent.value.slice(0, column),
        };
      }

      state.content.splice(line + 1, 0, emptyLine);
      return {
        content: state.content,
        line: line + 1,
        column: 0,
      };
    });

    queueFocus(set, (current) => {
      current.setSelectionRange(0, 0);
    });
  },
  deleteLine: (index: number) => {
    let deleted: LineT;

    set((state) => {
      deleted = state.content[index];
      state.content[index - 1].value += deleted.value;
      state.content.splice(index, 1);
      return { content: state.content, line: index - 1, column: 0 };
    });

    queueFocus(set, (current, state) => {
      const position = Math.max(
        0,
        state.content[state.line].value.length - deleted.value.length
      );
      current.setSelectionRange(position, position);
    });
  },
});

function queueFocus(
  set: Parameters<StateCreator<EditorStore, [], [], EditorStore>>[0],
  after?: (current: HTMLInputElement, state: EditorStore) => void
) {
  function queue(
    after?: (current: HTMLInputElement, state: EditorStore) => void
  ) {
    queueMicrotask(() => {
      set((state) => {
        const current = state.content[state.line]?.ref?.current;
        if (current) {
          current.focus();
          after?.(current, state);
        } else {
          queue(after);
        }
        return state;
      });
    });
  }

  queue(after);
}

function createEditorStore() {
  return createStore<EditorStore>()((set, a, b) => ({
    ...createCursorStore(set, a, b),
    ...createContentStore(set, a, b),
  }));
}

function createInputRef(): React.RefObject<HTMLInputElement> {
  return createRef<HTMLInputElement>() as never;
}

function Inspector() {
  const { store } = useContext(context);
  const line = useStore(store, (state) => state.line);
  const column = useStore(store, (state) => state.column);
  const content = useStore(store, (state) => state.content);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "white",
        border: "1px solid #ccc",
        fontSize: "8px",
      }}
    >
      <pre>{JSON.stringify({ line, column }, null, 2)}</pre>
      <pre>
        {JSON.stringify(
          content.map((c) => c.value),
          null,
          2
        )}
      </pre>
    </div>
  );
}

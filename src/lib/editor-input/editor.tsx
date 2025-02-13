import { createContext, createRef, useContext, useRef } from "react";
import { createStore, StateCreator, StoreApi, useStore } from "zustand";

type LineProps = {
  index: number;
};

const PREVENTED_KEYS = ["Enter", "Tab", "ArrowUp", "ArrowDown"];

const Line = ({ index }: LineProps) => {
  const { store } = useContext(context);
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

  const style = content.value.startsWith("#") ? { fontSize: "28px" } : {};

  return (
    <input
      type="text"
      ref={content.ref}
      value={content.value}
      onChange={(e) => {
        const { line, column } = getCursorPosition();
        setCursorPosition(line, column);
        edit(index, e.target.value);
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "start",
        justifyContent: "start",
        height: `${LINE_HEIGHT}px`,
        fontSize: `${FONT_SIZE}px`,
        backgroundColor: "transparent",
        color: "black",
        borderColor: "#d3d3d3",
        border: "none",
        width: "100%",
        borderWidth: "1px",
        margin: "1px",
        outline: "none",
        ...style,
      }}
      onKeyDown={(e) => {
        if (PREVENTED_KEYS.includes(e.key)) {
          e.preventDefault();
        }

        if (e.key === "Backspace" && getCursorPosition().column === 0) {
          e.preventDefault();
          store.getState().deleteLine(index);
        }

        if (e.key === "ArrowRight") {
          requestAnimationFrame(() => {
            const { line, column } = getCursorPosition();
            setCursorPosition(line, Math.min(column, content.value.length));
          });
        }

        if (e.key === "ArrowLeft") {
          requestAnimationFrame(() => {
            const { line, column } = getCursorPosition();
            setCursorPosition(line, Math.max(column, 0));
          });
        }
      }}
      onClick={() => {
        console.log("clicked", index, content.ref.current);
        const { line, column } = getCursorPosition();
        setCursorPosition(line, column);
      }}
      onFocus={() => {
        requestAnimationFrame(() => {
          const { line, column } = getCursorPosition();
          setCursorPosition(line, column);
        });
      }}
    />
  );
};

const LINE_HEIGHT = 20;
const FONT_SIZE = 16;

export function Editor() {
  const rootStyle = {
    width: "100%",
    border: "1px solid #ccc",
    padding: "10px",
    backgroundColor: "#f0f0f0",
    height: 400,
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
      console.log("ArrowUp key pressed");
      store.current.getState().move("up");
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      console.log("ArrowDown key pressed");
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
        <Inspector />
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
    modifier?: "word" | "line"
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

const createCursorStore: StateCreator<EditorStore, [], [], CursorStore> = (
  set
) => ({
  line: 0,
  column: 0,
  move: (
    direction: "up" | "down" | "left" | "right",
    modifier?: "word" | "line"
  ) => {
    set((state) => {
      console.log("move", direction, modifier);

      const line = state.line;
      const column = state.column;

      if (direction === "up" && line > 0) {
        state.content[line - 1].ref.current?.focus();
        return { line: line - 1, column };
      }

      if (direction === "down" && line < state.content.length - 1) {
        state.content[line + 1].ref.current?.focus();
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
    { value: "👋🏻 Hello world", ref: createInputRef() },
    { value: "How are you?", ref: createInputRef() },
    { value: "I'm fine, thank you!", ref: createInputRef() },
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

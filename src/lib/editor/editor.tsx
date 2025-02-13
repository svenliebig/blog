import { useState } from "react"
import { createStore, StateCreator, useStore } from "zustand"

const LINE_HEIGHT = 20
const FONT_SIZE = 16

export function Editor() {
    const rootStyle = {
        width: '100%',
        border: '1px solid #ccc',
        padding: '10px',
        backgroundColor: '#f0f0f0',
        height: 400,
        color: 'black',
    }

    const editorStore = createEditorStore()
    const { content, addLine } = useStore(editorStore)

    const [isFocused, setIsFocused] = useState(false)

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            console.log('Enter key pressed')
            addLine()
        }

        
    }

    return <div style={rootStyle} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} tabIndex={0} onKeyDown={handleKeyDown}>
        {content.map((line, index) => (
            <Line key={index}>{line}</Line>
        ))}
        {isFocused ? <Cursor /> : null}
    </div>
}

interface EditorStore extends CursorStore {
    content: string[]
    setContent: (content: string[]) => void
    addLine: () => void
}

interface CursorStore {
    line: number
    column: number
    move(direction: 'up' | 'down' | 'left' | 'right', modifier?: 'word' | 'line'): void
}

const createCursorStore: StateCreator<CursorStore, [], [], CursorStore> = (set) => ({
    line: 0,
    column: 0,
    move: (direction: 'up' | 'down' | 'left' | 'right', modifier?: 'word' | 'line') => set((state) => {
        return state
    }),
})

function createEditorStore() {
    return createStore<EditorStore>((set, a, b) => ({
        content: ['hello world'],
        setContent: (content: string[]) => set({ content }),
        addLine: () => set((state) => ({ content: [...state.content, ''] })),
        ...createCursorStore(set, a, b),
    }))
}

function Line({ children }: { children: React.ReactNode }) {
    return <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'start',
        justifyContent: 'start',
        height: `${LINE_HEIGHT}px`,
        fontSize: `${FONT_SIZE}px`,
    }}>
        {children}
    </div>
}

function Cursor() {
    return <div style={{
        width: '1px',
        backgroundColor: 'black',
        height: `${FONT_SIZE}px`,
        alignSelf: 'end'
    }} />
}
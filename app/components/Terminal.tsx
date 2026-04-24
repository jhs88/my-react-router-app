import { useEffect, useRef, useState, useCallback } from "react";
import { Bash } from "just-bash";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TerminalLine {
  type: "output" | "error" | "input";
  text: string;
}

interface CommandEntry {
  command: string;
  output: TerminalLine[];
}

interface TerminalState {
  history: CommandEntry[];
  currentInput: string;
  cursorPosition: number;
  commandHistory: string[];
  commandHistoryIndex: number;
}

interface CommandDefinition {
  name: string;
  description: string;
  handler: (args: string[], bash: Bash) => Promise<string>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_PROMPT = "jhs@journal:~$ ";

const COMMANDS: CommandDefinition[] = [
  {
    name: "help",
    description: "Show available commands",
    handler: async (args, bash) => {
      const width = Math.min(80, (args[0] as unknown as number) || 80);
      let out = "Available commands:\n\n";
      const maxNameLen = Math.max(...COMMANDS.map((c) => c.name.length));
      for (const cmd of COMMANDS) {
        const pad = " ".repeat(maxNameLen - cmd.name.length + 2);
        out += `  ${cmd.name}${pad}${cmd.description}\n`;
      }
      out += "\nType a command name and press Enter to execute.";
      return out;
    },
  },
  {
    name: "clear",
    description: "Clear the terminal screen",
    handler: async () => {
      return "";
    },
  },
  {
    name: "about",
    description: "About this journal",
    handler: async () => {
      return (
        "A journal exploring the craft of software — design, typography,\n" +
        "and building with purpose.\n\n" +
        "Visit /about for more information."
      );
    },
  },
  {
    name: "blog",
    description: "View the journal",
    handler: async () => {
      return "Visit /blog to read all articles.";
    },
  },
  {
    name: "ls",
    description: "List blog posts",
    handler: async (args, bash) => {
      try {
        const entries = await bash.fs.readdir("/posts");
        if (entries.length === 0) {
          return "No posts found.";
        }
        return entries.map((e) => e.name).join("  ");
      } catch {
        return "No posts directory found.";
      }
    },
  },
  {
    name: "pwd",
    description: "Print working directory",
    handler: async () => {
      return "/home/jhs/journal";
    },
  },
  {
    name: "date",
    description: "Show current date and time",
    handler: async () => {
      return new Date().toString();
    },
  },
  {
    name: "whoami",
    description: "Show author information",
    handler: async () => {
      return "jhs — software craftsman";
    },
  },
  {
    name: "neofetch",
    description: "Show system information",
    handler: async () => {
      return "jhs@journal\n" + "──────────\n" + "OS: React Router 7\n" + "Shell: just-bash\n" + "Theme: OKLCH + Geist\n" + "Fonts: Geist Variable\n" + "Styling: Tailwind CSS 4\n" + "Content: MDX";
    },
  },
  {
    name: "theme",
    description: "Toggle dark/light theme",
    handler: async () => {
      return "Theme toggled. (See /theme for implementation)";
    },
  },
];

const COMMAND_NAMES = COMMANDS.map((c) => c.name);

// ---------------------------------------------------------------------------
// Helper: render terminal content to text lines
// ---------------------------------------------------------------------------

function renderTerminalContent(state: TerminalState): TerminalLine[] {
  const lines: TerminalLine[] = [];
  for (const entry of state.history) {
    lines.push({ type: "input", text: DEFAULT_PROMPT + entry.command });
    for (const line of entry.output) {
      lines.push(line);
    }
  }
  lines.push({ type: "input", text: DEFAULT_PROMPT + state.currentInput });
  return lines;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Terminal() {
  const [state, setState] = useState<TerminalState>({
    history: [],
    currentInput: "",
    cursorPosition: 0,
    commandHistory: [],
    commandHistoryIndex: -1,
  });

  const [bash] = useState(() => {
    const b = new Bash({
      fs: {
        type: "in-memory",
        initialFiles: {
          "/posts": {
            type: "directory",
            entries: {},
          },
        },
      },
    });
    return b;
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isFocused = useRef(false);
  const [focused, setFocused] = useState(false);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [state.history, state.currentInput]);

  // -----------------------------------------------------------------------
  // Command execution
  // -----------------------------------------------------------------------

  const executeCommand = useCallback(
    async (cmd: string) => {
      const trimmed = cmd.trim();
      if (!trimmed) return;

      const [name, ...args] = trimmed.split(/\s+/);
      const command = COMMANDS.find((c) => c.name === name);

      if (!command) {
        setState((prev) => ({
          ...prev,
          history: [
            ...prev.history,
            {
              command: trimmed,
              output: [{ type: "error", text: `command not found: ${name}` }],
            },
          ],
          currentInput: "",
          cursorPosition: 0,
          commandHistory: [...prev.commandHistory, trimmed],
          commandHistoryIndex: -1,
        }));
        return;
      }

      // Special handling for 'clear' — clear all history
      if (name === "clear") {
        setState((prev) => ({
          ...prev,
          history: [],
          currentInput: "",
          cursorPosition: 0,
          commandHistory: [...prev.commandHistory, trimmed],
          commandHistoryIndex: -1,
        }));
        return;
      }

      try {
        const output = await command.handler(args, bash);
        setState((prev) => ({
          ...prev,
          history: [
            ...prev.history,
            {
              command: trimmed,
              output: output ? [{ type: "output", text: output }] : [],
            },
          ],
          currentInput: "",
          cursorPosition: 0,
          commandHistory: [...prev.commandHistory, trimmed],
          commandHistoryIndex: -1,
        }));
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "unknown error";
        setState((prev) => ({
          ...prev,
          history: [
            ...prev.history,
            {
              command: trimmed,
              output: [{ type: "error", text: message }],
            },
          ],
          currentInput: "",
          cursorPosition: 0,
          commandHistory: [...prev.commandHistory, trimmed],
          commandHistoryIndex: -1,
        }));
      }
    },
    [bash],
  );

  // -----------------------------------------------------------------------
  // Keyboard handling
  // -----------------------------------------------------------------------

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Tab autocomplete
      if (e.key === "Tab") {
        e.preventDefault();
        const input = state.currentInput;
        const prefix = input.split(/\s+/).pop() ?? "";
        const matches = COMMAND_NAMES.filter((c) => c.startsWith(prefix));
        if (matches.length === 1) {
          const parts = input.split(/\s+/);
          parts[parts.length - 1] = matches[0];
          setState((prev) => ({
            ...prev,
            currentInput: parts.join(" "),
            cursorPosition: parts.join(" ").length,
          }));
        } else if (matches.length > 1) {
          // Show suggestions
          setState((prev) => ({
            ...prev,
            history: [
              ...prev.history,
              {
                command: input + "\t",
                output: [
                  {
                    type: "output",
                    text: matches.join("  "),
                  },
                ],
              },
            ],
            currentInput: input,
            cursorPosition: input.length,
          }));
        }
        return;
      }

      // Up arrow — command history
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (state.commandHistory.length === 0) return;
        const newIndex =
          state.commandHistoryIndex === -1
            ? state.commandHistory.length - 1
            : Math.max(0, state.commandHistoryIndex - 1);
        const cmd = state.commandHistory[newIndex];
        setState((prev) => ({
          ...prev,
          currentInput: cmd,
          cursorPosition: cmd.length,
          commandHistoryIndex: newIndex,
        }));
        return;
      }

      // Down arrow — command history
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (state.commandHistoryIndex === -1) return;
        const newIndex = state.commandHistoryIndex + 1;
        if (newIndex >= state.commandHistory.length) {
          // Back to empty
          setState((prev) => ({
            ...prev,
            currentInput: "",
            cursorPosition: 0,
            commandHistoryIndex: -1,
          }));
        } else {
          const cmd = state.commandHistory[newIndex];
          setState((prev) => ({
            ...prev,
            currentInput: cmd,
            cursorPosition: cmd.length,
            commandHistoryIndex: newIndex,
          }));
        }
        return;
      }

      // Enter — execute
      if (e.key === "Enter") {
        e.preventDefault();
        executeCommand(state.currentInput);
      }
    },
    [state, executeCommand],
  );

  // -----------------------------------------------------------------------
  // Focus management
  // -----------------------------------------------------------------------

  const handleFocus = useCallback(() => {
    isFocused.current = true;
    setFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    isFocused.current = false;
    setFocused(false);
  }, []);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  const displayLines = renderTerminalContent(state);

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#0d1117] text-[#c9d1d9] rounded-lg overflow-y-auto"
      style={{ maxHeight: "32rem" }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs text-[#8b949e] font-mono">
          jhs@journal:~
        </span>
      </div>

      {/* Terminal body */}
      <div className="p-4 font-mono text-sm leading-relaxed">
        {displayLines.map((line, i) => {
          if (line.type === "input") {
            // Check if this is the last line (current input line)
            const isLastLine = i === displayLines.length - 1;
            return (
              <div key={i} className="whitespace-pre-wrap break-all">
                {line.text}
                {isLastLine && focused && (
                  <span className="inline-block w-2 h-4 bg-[#c9d1d9] ml-0.5 animate-pulse" />
                )}
              </div>
            );
          }
          if (line.type === "error") {
            return (
              <div key={i} className="whitespace-pre-wrap break-all text-[#f85149]">
                {line.text}
              </div>
            );
          }
          return (
            <div key={i} className="whitespace-pre-wrap break-all text-[#c9d1d9]">
              {line.text}
            </div>
          );
        })}

        {/* Hidden input for capturing keystrokes */}
        <input
          ref={inputRef}
          type="text"
          value={state.currentInput}
          onChange={(e) =>
            setState((prev) => ({
              ...prev,
              currentInput: e.target.value,
              cursorPosition: e.target.value.length,
            }))
          }
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="sr-only"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Terminal input"
        />
      </div>
    </div>
  );
}

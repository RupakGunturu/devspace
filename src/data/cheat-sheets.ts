import { CheatSheet } from "../types";

export const cheatSheets: CheatSheet[] = [
  {
    id: "git-cheat-sheet",
    title: "Interactive Git Cheat Sheet",
    description: "All essential git commands with examples",
    category: "version-control",
    icon: "GitBranch",
    tags: ["Git", "Commands", "Version Control"],
    content: [
      {
        title: "Setup & Config",
        items: [
          { label: "Set name", code: "git config --global user.name \"Your Name\"", description: "Configure your git username" },
          { label: "Set email", code: "git config --global user.email \"you@example.com\"", description: "Configure your git email" },
          { label: "Check config", code: "git config --list", description: "View all git configurations" },
        ],
      },
      {
        title: "Creating Repos",
        items: [
          { label: "New repo", code: "git init", description: "Initialize a new git repository" },
          { label: "Clone repo", code: "git clone <url>", description: "Clone an existing repository" },
          { label: "Clone specific branch", code: "git clone -b <branch> <url>", description: "Clone a specific branch" },
        ],
      },
      {
        title: "Staging & Committing",
        items: [
          { label: "Stage file", code: "git add <file>", description: "Stage a specific file" },
          { label: "Stage all", code: "git add .", description: "Stage all changes" },
          { label: "Commit", code: "git commit -m \"message\"", description: "Commit staged changes" },
          { label: "Amend commit", code: "git commit --amend", description: "Modify the last commit" },
        ],
      },
      {
        title: "Branching",
        items: [
          { label: "List branches", code: "git branch", description: "List all local branches" },
          { label: "Create branch", code: "git branch <name>", description: "Create a new branch" },
          { label: "Switch branch", code: "git checkout <branch>", description: "Switch to a branch" },
          { label: "Create & switch", code: "git checkout -b <branch>", description: "Create and switch to new branch" },
          { label: "Delete branch", code: "git branch -d <branch>", description: "Delete a branch" },
        ],
      },
      {
        title: "Remote & Push",
        items: [
          { label: "Add remote", code: "git remote add origin <url>", description: "Add a remote repository" },
          { label: "Push", code: "git push origin <branch>", description: "Push to remote" },
          { label: "Force push", code: "git push --force", description: "Force push (use carefully)" },
          { label: "Pull", code: "git pull", description: "Fetch and merge remote changes" },
        ],
      },
      {
        title: "Undoing Changes",
        items: [
          { label: "Unstage file", code: "git reset HEAD <file>", description: "Unstage a file" },
          { label: "Undo commit", code: "git reset --soft HEAD~1", description: "Undo last commit, keep changes" },
          { label: "Discard changes", code: "git checkout -- <file>", description: "Discard working directory changes" },
          { label: "Revert commit", code: "git revert <commit>", description: "Create a new commit that undoes a commit" },
        ],
      },
    ],
  },
  {
    id: "css-flexbox-guide",
    title: "CSS Flexbox Visual Guide",
    description: "Interactive flexbox properties and values",
    category: "css",
    icon: "AlignHorizontalDistributeCenter",
    tags: ["CSS", "Flexbox", "Layout"],
    content: [
      {
        title: "Container Properties",
        items: [
          { label: "display: flex", code: "display: flex;", description: "Enable flexbox on container" },
          { label: "flex-direction", code: "flex-direction: row | column | row-reverse | column-reverse;", description: "Main axis direction" },
          { label: "justify-content", code: "justify-content: flex-start | center | space-between | space-around | space-evenly;", description: "Align items along main axis" },
          { label: "align-items", code: "align-items: stretch | flex-start | center | flex-end | baseline;", description: "Align items along cross axis" },
          { label: "flex-wrap", code: "flex-wrap: nowrap | wrap | wrap-reverse;", description: "Allow items to wrap" },
          { label: "gap", code: "gap: 10px;", description: "Space between flex items" },
        ],
      },
      {
        title: "Item Properties",
        items: [
          { label: "flex-grow", code: "flex-grow: 1;", description: "How much item should grow" },
          { label: "flex-shrink", code: "flex-shrink: 0;", description: "How much item should shrink" },
          { label: "flex-basis", code: "flex-basis: 200px;", description: "Initial size before grow/shrink" },
          { label: "flex shorthand", code: "flex: 1 0 200px;", description: "grow shrink basis" },
          { label: "align-self", code: "align-self: flex-end;", description: "Override container align-items" },
          { label: "order", code: "order: 2;", description: "Reorder items visually" },
        ],
      },
    ],
  },
  {
    id: "css-grid-guide",
    title: "CSS Grid Visual Guide",
    description: "Complete CSS Grid layout reference",
    category: "css",
    icon: "Grid3x3",
    tags: ["CSS", "Grid", "Layout"],
    content: [
      {
        title: "Container Properties",
        items: [
          { label: "display: grid", code: "display: grid;", description: "Enable grid on container" },
          { label: "grid-template-columns", code: "grid-template-columns: repeat(3, 1fr);", description: "Define column tracks" },
          { label: "grid-template-rows", code: "grid-template-rows: auto 1fr auto;", description: "Define row tracks" },
          { label: "gap", code: "gap: 16px;", description: "Space between grid items" },
          { label: "grid-area", code: "grid-template-areas: \"header header\" \"sidebar main\" \"footer footer\";", description: "Named grid areas" },
        ],
      },
      {
        title: "Item Properties",
        items: [
          { label: "grid-column", code: "grid-column: 1 / 3;", description: "Span across columns" },
          { label: "grid-row", code: "grid-row: 1 / span 2;", description: "Span across rows" },
          { label: "grid-area", code: "grid-area: header;", description: "Place in named area" },
          { label: "justify-self", code: "justify-self: center;", description: "Align within cell (horizontal)" },
          { label: "align-self", code: "align-self: end;", description: "Align within cell (vertical)" },
        ],
      },
    ],
  },
  {
    id: "big-o-cheat-sheet",
    title: "Big O Complexity Table",
    description: "Time and space complexity reference",
    category: "computer-science",
    icon: "Clock",
    tags: ["Algorithms", "Complexity", "CS"],
    content: [
      {
        title: "Time Complexity",
        items: [
          { label: "O(1) — Constant", description: "Array access, hash map lookup, stack push/pop" },
          { label: "O(log n) — Logarithmic", description: "Binary search, balanced BST operations" },
          { label: "O(n) — Linear", description: "Array traversal, linear search, counting" },
          { label: "O(n log n) — Linearithmic", description: "Merge sort, quicksort (avg), heap sort" },
          { label: "O(n²) — Quadratic", description: "Bubble sort, selection sort, nested loops" },
          { label: "O(2ⁿ) — Exponential", description: "Recursive Fibonacci, power set generation" },
          { label: "O(n!) — Factorial", description: "Permutations, brute force TSP" },
        ],
      },
      {
        title: "Space Complexity",
        items: [
          { label: "O(1) — Constant", description: "In-place algorithms, iterative solutions" },
          { label: "O(log n) — Logarithmic", description: "Recursive binary search (call stack)" },
          { label: "O(n) — Linear", description: "Hash maps, arrays, recursion depth n" },
          { label: "O(n²) — Quadratic", description: "2D arrays, adjacency matrix" },
        ],
      },
    ],
  },
  {
    id: "js-array-methods",
    title: "JavaScript Array Methods",
    description: "Complete array method reference with examples",
    category: "javascript",
    icon: "Braces",
    tags: ["JavaScript", "Arrays", "Methods"],
    content: [
      {
        title: "Mutating Methods",
        items: [
          { label: "push()", code: "arr.push(item)", description: "Add to end" },
          { label: "pop()", code: "arr.pop()", description: "Remove from end" },
          { label: "shift()", code: "arr.shift()", description: "Remove from start" },
          { label: "unshift()", code: "arr.unshift(item)", description: "Add to start" },
          { label: "splice()", code: "arr.splice(start, count, ...items)", description: "Insert/remove at index" },
          { label: "sort()", code: "arr.sort((a, b) => a - b)", description: "Sort in place" },
          { label: "reverse()", code: "arr.reverse()", description: "Reverse in place" },
        ],
      },
      {
        title: "Non-Mutating Methods",
        items: [
          { label: "map()", code: "arr.map(x => x * 2)", description: "Transform each element" },
          { label: "filter()", code: "arr.filter(x => x > 5)", description: "Keep elements matching condition" },
          { label: "reduce()", code: "arr.reduce((acc, x) => acc + x, 0)", description: "Accumulate to single value" },
          { label: "find()", code: "arr.find(x => x.id === 1)", description: "Find first matching element" },
          { label: "includes()", code: "arr.includes(item)", description: "Check if item exists" },
          { label: "flat()", code: "arr.flat(2)", description: "Flatten nested arrays" },
          { label: "flatMap()", code: "arr.flatMap(x => [x, x * 2])", description: "Map + flatten one level" },
        ],
      },
    ],
  },
  {
    id: "react-hooks-reference",
    title: "React Hooks Reference",
    description: "All React hooks with examples",
    category: "react",
    icon: "Atom",
    tags: ["React", "Hooks", "Reference"],
    content: [
      {
        title: "State Hooks",
        items: [
          { label: "useState", code: "const [state, setState] = useState(initialValue)", description: "Local component state" },
          { label: "useReducer", code: "const [state, dispatch] = useReducer(reducer, init)", description: "Complex state logic" },
        ],
      },
      {
        title: "Effect Hooks",
        items: [
          { label: "useEffect", code: "useEffect(() => { sideEffect(); return cleanup; }, [deps])", description: "Side effects after render" },
          { label: "useLayoutEffect", code: "useLayoutEffect(() => { /* sync DOM */ }, [deps])", description: "Synchronous side effects" },
        ],
      },
      {
        title: "Context & Ref Hooks",
        items: [
          { label: "useContext", code: "const value = useContext(MyContext)", description: "Consume context value" },
          { label: "useRef", code: "const ref = useRef(initialValue)", description: "Mutable reference that persists" },
          { label: "forwardRef", code: "const MyComp = forwardRef((props, ref) => ...)", description: "Expose ref to parent" },
        ],
      },
      {
        title: "Performance Hooks",
        items: [
          { label: "useMemo", code: "const value = useMemo(() => expensiveCalc(deps), [deps])", description: "Cache computed value" },
          { label: "useCallback", code: "const fn = useCallback(() => doSomething(deps), [deps])", description: "Cache function reference" },
        ],
      },
    ],
  },
  {
    id: "linux-commands",
    title: "Linux Commands Cheat Sheet",
    description: "Essential Linux terminal commands",
    category: "devops",
    icon: "Terminal",
    tags: ["Linux", "Terminal", "Commands"],
    content: [
      {
        title: "Navigation",
        items: [
          { label: "pwd", code: "pwd", description: "Print working directory" },
          { label: "ls", code: "ls -la", description: "List files with details" },
          { label: "cd", code: "cd /path/to/dir", description: "Change directory" },
          { label: "find", code: "find . -name \"*.ts\"", description: "Find files by name" },
        ],
      },
      {
        title: "File Operations",
        items: [
          { label: "cp", code: "cp -r source dest", description: "Copy files/directories" },
          { label: "mv", code: "mv old new", description: "Move/rename files" },
          { label: "rm", code: "rm -rf dir", description: "Remove files/directories" },
          { label: "mkdir", code: "mkdir -p path/to/dir", description: "Create directories" },
          { label: "cat", code: "cat file.txt", description: "Display file contents" },
        ],
      },
      {
        title: "Process & System",
        items: [
          { label: "ps", code: "ps aux | grep node", description: "List processes" },
          { label: "kill", code: "kill -9 <pid>", description: "Kill a process" },
          { label: "top", code: "top", description: "System resource monitor" },
          { label: "df", code: "df -h", description: "Disk space usage" },
          { label: "chmod", code: "chmod +x script.sh", description: "Change file permissions" },
        ],
      },
    ],
  },
  {
    id: "typescript-utilities",
    title: "TypeScript Utilities Reference",
    description: "Built-in TypeScript utility types",
    category: "typescript",
    icon: "FileType",
    tags: ["TypeScript", "Types", "Utilities"],
    content: [
      {
        title: "Type Modifiers",
        items: [
          { label: "Partial<T>", code: "type Partial<T> = { [P in keyof T]?: T[P] }", description: "All properties optional" },
          { label: "Required<T>", code: "type Required<T> = { [P in keyof T]-?: T[P] }", description: "All properties required" },
          { label: "Readonly<T>", code: "type Readonly<T> = { readonly [P in keyof T]: T[P] }", description: "All properties readonly" },
          { label: "Pick<T, K>", code: "type Pick<T, K> = { [P in K]: T[P] }", description: "Select specific properties" },
          { label: "Omit<T, K>", code: "type Omit<T, K> = Pick<T, Exclude<keyof T, K>>", description: "Remove specific properties" },
          { label: "Record<K, T>", code: "type Record<K, T> = { [P in K]: T }", description: "Construct object type" },
        ],
      },
      {
        title: "Advanced Types",
        items: [
          { label: "Exclude<T, U>", code: "type Exclude<T, U> = T extends U ? never : T", description: "Remove types from union" },
          { label: "Extract<T, U>", code: "type Extract<T, U> = T extends U ? T : never", description: "Extract types from union" },
          { label: "NonNullable<T>", code: "type NonNullable<T> = T & {}", description: "Remove null and undefined" },
          { label: "ReturnType<F>", code: "type R = ReturnType<typeof myFunc>", description: "Get function return type" },
          { label: "Parameters<F>", code: "type P = Parameters<typeof myFunc>", description: "Get function parameter types" },
        ],
      },
    ],
  },
  {
    id: "docker-cli",
    title: "Docker CLI Cheat Sheet",
    description: "Essential Docker commands",
    category: "devops",
    icon: "Container",
    tags: ["Docker", "CLI", "Containers"],
    content: [
      {
        title: "Images",
        items: [
          { label: "Build image", code: "docker build -t name:tag .", description: "Build image from Dockerfile" },
          { label: "List images", code: "docker images", description: "List all images" },
          { label: "Pull image", code: "docker pull nginx:latest", description: "Pull image from registry" },
          { label: "Remove image", code: "docker rmi <image>", description: "Delete an image" },
        ],
      },
      {
        title: "Containers",
        items: [
          { label: "Run container", code: "docker run -d -p 3000:3000 --name app name:tag", description: "Run container in background" },
          { label: "List containers", code: "docker ps -a", description: "List all containers" },
          { label: "Stop container", code: "docker stop <container>", description: "Stop a running container" },
          { label: "Remove container", code: "docker rm <container>", description: "Delete a container" },
          { label: "View logs", code: "docker logs -f <container>", description: "Follow container logs" },
          { label: "Execute command", code: "docker exec -it <container> sh", description: "Open shell in container" },
        ],
      },
      {
        title: "Compose",
        items: [
          { label: "Start services", code: "docker-compose up -d", description: "Start all services" },
          { label: "Stop services", code: "docker-compose down", description: "Stop all services" },
          { label: "View logs", code: "docker-compose logs -f", description: "Follow compose logs" },
          { label: "Rebuild", code: "docker-compose up --build", description: "Rebuild and start" },
        ],
      },
    ],
  },
  {
    id: "npm-commands",
    title: "NPM Commands Cheat Sheet",
    description: "Essential npm commands and shortcuts",
    category: "javascript",
    icon: "Package",
    tags: ["NPM", "Node.js", "Packages"],
    content: [
      {
        title: "Package Management",
        items: [
          { label: "Install", code: "npm install <pkg>", description: "Install a package" },
          { label: "Install dev", code: "npm install --save-dev <pkg>", description: "Install as dev dependency" },
          { label: "Install global", code: "npm install -g <pkg>", description: "Install globally" },
          { label: "Uninstall", code: "npm uninstall <pkg>", description: "Remove a package" },
          { label: "Update", code: "npm update", description: "Update all packages" },
        ],
      },
      {
        title: "Scripts",
        items: [
          { label: "Run script", code: "npm run <script>", description: "Execute a script" },
          { label: "List scripts", code: "npm run", description: "Show available scripts" },
          { label: "Lifecycle", code: "preinstall, postinstall, prepublish", description: "Auto-run scripts" },
        ],
      },
      {
        title: "Info & Audit",
        items: [
          { label: "Package info", code: "npm info <pkg>", description: "View package details" },
          { label: "Outdated", code: "npm outdated", description: "Show outdated packages" },
          { label: "Audit", code: "npm audit", description: "Check for vulnerabilities" },
          { label: "Init", code: "npm init -y", description: "Create package.json" },
        ],
      },
    ],
  },
  {
    id: "keyboard-shortcuts",
    title: "Keyboard Shortcut Master Guide",
    description: "Essential shortcuts for developers",
    category: "productivity",
    icon: "Keyboard",
    tags: ["Keyboard", "Shortcuts", "Productivity"],
    content: [
      {
        title: "VS Code",
        items: [
          { label: "Command Palette", code: "Ctrl+Shift+P", description: "Open command palette" },
          { label: "Go to File", code: "Ctrl+P", description: "Quick file navigation" },
          { label: "Find in Files", code: "Ctrl+Shift+F", description: "Search across files" },
          { label: "Toggle Terminal", code: "Ctrl+`", description: "Open/close terminal" },
          { label: "Multi-cursor", code: "Ctrl+D", description: "Select next occurrence" },
          { label: "Comment line", code: "Ctrl+/", description: "Toggle line comment" },
          { label: "Format document", code: "Shift+Alt+F", description: "Auto-format code" },
        ],
      },
      {
        title: "Browser",
        items: [
          { label: "New tab", code: "Ctrl+T", description: "Open new tab" },
          { label: "Close tab", code: "Ctrl+W", description: "Close current tab" },
          { label: "Reopen tab", code: "Ctrl+Shift+T", description: "Reopen last closed tab" },
          { label: "DevTools", code: "F12", description: "Open developer tools" },
          { label: "Find on page", code: "Ctrl+F", description: "Search within page" },
        ],
      },
      {
        title: "Terminal",
        items: [
          { label: "Clear", code: "Ctrl+L", description: "Clear terminal" },
          { label: "Search history", code: "Ctrl+R", description: "Reverse search history" },
          { label: "Kill process", code: "Ctrl+C", description: "Stop current process" },
          { label: "Exit", code: "Ctrl+D", description: "Exit terminal" },
        ],
      },
    ],
  },
  {
    id: "rest-api-reference",
    title: "REST API Best Practices",
    description: "RESTful API design patterns",
    category: "backend",
    icon: "Globe",
    tags: ["REST", "API", "HTTP"],
    content: [
      {
        title: "HTTP Methods",
        items: [
          { label: "GET", description: "Retrieve resources. Should be safe and idempotent" },
          { label: "POST", description: "Create new resources. Not idempotent" },
          { label: "PUT", description: "Replace entire resource. Idempotent" },
          { label: "PATCH", description: "Partially update resource" },
          { label: "DELETE", description: "Remove resource. Idempotent" },
        ],
      },
      {
        title: "Status Codes",
        items: [
          { label: "200 OK", description: "Request succeeded" },
          { label: "201 Created", description: "Resource created successfully" },
          { label: "204 No Content", description: "Success, no response body" },
          { label: "400 Bad Request", description: "Invalid request syntax" },
          { label: "401 Unauthorized", description: "Authentication required" },
          { label: "403 Forbidden", description: "Insufficient permissions" },
          { label: "404 Not Found", description: "Resource doesn't exist" },
          { label: "429 Too Many Requests", description: "Rate limit exceeded" },
          { label: "500 Internal Server Error", description: "Server-side error" },
        ],
      },
      {
        title: "URL Design",
        items: [
          { label: "Use nouns", code: "GET /users/123", description: "Resources as nouns, not verbs" },
          { label: "Plural", code: "/users, /posts", description: "Use plural nouns" },
          { label: "Nesting", code: "/users/123/posts", description: "Show relationships" },
          { label: "Query params", code: "/posts?page=2&limit=10", description: "Filtering and pagination" },
        ],
      },
    ],
  },
  {
    id: "css-selectors",
    title: "CSS Selectors Reference",
    description: "Complete CSS selector patterns",
    category: "css",
    icon: "MousePointerClick",
    tags: ["CSS", "Selectors", "Reference"],
    content: [
      {
        title: "Basic Selectors",
        items: [
          { label: "Universal", code: "*", description: "Select all elements" },
          { label: "Element", code: "div", description: "Select by tag name" },
          { label: "Class", code: ".className", description: "Select by class" },
          { label: "ID", code: "#id", description: "Select by ID" },
          { label: "Attribute", code: "[type=\"text\"]", description: "Select by attribute" },
        ],
      },
      {
        title: "Combinators",
        items: [
          { label: "Descendant", code: "div p", description: "All p inside div" },
          { label: "Child", code: "div > p", description: "Direct child p of div" },
          { label: "Sibling", code: "div + p", description: "p immediately after div" },
          { label: "General sibling", code: "div ~ p", description: "All p after div" },
        ],
      },
      {
        title: "Pseudo-Classes",
        items: [
          { label: ":hover", code: "a:hover", description: "When mouse is over element" },
          { label: ":focus", code: "input:focus", description: "When element has focus" },
          { label: ":nth-child", code: "li:nth-child(2n)", description: "Every even li" },
          { label: ":first-child", code: "p:first-child", description: "First child of parent" },
          { label: ":not()", code: "p:not(.special)", description: "Elements not matching" },
        ],
      },
    ],
  },
  {
    id: "python-one-liners",
    title: "Python One-Liners",
    description: "Common Python shortcuts and tricks",
    category: "python",
    icon: "Code",
    tags: ["Python", "Shortcuts", "Tips"],
    content: [
      {
        title: "List Operations",
        items: [
          { label: "Filter", code: "[x for x in list if x > 0]", description: "List comprehension filter" },
          { label: "Map", code: "[x * 2 for x in list]", description: "Transform each element" },
          { label: "Flatten", code: "[x for sub in list for x in sub]", description: "Flatten nested list" },
          { label: "Unique", code: "list(set(my_list))", description: "Remove duplicates" },
        ],
      },
      {
        title: "String Operations",
        items: [
          { label: "Reverse", code: "\"hello\"[::-1]", description: "Reverse a string" },
          { label: "Join", code: "\", \".join(list)", description: "Join list to string" },
          { label: "Split", code: "\"hello world\".split()", description: "Split string to list" },
        ],
      },
      {
        title: "File & Data",
        items: [
          { label: "Read file", code: "open('file.txt').read()", description: "Read entire file" },
          { label: "JSON", code: "import json; json.loads(string)", description: "Parse JSON string" },
          { label: "Swap", code: "a, b = b, a", description: "Swap two variables" },
        ],
      },
    ],
  },
  {
    id: "sql-cheat-sheet",
    title: "SQL Cheat Sheet",
    description: "Essential SQL queries reference",
    category: "database",
    icon: "Database",
    tags: ["SQL", "Database", "Queries"],
    content: [
      {
        title: "Basic Queries",
        items: [
          { label: "Select", code: "SELECT * FROM users;", description: "Select all rows" },
          { label: "Where", code: "SELECT * FROM users WHERE age > 18;", description: "Filter rows" },
          { label: "Order By", code: "SELECT * FROM users ORDER BY name ASC;", description: "Sort results" },
          { label: "Limit", code: "SELECT * FROM users LIMIT 10;", description: "Limit number of rows" },
        ],
      },
      {
        title: "Joins",
        items: [
          { label: "INNER JOIN", code: "SELECT * FROM orders JOIN users ON orders.user_id = users.id;", description: "Matching rows from both" },
          { label: "LEFT JOIN", code: "SELECT * FROM users LEFT JOIN orders ON users.id = orders.user_id;", description: "All from left, matching from right" },
          { label: "RIGHT JOIN", code: "SELECT * FROM users RIGHT JOIN orders ON users.id = orders.user_id;", description: "All from right, matching from left" },
        ],
      },
      {
        title: "Aggregation",
        items: [
          { label: "COUNT", code: "SELECT COUNT(*) FROM users;", description: "Count rows" },
          { label: "SUM", code: "SELECT SUM(amount) FROM orders;", description: "Sum values" },
          { label: "AVG", code: "SELECT AVG(age) FROM users;", description: "Average value" },
          { label: "GROUP BY", code: "SELECT dept, COUNT(*) FROM employees GROUP BY dept;", description: "Group and aggregate" },
          { label: "HAVING", code: "SELECT dept, COUNT(*) FROM employees GROUP BY dept HAVING COUNT(*) > 5;", description: "Filter after grouping" },
        ],
      },
    ],
  },
  {
    id: "oauth-flow",
    title: "OAuth 2.0 Flow Visualizer",
    description: "Understanding OAuth 2.0 authorization flow",
    category: "security",
    icon: "Shield",
    tags: ["OAuth", "Security", "Auth"],
    content: [
      {
        title: "Authorization Code Flow",
        items: [
          { label: "1. Redirect", description: "Client redirects user to authorization server" },
          { label: "2. Authorize", description: "User grants permission" },
          { label: "3. Code", description: "Server redirects back with authorization code" },
          { label: "4. Token", description: "Client exchanges code for access token" },
          { label: "5. API", description: "Client uses token to access protected resources" },
        ],
      },
      {
        title: "Grant Types",
        items: [
          { label: "Authorization Code", description: "Most secure. For server-side apps" },
          { label: "PKCE", description: "Authorization Code + code verifier. For SPAs/mobile" },
          { label: "Client Credentials", description: "Machine-to-machine. No user involved" },
          { label: "Device Code", description: "For input-constrained devices (TV, CLI)" },
        ],
      },
    ],
  },
  {
    id: "design-patterns",
    title: "Design Patterns Reference",
    description: "Gang of Four patterns simplified",
    category: "computer-science",
    icon: "Blocks",
    tags: ["Design Patterns", "Architecture", "CS"],
    content: [
      {
        title: "Creational Patterns",
        items: [
          { label: "Singleton", description: "Ensure only one instance exists. Config, DB connection" },
          { label: "Factory", description: "Create objects without specifying exact class. Button factory" },
          { label: "Builder", description: "Construct complex objects step by step. Query builder" },
        ],
      },
      {
        title: "Structural Patterns",
        items: [
          { label: "Adapter", description: "Convert one interface to another. API adapter" },
          { label: "Decorator", description: "Add behavior dynamically. Express middleware" },
          { label: "Facade", description: "Simplified interface to complex subsystem. Service layer" },
        ],
      },
      {
        title: "Behavioral Patterns",
        items: [
          { label: "Observer", description: "One-to-many dependency. Event emitter, pub/sub" },
          { label: "Strategy", description: "Interchangeable algorithms. Sort strategies" },
          { label: "Command", description: "Encapsulate requests as objects. Undo/redo" },
        ],
      },
    ],
  },
  {
    id: "solid-principles",
    title: "SOLID Principles Guide",
    description: "Five OOP design principles explained",
    category: "computer-science",
    icon: "Box",
    tags: ["SOLID", "OOP", "Architecture"],
    content: [
      {
        title: "The Principles",
        items: [
          { label: "S — Single Responsibility", description: "A class should have only one reason to change. One job, one class." },
          { label: "O — Open/Closed", description: "Open for extension, closed for modification. Use interfaces and inheritance." },
          { label: "L — Liskov Substitution", description: "Subtypes must be substitutable for their base types. Don't break expectations." },
          { label: "I — Interface Segregation", description: "Don't force clients to depend on interfaces they don't use. Keep interfaces small." },
          { label: "D — Dependency Inversion", description: "Depend on abstractions, not concretions. Use dependency injection." },
        ],
      },
    ],
  },
  {
    id: "web-performance",
    title: "Web Performance Cheat Sheet",
    description: "Optimization techniques for fast websites",
    category: "performance",
    icon: "Gauge",
    tags: ["Performance", "Optimization", "Web"],
    content: [
      {
        title: "Core Web Vitals",
        items: [
          { label: "LCP", description: "Largest Contentful Paint. Should be < 2.5s. Optimize hero images and fonts." },
          { label: "FID", description: "First Input Delay. Should be < 100ms. Minimize main thread blocking." },
          { label: "CLS", description: "Cumulative Layout Shift. Should be < 0.1. Set explicit dimensions on images." },
        ],
      },
      {
        title: "Optimization Tips",
        items: [
          { label: "Lazy load images", code: "<img loading=\"lazy\" />", description: "Load images only when needed" },
          { label: "Preload critical", code: "<link rel=\"preload\" />", description: "Fetch critical resources early" },
          { label: "Code splitting", code: "React.lazy(() => import('./Component'))", description: "Split bundle by routes" },
          { label: "Image formats", description: "Use WebP/AVIF for 25-50% smaller files than JPEG" },
          { label: "Minify assets", description: "Remove whitespace and comments from code" },
        ],
      },
    ],
  },
  {
    id: "git-branch-naming",
    title: "Git Branch Naming Conventions",
    description: "Standardized branch naming patterns",
    category: "version-control",
    icon: "GitCommitHorizontal",
    tags: ["Git", "Branching", "Conventions"],
    content: [
      {
        title: "Branch Types",
        items: [
          { label: "feature/", code: "feature/user-auth", description: "New feature development" },
          { label: "bugfix/", code: "bugfix/login-error", description: "Bug fix" },
          { label: "hotfix/", code: "hotfix/security-patch", description: "Critical production fix" },
          { label: "release/", code: "release/v1.2.0", description: "Release preparation" },
          { label: "chore/", code: "chore/update-deps", description: "Maintenance tasks" },
          { label: "docs/", code: "docs/api-reference", description: "Documentation changes" },
        ],
      },
      {
        title: "Naming Rules",
        items: [
          { label: "Use lowercase", description: "kebab-case: feature/user-auth" },
          { label: "Be descriptive", description: "feature/add-password-reset not feature/fix" },
          { label: "Include ticket ID", description: "feature/JIRA-123-user-auth" },
          { label: "Keep short", description: "Under 50 characters ideal" },
        ],
      },
    ],
  },
  {
    id: "env-variables",
    title: "Environment Variables Guide",
    description: "Managing env vars across environments",
    category: "devops",
    icon: "Lock",
    tags: ["Environment", "Config", "Security"],
    content: [
      {
        title: "Naming Conventions",
        items: [
          { label: "APP_", code: "APP_NAME=MyApp", description: "Application-specific variables" },
          { label: "DATABASE_", code: "DATABASE_URL=postgres://...", description: "Database configuration" },
          { label: "API_", code: "API_KEY=sk-xxx", description: "External API keys" },
          { label: "NODE_ENV", code: "NODE_ENV=production", description: "Runtime environment" },
        ],
      },
      {
        title: "Security Rules",
        items: [
          { label: "Never commit .env", description: "Add .env to .gitignore always" },
          { label: "Use .env.example", description: "Document required vars without values" },
          { label: "Use secrets manager", description: "Vault, AWS SSM, Vercel env vars for production" },
          { label: "Validate on startup", description: "Fail fast if required vars are missing" },
        ],
      },
    ],
  },
  {
    id: "accessibility-checklist",
    title: "Accessibility Checklist",
    description: "WCAG 2.1 compliance checklist",
    category: "accessibility",
    icon: "Eye",
    tags: ["A11y", "WCAG", "Accessibility"],
    content: [
      {
        title: "Essentials",
        items: [
          { label: "Alt text", description: "All images have descriptive alt attributes" },
          { label: "Keyboard nav", description: "All interactive elements are keyboard accessible" },
          { label: "Focus visible", description: "Focus indicators are clearly visible" },
          { label: "Color contrast", description: "Text meets 4.5:1 contrast ratio (AA)" },
          { label: "Labels", description: "All form inputs have associated labels" },
          { label: "Headings", description: "Use proper heading hierarchy (h1 → h2 → h3)" },
        ],
      },
      {
        title: "ARIA",
        items: [
          { label: "role", code: "role=\"button\"", description: "Define element purpose" },
          { label: "aria-label", code: "aria-label=\"Close menu\"", description: "Accessible name" },
          { label: "aria-hidden", code: "aria-hidden=\"true\"", description: "Hide from screen readers" },
          { label: "aria-live", code: "aria-live=\"polite\"", description: "Announce dynamic content" },
        ],
      },
    ],
  },
  {
    id: "regex-patterns",
    title: "Regular Expressions Patterns",
    description: "Common regex patterns for developers",
    category: "javascript",
    icon: "Search",
    tags: ["Regex", "Patterns", "Validation"],
    content: [
      {
        title: "Validation",
        items: [
          { label: "Email", code: "/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/", description: "Basic email validation" },
          { label: "URL", code: "/^https?:\\/\\/.+/", description: "HTTP/HTTPS URL" },
          { label: "Phone", code: "/^\\+?[\\d\\s-]{10,}$/", description: "International phone number" },
          { label: "UUID", code: "/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i", description: "UUID v4" },
        ],
      },
      {
        title: "Extraction",
        items: [
          { label: "Numbers", code: "/\\d+/g", description: "All numbers in string" },
          { label: "Words", code: "/\\b\\w+\\b/g", description: "All words" },
          { label: "HTML tags", code: "/<[^>]+>/g", description: "All HTML tags" },
        ],
      },
      {
        title: "Replacement",
        items: [
          { label: "Multiple spaces", code: "/\\s+/g", description: "Collapse whitespace" },
          { label: "Leading/trailing", code: "/^\\s+|\\s+$/g", description: "Trim whitespace" },
        ],
      },
    ],
  },
];

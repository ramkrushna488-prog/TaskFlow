# 🚀 Quick Start Guide

## 30-Second Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
```
http://localhost:3000
```

**Done!** Your todo app is running! 🎉

---

## Next Steps

### Try It Out
1. **Add a todo** → Type "Learn React" and click Add
2. **Complete it** → Click the checkbox
3. **Delete it** → Click Delete
4. **Add more** → Build your todo list
5. **Refresh page** → Your todos stay there! 💾

### Make It Your Own
- Edit `src/App.jsx` to customize logic
- Edit `src/App.css` to change colors/styles
- Change text in `App.jsx` component (e.g., "My Tasks" → "My Goals")

### Build for Production
```bash
npm run build
```
Creates optimized `dist/` folder for deployment

---

## Common Customizations

### Change App Title
In `src/App.jsx` line 49:
```javascript
<h1>My Tasks</h1>  // Change this
```

### Change Primary Color
In `src/App.css` line 3:
```css
--color-primary: #6366f1;  // Change hex color
```

### Change Placeholder Text
In `src/App.jsx` line 92:
```javascript
placeholder="What needs to be done today?"  // Change this
```

### Add New Feature
1. Open `src/App.jsx`
2. Add state: `const [newState, setNewState] = useState()`
3. Add function: `const newFunction = () => {}`
4. Update JSX to use new function
5. Save and see changes instantly!

---

## File Guide

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main component + logic |
| `src/App.css` | All styling |
| `src/main.jsx` | React entry point |
| `index.html` | HTML template |
| `vite.config.js` | Build configuration |
| `package.json` | Dependencies & scripts |

---

## Keyboard Shortcuts

| Action | Key |
|--------|-----|
| Add todo | Enter (in input field) |
| Focus input | Tab |
| Toggle todo | Space (on checkbox) |
| Navigate | Tab / Shift+Tab |

---

## Useful Commands

```bash
# Development
npm run dev           # Start dev server

# Production
npm run build         # Build for deployment
npm run preview       # Preview production build

# Debugging
npm install           # Install/reinstall dependencies
```

---

## Tips & Tricks

### Clear All Todos
Open DevTools (F12) > Console:
```javascript
localStorage.clear()
location.reload()
```

### Export Todos as JSON
```javascript
const todos = JSON.parse(localStorage.getItem('modernTodoList_todos'))
console.log(JSON.stringify(todos, null, 2))
// Copy output to save
```

### Test Error Handling
```javascript
localStorage.setItem('modernTodoList_todos', 'corrupted')
// App handles gracefully!
```

---

## Deployment (3 Steps)

### 1. Build
```bash
npm run build
```

### 2. Choose Platform
- **Netlify** - Connect GitHub repo (easiest)
- **Vercel** - Same as Netlify
- **Traditional Server** - Upload `dist/` folder

### 3. Deploy
- Netlify: Drag & drop `dist/` folder
- Traditional: Upload `dist/` contents to server

**Done!** App is live! 🌐

---

## Need Help?

- **Setup issues?** Check `README.md`
- **Want to test?** See `TESTING.md`
- **Deploy to production?** Check `DEPLOYMENT.md`
- **Want to customize?** Edit `src/App.jsx` or `src/App.css`

---

## Project Features ✨

✅ Add, complete, delete todos  
✅ Auto-saves to browser storage  
✅ Beautiful responsive design  
✅ Keyboard support  
✅ Works offline  
✅ No external dependencies  
✅ Production ready  

---

**Happy coding!** 💻

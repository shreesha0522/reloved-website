const fs = require('fs');
const path = 'app/components/header.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldBlock = `          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
            <Search size={16} className="text-[#8A7F76] flex-shrink-0" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search for anything"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              className="w-full text-sm text-[#2B2420] bg-transparent outline-none placeholder:text-[#8A7F76]"
            />
          </div>`;

const newBlock = `          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) {
                router.push(\`/search?q=\${encodeURIComponent(query.trim())}\`);
                setIsOpen(false);
              }
            }}
            className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm"
          >
            <Search size={16} className="text-[#8A7F76] flex-shrink-0" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search for anything"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              className="w-full text-sm text-[#2B2420] bg-transparent outline-none placeholder:text-[#8A7F76]"
            />
          </form>`;

if (!content.includes(oldBlock)) {
  console.log('ERROR: old block not found — no changes made.');
  process.exit(1);
}

content = content.replace(oldBlock, newBlock);
fs.writeFileSync(path, content);
console.log('Search bar updated successfully.');

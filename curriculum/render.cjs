'use strict';
const fs=require('node:fs'),path=require('node:path');const dir=__dirname,data=require('./outcomes.json');
const names={physics:'Fizik',chemistry:'Kimya',biology:'Biyoloji'};
for(const subject of Object.keys(names))for(const level of ['TYT','AYT']){
 const rows=data.outcomes.filter(r=>r.subject===subject&&r.level===level);
 const text=`# ${level} ${names[subject]} kapsam tablosu\n\nKaynak ve sınırlar: [SOURCES.md](SOURCES.md). Otomatik kaynak: outcomes.json; yenileme: node curriculum/render.cjs.\n\n${rows.length} kazanım. Durumlar bütün kazanımı anlatır; bir laboratuvarın bulunması tam kabul değildir. Alt açıklamaların durumları JSON kaydında ayrı tutulur. Şu başlangıç envanterinde mevcut sayfaların kazanım bazında kabul eşlemesi bekleniyor.\n\n| MEB kimliği | Kazanım | Durum | Alt açıklama | Kalan iş / kanıt |\n|---|---|---|---:|---|\n`+rows.map(r=>`| ${r.code} | ${r.title.replace(/\|/g,'/')} | ${r.status} | ${r.clauses.length} | ${r.audit.replace(/\|/g,'/')} |`).join('\n')+'\n';
 fs.writeFileSync(path.join(dir,`${level.toLowerCase()}-${subject}.md`),text);
}

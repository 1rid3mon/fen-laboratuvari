/*
 * AYT Fotosentez — ışıktan bağımsız evre / Calvin döngüsü, şematik.
 * 2018 MEB 12.2.2.2: Matematiksel hesap ve ayrıntılı tepkime basamakları yok.
 */
(function (w) {
  'use strict';
  const E = w.EnerjiLab;
  if (!E) return;

  const zones = { CO2: 'carbon', ATP: 'energy', NADPH: 'reducing' };
  const order = ['CO2', 'ATP', 'NADPH'];

  function count(s) { return Object.keys(s.placed).length; }
  function done(s) { return count(s) === order.length; }

  E.registerExperiment('exp3', {
    title: 'Calvin döngüsü',
    subtitle: 'Stromada CO₂ bağlanması ve ATP–NADPH kullanımı (şematik).',
    group: 'FOTOSENTEZ • IŞIKTAN BAĞIMSIZ EVRE',

    createState: function () { return { placed: {} }; },

    render: function (s, U) {
      const n = count(s);
      return {
        step: Math.min(n + 1, 3),
        steps: 3,
        scene: '<h3>Işıktan bağımsız evre: girdileri doğru yerlere koy</h3>'
          + '<p class="summaryline">Bu evre <strong>kloroplastın stromasında</strong> gerçekleşir. Doğrudan ışık kullanılmaz; ancak ışığa bağımlı evrede elde edilmiş ATP ve NADPH gereklidir.</p>'
          + '<div class="scene-grid">'
          + U.zone('carbon', '🌫️ Karbon kaynağı', s.placed.CO2 ? 'CO₂ seçildi ✓' : 'Organik besinin karbonu nereden gelir?', !!s.placed.CO2, !s.placed.CO2)
          + U.zone('energy', '⚡ Enerji', s.placed.ATP ? 'ATP tüketilir ✓' : 'Hangi molekül enerji sağlar?', !!s.placed.ATP, !s.placed.ATP)
          + U.zone('reducing', '🟣 İndirgeme gücü', s.placed.NADPH ? 'NADPH tüketilir ✓' : 'İndirgeme gücünü hangi molekül taşır?', !!s.placed.NADPH, !s.placed.NADPH)
          + '</div>'
          + U.progress(n / 3 * 100)
          + '<p class="math">CO₂ + ATP + NADPH → organik besin sentezi (temsili şema)</p>'
          + '<p class="summaryline"><strong>' + (done(s) ? '✓ Organik besin sentezi için gerekli temel girdiler tamamlandı.' : 'Üç temel girdi henüz tamamlanmadı.') + '</strong> Bu şema molekül sayısı veya glikoz verimi hesabı yapmaz.</p>',
        molecules: ['CO2', 'ATP', 'NADPH', 'H2O', 'O2', 'LIGHT'],
        controls: [],
        metrics: [
          { label: 'Karbon kaynağı', value: s.placed.CO2 ? 'CO₂ ✓' : 'Bekleniyor' },
          { label: 'ATP', value: s.placed.ATP ? 'Kullanılır ✓' : 'Bekleniyor', note: 'Enerji sağlar' },
          { label: 'NADPH', value: s.placed.NADPH ? 'Kullanılır ✓' : 'Bekleniyor', note: 'İndirgeme gücü sağlar' },
          { label: 'Organik besin', value: done(s) ? 'Sentez mümkün ✓' : 'Girdiler eksik', note: 'Glikoz adedi hesaplanmaz' }
        ],
        guidance: 'CO₂, ATP ve NADPH moleküllerini ilgili yuvalarla eşleştir. Işık doğrudan burada kullanılmaz.',
        insight: '2018 MEB: Işıktan bağımsız reaksiyonların giriş ve ürün ilişkisi üzerinde durulur. “Işıktan bağımsız”, tamamen ışıktan etkilenmeyen demek değildir; ATP ve NADPH ışığa bağımlı reaksiyonlardan sağlanır. Calvin ara basamakları ve matematiksel ATP/NADPH hesapları bu kazanımın dışındadır.'
      };
    },

    interact: function (s, zone, mol) {
      if (!mol) return { message: 'CO₂, ATP veya NADPH seçip doğru bölgeye bırak.', level: 'info' };
      if (!Object.prototype.hasOwnProperty.call(zones, mol)) return { message: 'Bu molekül bu evrenin gerekli girdilerinden değil.', level: 'error' };
      if (zones[mol] !== zone) return { message: 'Bu molekül yanlış yuva için seçildi: ' + mol + '.', level: 'error' };
      if (s.placed[mol]) return { message: 'Bu girdi zaten eşleştirildi.', level: 'info' };
      s.placed[mol] = true;
      return { ok: true, message: mol === 'CO2' ? 'CO₂ organik besinin karbon kaynağıdır.' : mol + ' burada kullanılır; ışığa bağımlı evrede üretilir.', complete: done(s) };
    },

    next: function (s, U) {
      const mol = order.find(function (id) { return !s.placed[id]; });
      return mol ? this.interact(s, zones[mol], mol, U) : { message: 'Temel girdiler tamamlandı.', complete: true };
    }
  });
})(window);
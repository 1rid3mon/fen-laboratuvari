/*
 * AYT Fotosentez — ışığa bağımlı reaksiyonlarda giriş/ürün şeması.
 * MEB 2018 12.2.2.2: Tepkime basamakları ve matematiksel hesaplamalar verilmez.
 */
(function (w) {
  'use strict';
  const E = w.EnerjiLab;
  if (!E) return;

  const matches = {
    LIGHT: 'inputs',
    H2O: 'inputs',
    ADP: 'inputs',
    NADP: 'inputs',
    O2: 'products',
    ATP: 'products',
    NADPH: 'products'
  };
  const order = ['LIGHT', 'H2O', 'ADP', 'NADP', 'O2', 'ATP', 'NADPH'];

  function count(s) { return Object.keys(s.placed).length; }
  function finished(s) { return count(s) === order.length; }

  E.registerExperiment('exp2', {
    title: 'Işığa bağımlı tepkimeler',
    subtitle: 'Tilakoit zarında ışık ve su kullanımı; O₂, ATP ve NADPH oluşumu.',
    group: 'FOTOSENTEZ • IŞIĞA BAĞIMLI EVRE',

    createState: function () { return { placed: {}, tracer: 'normal' }; },

    render: function (s, U) {
      const n = count(s);
      const hasInputs = !!(s.placed.LIGHT && s.placed.H2O && s.placed.ADP && s.placed.NADP);
      const inputText = [
        s.placed.LIGHT ? '✓ Işık' : 'Işık',
        s.placed.H2O ? '✓ Su (H₂O)' : 'Su (H₂O)',
        s.placed.ADP ? '✓ ADP + Pi' : 'ADP + Pi',
        s.placed.NADP ? '✓ NADP⁺' : 'NADP⁺'
      ].join(' • ');

      const outputText = [
        s.placed.O2 ? '✓ O₂' : 'O₂',
        s.placed.ATP ? '✓ ATP' : 'ATP',
        s.placed.NADPH ? '✓ NADPH' : 'NADPH'
      ].join(' • ');

      return {
        step: Math.min(n + 1, order.length),
        steps: order.length,
        scene: '<h3>Işığa bağımlı tepkimelerin şemasını tamamla</h3>'
          + '<p class="summaryline">Kloroplastın <strong>tilakoit zarında</strong> gerçekleşen olaylar için giren maddeleri ve oluşan ürünleri ayır. Burada ürünleri ilgili kutuya yerleştirmen onları “reaksiyona eklediğin” anlamına gelmez; şemanın ürün kısmını tamamlıyorsun.</p>'
          + '<div class="scene-grid">'
          + U.zone('inputs', '☀️ Girdiler', inputText, hasInputs, !hasInputs)
          + U.zone('products', '🫧 Ürünler', outputText, !!(s.placed.O2 && s.placed.ATP && s.placed.NADPH), hasInputs && !finished(s))
          + '</div>'
          + U.progress(n / order.length * 100)
          + '<p class="math">Işık + H₂O + ADP + Pi + NADP⁺ → O₂ + ATP + NADPH (şematik, denkleştirilmiş eşitlik değildir)</p>'
          + '<p class="summaryline">' + (s.tracer === '18o'
            ? '🧪 İzotop düşünce deneyi: Su molekülünün oksijeni ¹⁸O ile işaretlenirse oluşan O₂ de işaretli oksijen taşır.'
            : '🧪 O₂ açığa çıkmasının kaynağı CO₂ değil, suyun fotolizidir.')
          + '</p>',
        molecules: ['LIGHT', 'H2O', 'ADP', 'NADP', 'O2', 'ATP', 'NADPH', 'CO2'],
        controls: [{
          id: 'tracer', label: 'Oksijenin kaynağını araştır',
          type: 'buttons', value: s.tracer,
          options: [U.option('normal', 'Normal H₂O'), U.option('18o', 'H₂¹⁸O düşünce deneyi')]
        }],
        metrics: [
          { label: 'Doğru yerleştirme', value: n + ' / ' + order.length },
          { label: 'Temel girdiler', value: hasInputs ? 'Tamam ✓' : 'Eksik', note: 'Işık, H₂O, ADP + Pi, NADP⁺' },
          { label: 'O₂ kaynağı', value: 'H₂O', note: 'CO₂ değil' },
          { label: 'ATP ve NADPH', value: s.placed.ATP && s.placed.NADPH ? 'Üretildi ✓' : 'Ürünlere yerleştir', note: 'Işıktan bağımsız evrede kullanılır' }
        ],
        guidance: finished(s)
          ? 'Tebrikler! Girdiler ve ürünler eşleştirildi. Şimdi Calvin döngüsünü incele.'
          : hasInputs
            ? 'Girdiler tamam. O₂, ATP ve NADPH moleküllerini “Ürünler” bölümüne bırak.'
            : 'Önce Işık, H₂O, ADP + Pi ve NADP⁺ moleküllerini “Girdiler” bölümüne bırak.',
        insight: '2018 MEB: Suyun fotolizi belirtilir. ADP + Pi ve NADP⁺ kullanılarak ATP ve NADPH oluşur. Işığa bağımlı ve ışıktan bağımsız reaksiyonlar ürünler açısından karşılaştırılır; ayrıntılı elektron aktarım basamakları ve sayısal ATP hesapları YKS hedefi değildir. O₂ sudan çıkar; CO₂ organik besin sentezi aşamasında kullanılır.'
      };
    },

    interact: function (s, zone, mol, U) {
      if (!mol) return { message: 'Sol panelden Işık, H₂O veya bir ürünü seçip doğru bölgeye dokun.', level: 'info' };
      if (!Object.prototype.hasOwnProperty.call(matches, mol)) return { message: 'Bu molekül, ışığa bağımlı evre şemasında yer almıyor.', level: 'error' };
      if (matches[mol] !== zone) return { message: (U.names[mol] || mol) + ' için doğru şema bölümü: ' + (matches[mol] === 'inputs' ? 'Girdiler' : 'Ürünler') + '.', level: 'error' };
      if (s.placed[mol]) return { message: 'Bu molekülün eşleştirmesi zaten tamamlandı.', level: 'info' };
      if (matches[mol] === 'products' && !(s.placed.LIGHT && s.placed.H2O && s.placed.ADP && s.placed.NADP)) return { message: 'Önce ışığı, suyu, ADP + Pi ve NADP⁺ moleküllerini “Girdiler” bölümüne yerleştir.', level: 'warning' };
      s.placed[mol] = true;
      return {
        ok: true,
        message: mol === 'O2'
          ? 'Doğru: O₂, suyun fotolizi sonucunda oluşur.'
          : mol === 'ATP' || mol === 'NADPH'
            ? 'Doğru: ' + mol + ' ışığa bağımlı evrede üretilir; karbon bağlama evresinde kullanılır.'
            : 'Doğru: ' + (U.names[mol] || mol) + ' bu evrenin girdilerindendir.',
        complete: finished(s)
      };
    },

    next: function (s, U) {
      const mol = order.find(function (id) { return !s.placed[id]; });
      return mol ? this.interact(s, matches[mol], mol, U) : { message: 'Tüm girdi ve ürünler tamamlandı.', complete: true };
    },

    change: function (s, id, value) {
      if (id === 'tracer') s.tracer = value;
      return { message: s.tracer === '18o' ? 'İşaretli oksijen suya konursa ortaya çıkan O₂ de işaretli olur.' : 'Suyun fotolizi O₂ kaynağıdır.', level: 'info' };
    }
  });
})(window);
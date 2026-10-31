/* Run with: node tests/bio-engine.test.js */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const source = fs.readFileSync(path.join(__dirname, "../labs/bio-engine.js"), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox);
const E = sandbox.window.BioEngine;
function check(name, fn) { fn(); console.log("✓ " + name); }
check("64 codons", () => assert.equal(Object.keys(E.CODON_TABLE).length, 64));
check("start and three stop codons", () => { assert.equal(E.getCodonInfo("AUG").name, "Metiyonin"); for (const c of ["UAA","UAG","UGA"]) { assert.equal(E.getCodonInfo(c).stop, true); assert.equal(E.getCodonInfo(c).anticodon3to5, null); } });
check("DNA complement", () => { for (const [a,b] of [["A","T"],["T","A"],["G","C"],["C","G"]]) assert.equal(E.getComplementaryDNABase(a),b); });
check("DNA stats", () => { const d=E.calculateDNAStats("ATGC"); assert.equal(d.basePairs,4); assert.equal(d.totalNucleotides,8); assert.equal(d.hydrogenBonds,10); assert.equal(d.phosphodiesterBonds,6); });
check("transcription orientation", () => { const x=E.transcribeDNA("TACGGACTTATT"); assert.equal(x.mrna5to3,"AUGCCUGAAUAA"); assert.equal(x.coding5to3,"ATGCCTGAATAA"); });
check("translation and peptide bonds", () => { const x=E.translateMRNA("AUGCCUGAAUAA"); assert.equal(x.hasStopCodon,true); assert.equal(x.aminoAcidCount,3); assert.equal(x.peptideBonds,2); assert.equal(x.waterReleased,2); assert.equal(x.steps[0].anticodon3to5,"UAC"); });
check("semiconservative replication count", () => { const x=E.calculateReplication(1,3,"15to14"); assert.equal(x.totalDNA,8); assert.equal(x.conservedOldStrands,2); assert.equal(x.newlySynthesizedStrands,14); assert.equal(x.hybridDNA,2); assert.equal(x.lightDNA,6); });
check("zero round isotope labeling", () => { const x=E.calculateReplication(1,0,"15to14"); assert.equal(x.totalDNA,1); assert.equal(x.hybridDNA,0); assert.equal(x.heavyDNA,1); });
console.log("All bio-engine checks passed.");

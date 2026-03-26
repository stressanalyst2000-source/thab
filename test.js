'use strict';

const { extractDxfEntities } = require('./dxfExtractor');

const filePath = process.argv[2] || './sample.dxf';
const result = extractDxfEntities(filePath);

console.log('=== LINES ===');
for (const line of result.lines) {
  console.log(`  layer: ${line.layer}`);
  console.log(`    start: (${line.start.x}, ${line.start.y}, ${line.start.z})`);
  console.log(`    end:   (${line.end.x}, ${line.end.y}, ${line.end.z})`);
}

console.log('\n=== POLYLINES ===');
for (const poly of result.polylines) {
  console.log(`  layer: ${poly.layer}`);
  for (const v of poly.vertices) {
    console.log(`    vertex: (${v.x}, ${v.y}, ${v.z})`);
  }
}

console.log('\n=== INSERTS ===');
for (const ins of result.inserts) {
  console.log(`  layer: ${ins.layer}, block: ${ins.blockName}`);
  console.log(`    position: (${ins.position.x}, ${ins.position.y}, ${ins.position.z})`);
  console.log(`    scale: (${ins.xScale}, ${ins.yScale}, ${ins.zScale}), rotation: ${ins.rotation}°`);
}

console.log(
  `\nTotal: ${result.lines.length} line(s), ${result.polylines.length} polyline(s), ${result.inserts.length} insert(s)`
);

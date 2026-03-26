'use strict';

const fs = require('fs');
const DxfParser = require('dxf-parser');

function extractDxfEntities(filePath) {
  const dxf = new DxfParser().parseSync(fs.readFileSync(filePath, 'utf-8'));
  const lines = [], polylines = [], inserts = [];

  for (const e of dxf.entities || []) {
    if (e.type === 'LINE') {
      lines.push({
        layer: e.layer,
        start: e.vertices[0],
        end: e.vertices[1],
      });
    } else if (e.type === 'POLYLINE') {
      polylines.push({
        layer: e.layer,
        vertices: e.vertices,
      });
    } else if (e.type === 'INSERT') {
      inserts.push({
        layer: e.layer,
        blockName: e.name,
        position: e.position,
      });
    }
  }

  return { lines, polylines, inserts };
}

// --- run ---
const result = extractDxfEntities('./sample.dxf');
console.log(JSON.stringify(result, null, 2));

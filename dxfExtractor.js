'use strict';

const fs = require('fs');
const DxfParser = require('dxf-parser');

/**
 * Reads a .dxf file and extracts all LINE, POLYLINE, and INSERT entities
 * with their coordinates and layer names.
 *
 * @param {string} filePath - Path to the .dxf file
 * @returns {{ lines: object[], polylines: object[], inserts: object[] }}
 */
function extractDxfEntities(filePath) {
  const fileText = fs.readFileSync(filePath, 'utf-8');

  const parser = new DxfParser();
  const dxf = parser.parseSync(fileText);

  const result = {
    lines: [],
    polylines: [],
    inserts: [],
  };

  if (!dxf || !dxf.entities) {
    return result;
  }

  for (const entity of dxf.entities) {
    switch (entity.type) {
      case 'LINE':
        result.lines.push(extractLine(entity));
        break;
      case 'POLYLINE':
        result.polylines.push(extractPolyline(entity));
        break;
      case 'INSERT':
        result.inserts.push(extractInsert(entity));
        break;
    }
  }

  return result;
}

/**
 * Extracts layer and start/end coordinates from a LINE entity.
 * vertices[0] = start point, vertices[1] = end point (dxf-parser uses unshift/push).
 */
function extractLine(entity) {
  const [start, end] = entity.vertices || [];
  return {
    layer: entity.layer ?? null,
    start: pointCoords(start),
    end: pointCoords(end),
  };
}

/**
 * Extracts layer and vertex coordinates from a POLYLINE entity.
 */
function extractPolyline(entity) {
  return {
    layer: entity.layer ?? null,
    vertices: (entity.vertices || []).map(pointCoords),
  };
}

/**
 * Extracts layer, block name, insertion point, scale, and rotation from an INSERT entity.
 */
function extractInsert(entity) {
  return {
    layer: entity.layer ?? null,
    blockName: entity.name ?? null,
    position: pointCoords(entity.position),
    xScale: entity.xScale ?? 1,
    yScale: entity.yScale ?? 1,
    zScale: entity.zScale ?? 1,
    rotation: entity.rotation ?? 0,
  };
}

/** Returns a plain {x, y, z} object from a point, substituting 0 for missing axes. */
function pointCoords(point) {
  if (!point) return null;
  return {
    x: point.x ?? 0,
    y: point.y ?? 0,
    z: point.z ?? 0,
  };
}

module.exports = { extractDxfEntities };

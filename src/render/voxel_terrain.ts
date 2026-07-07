import * as THREE from 'three';
import { WORLD_MAX_X, WORLD_MAX_Z, WORLD_MIN_X, WORLD_MIN_Z } from '../sim/data';
import { voxelDensity } from '../sim/voxel';
import { meshVoxelChunk } from '../sim/voxel_mesh';
import { surfaceMat } from './gfx';

// VERIFICATION-ONLY full-world terrain built entirely from the new voxel
// density field/mesher (sim/voxel.ts, sim/voxel_mesh.ts), replacing the
// existing chunked heightfield mesh (terrain.ts) so the voxel engine's
// output can be eyeballed against the real world. This is deliberately low
// fidelity (coarse chunk resolution, no LOD/splat texturing) and meshes the
// WHOLE playable rectangle up front: it exists to answer "does the voxel
// code reproduce the real terrain shape," not to ship as the production
// renderer. See the PR description for perf numbers and next steps.
const CHUNK_SIZE = 40; // world units per chunk cube
const CHUNK_RESOLUTION = 6; // voxels per axis per chunk (coarse, verification only)
const Y_MIN = -40;
const Y_MAX = 220;
const WORLD_MARGIN = 10; // small pad so edge geometry isn't clipped

export interface VoxelTerrainView {
  group: THREE.Group;
  chunkCount: number;
  triangleCount: number;
}

export function buildVoxelTerrain(seed: number): VoxelTerrainView {
  const group = new THREE.Group();
  group.name = 'voxel-terrain-verification';
  const density = (x: number, y: number, z: number) => voxelDensity(x, y, z, seed);
  const material = surfaceMat({
    color: 0x6a8f5a,
    roughness: 0.95,
    metalness: 0,
    flatShading: true,
  });

  const x0 = Math.floor((WORLD_MIN_X - WORLD_MARGIN) / CHUNK_SIZE);
  const x1 = Math.ceil((WORLD_MAX_X + WORLD_MARGIN) / CHUNK_SIZE);
  const z0 = Math.floor((WORLD_MIN_Z - WORLD_MARGIN) / CHUNK_SIZE);
  const z1 = Math.ceil((WORLD_MAX_Z + WORLD_MARGIN) / CHUNK_SIZE);
  const y0 = Math.floor(Y_MIN / CHUNK_SIZE);
  const y1 = Math.ceil(Y_MAX / CHUNK_SIZE);

  let chunkCount = 0;
  let triangleCount = 0;

  for (let cx = x0; cx < x1; cx++) {
    for (let cz = z0; cz < z1; cz++) {
      for (let cy = y0; cy < y1; cy++) {
        const mesh = meshVoxelChunk(density, {
          x0: cx * CHUNK_SIZE,
          y0: cy * CHUNK_SIZE,
          z0: cz * CHUNK_SIZE,
          size: CHUNK_SIZE,
          resolution: CHUNK_RESOLUTION,
        });
        if (mesh.positions.length === 0) continue;
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(mesh.positions, 3));
        geo.setAttribute('normal', new THREE.BufferAttribute(mesh.normals, 3));
        geo.setIndex(new THREE.BufferAttribute(mesh.indices, 1));
        const chunkMesh = new THREE.Mesh(geo, material);
        chunkMesh.name = `voxel-terrain-${cx}-${cy}-${cz}`;
        chunkMesh.matrixAutoUpdate = false;
        chunkMesh.updateMatrix();
        group.add(chunkMesh);
        chunkCount++;
        triangleCount += mesh.indices.length / 3;
      }
    }
  }

  console.log(
    `[voxel_terrain] verification build: ${chunkCount} chunks, ${triangleCount} triangles`,
  );
  return { group, chunkCount, triangleCount };
}

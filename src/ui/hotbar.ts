export function placeAbilityOnSlot(
  slotMap: readonly (string | null)[],
  abilityId: string,
  targetIndex: number,
): (string | null)[] {
  const next = slotMap.slice();
  if (targetIndex < 0 || targetIndex >= next.length) return next;
  const sourceIndex = next.indexOf(abilityId);
  if (sourceIndex === targetIndex) return next;
  if (sourceIndex !== -1) {
    [next[sourceIndex], next[targetIndex]] = [next[targetIndex], next[sourceIndex]];
    return next;
  }
  next[targetIndex] = abilityId;
  return next;
}

export function clearHotbarSlot(
  slotMap: readonly (string | null)[],
  targetIndex: number,
): (string | null)[] {
  if (targetIndex < 0 || targetIndex >= slotMap.length) return [...slotMap];
  return slotMap.map((slot, index) => index === targetIndex ? null : slot);
}

export function syncHotbarSlotMap(
  slotMap: readonly (string | null)[],
  knownAbilityIds: readonly string[],
  autoPlaceAbilityIds: ReadonlySet<string>,
): (string | null)[] {
  const known = new Set(knownAbilityIds);
  const next = slotMap.map((id) => id !== null && !known.has(id) ? null : id);
  for (const id of knownAbilityIds) {
    if (next.includes(id) || !autoPlaceAbilityIds.has(id)) continue;
    const empty = next.indexOf(null);
    if (empty === -1) break;
    next[empty] = id;
  }
  return next;
}

export function rectsIntersect (a, b) {
    return(
        a.left < b.right &&
        a.right > b.left &&
        a.top < b.bottom &&
        a.bottom > b.top
    );
} 

export function elementCenterIsInZone (el, zoneEl) {
    if(!el || !zoneEl) return false;
    const r1 = el.getBoundingClientRect();
    const r2 = zoneEl.getBoundingClientRect();
    const cx = (r1.left + r1.right) / 2;
    const cy = (r1.top + r1.bottom) / 2;
    return cx >= r2.left && cx <= r2.right && cy >= r2.top && cy <= r2.bottom;
}

export function elementIntersectsZone (el, zoneEl) {
    if(!el || !zoneEl) return false;
    const r1 = el.getBoundingClientRect();
    const r2 = zoneEl.getBoundingClientRect();
    return rectsIntersect(r1,r2);
}
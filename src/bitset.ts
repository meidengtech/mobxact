function lowbit(x: number) {
  return (x & -x) >>> 0;
}

function bitPos(x: number) {
  let ret = 0;
  for (let bits = 16; bits; bits >>= 1) {
    if (((x >> ret) >> bits) & ((1 << bits) - 1)) {
      ret |= bits;
    }
  }
  return ret;
}

export class BitSet {
  bitset: Uint32Array;
  fenwick: Uint32Array;
  fwsize: number;

  constructor(readonly n: number, initArr?: unknown[]) {
    const size = (n + 31) >> 5;
    this.fwsize = size;
    const bitset = (this.bitset = new Uint32Array(size));
    const fenwick = (this.fenwick = new Uint32Array(size));
    if (initArr) {
      for (let i = 0; i < n && i < initArr.length; i++) {
        if (initArr[i]) {
          const id = i >> 5;
          const mask = i & 31;
          this.bitset[id] |= 1 << mask;
        }
      }
      for (let i = 0; i < size; i++) {
        if (bitset[i]) {
          fenwick[i] = 1;
        }
      }
      for (let i = (size - 1) & -2; i >= 0; i -= 2) {
        for (let j = 1; (i & j) === 0 && (i | j) < size; j <<= 1) {
          fenwick[i] += fenwick[i | j];
        }
      }
    }
  }
  set(i: number) {
    const id = i >> 5;
    const mask = i & 31;
    if (!this.bitset[id]) {
      this.fenwick_inc(id, 1);
    }
    this.bitset[id] |= 1 << mask;
    return;
  }
  private fenwick_inc(x: number, v: number) {
    while (x) {
      this.fenwick[x] += v;
      x &= ~lowbit(x);
    }
    this.fenwick[x] += v;
  }
  private fenwick_find(x: number) {
    // up phase, find first non-zero block
    const n = this.fwsize;
    let i = 1;
    if (!this.fenwick[x]) {
      for (; x < n; i <<= 1) {
        if (!(x & i)) {
          x = (x & -i) | i;
          if (this.fenwick[x]) {
            break;
          }
        }
      }
    }
    if (x >= n) {
      return -1;
    }
    // down phase, find first 1 in block.
    let blockCount = this.fenwick[x];
    for (i = lowbit(x) >> 1; i; i >>= 1) {
      // if left block is zero, turn to right block.
      const rcount = this.fenwick[x | i];
      if (blockCount == rcount) {
        x |= i;
      } else {
        blockCount -= rcount;
      }
    }
    return x;
  }
  unset(i: number) {
    const id = i >> 5;
    const mask = i & 31;
    if (this.bitset[id] & mask) {
      this.bitset[id] &= -1 << mask;
      if (!this.bitset[id]) {
        this.fenwick_inc(id, -1);
      }
    }
  }
  query(start: number = 0) {
    const id = start >> 5;
    const mask = start & 31;

    const rest = this.bitset[id] & (-1 << mask);
    if (rest) {
      return (id << 5) | bitPos(lowbit(rest));
    }

    const p = this.fenwick_find(id + 1);
    if (p < 0) {
      return -1;
    }
    return (p << 5) | bitPos(lowbit(this.bitset[p]));
  }
}

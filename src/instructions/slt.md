# `SLT`, `SLTI`, `SLTU`, `SLTIU` — set less than

```text
slt   rd, rs1, rs2       # signed:   rd = (rs1 < rs2) ? 1 : 0
slti  rd, rs1, imm12     # signed,   immediate
sltu  rd, rs1, rs2       # unsigned: rd = (rs1 < rs2) ? 1 : 0
sltiu rd, rs1, imm12     # unsigned, immediate
```

Set `rd` to 1 when the comparison condition holds, otherwise 0. The result is a zero-extended XLEN-wide value (never a single-bit flag). Available in RV32I and RV64I.

## Immediate

`SLTI` and `SLTIU` sign-extend a 12-bit immediate to XLEN before comparing. This matters for `SLTIU`: a negative immediate represents a *large unsigned* comparison target.

| Assembly | Immediate after sign-extension | Effect |
|---|---|---|
| `sltiu rd, rs, 0` | 0 | `rd = (rs < 0)` — always 0, since no unsigned value is below 0 |
| `sltiu rd, rs, -1` | 0xFFFF…FFFF (max XLEN) | `rd = (rs < max)` — equivalent to `rd = (rs != UINT_MAX)` |
| `sltiu rd, rs, 1` | 1 | `rd = (rs < 1)` — equivalent to `rd = (rs == 0)` |

```asm
slti a0, a1, 10          # a0 = (a1 < 10), signed
sltiu t1, t0, 1          # t1 = (t0 == 0), unsigned
sltiu t2, t0, -1         # t2 = (t0 != UINT_MAX), unsigned
```

## Pseudoinstructions built on SLT

| Pseudo | Expansion | Effect |
|---|---|---|
| `sltz rd, rs` | `slt rd, rs, x0` | set if *less than zero* |
| `sgtz rd, rs` | `slt rd, x0, rs` | set if *greater than zero* |
| `seqz rd, rs` | `sltiu rd, rs, 1` | set if *equal to zero* |
| `snez rd, rs` | `sltu rd, x0, rs` | set if *not equal to zero* |

## Common idioms

**Materialise a comparison result** — standard way to turn a condition into a 0/1 value:

```asm
slt a0, a1, a2           # a0 = 1 if a1 < a2 (signed), else 0
```

**Min and max:**

```asm
# signed min of t0, t1
slt  t2, t0, t1          # t2 = (t0 < t1)
neg  t2, t2              # t2 = -1 if true, 0 if false  →  mask of all-ones or zero
and  t3, t0, t2          # t3 = t0 & mask  (t0 when t0 < t1, else 0)
not  t2, t2              # t2 = ~mask
and  a0, t1, t2          # a0 = t1 & ~mask (t1 when t0 >= t1, else 0)
or   a0, a0, t3          # a0 = min(t0, t1)
```

**Detect borrow after subtraction:**

```asm
sub  t0, a0, a1          # t0 = a0 - a1 (wrapping)
sltu t1, a0, t0          # t1 = 1 if a0 < (a0 - a1), i.e. borrow occurred
```

**x86 connection:** closest to `setl`/`setb` (or `xor`/`cmp`/`setcc` sequences), but writes a full-width register instead of a single byte and does not require a separate flags check. There is no x86 equivalent to `sltiu` with a negative immediate — x86 comparisons always use a fixed width.

Related: [`BLT` / `BGE` / `BLTU` / `BGEU`](ordered-branches.md), [`SUB`](sub.md).

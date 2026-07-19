# `SLT`, `SLTI`, `SLTU`, `SLTIU` — set less than

```text
slt   rd, rs1, rs2       # signed: rd = (rs1 < rs2) ? 1 : 0
slti  rd, rs1, imm12     # signed, immediate
sltu  rd, rs1, rs2       # unsigned
sltiu rd, rs1, imm12     # unsigned, immediate
```

Set `rd` to 1 when the comparison condition holds, otherwise 0. Available in RV32I and RV64I. The immediate forms sign-extend a 12-bit immediate (−2048 through 2047).

```asm
slti a0, a1, 10          # a0 = (a1 < 10)
sltu t1, t0, a0          # t1 = (t0 < a0), unsigned
```

Commonly used to materialise boolean values, implement `max`/`min`, or detect carry/borrow after addition or subtraction.

**x86 connection:** closest to `setl`/`setb` (or `xor`/`cmp`/`setcc` sequences), but writes a full-width register instead of a single byte and does not require a separate flags check.

Related: [`BLT` / `BGE` / `BLTU` / `BGEU`](ordered-branches.md), [`SUB`](sub.md).

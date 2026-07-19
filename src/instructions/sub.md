# `SUB` — subtract

```text
sub rd, rs1, rs2
```

Computes `rd = rs1 - rs2`. Overflow wraps modulo XLEN. There is no base `subi`; use `addi` with a negative immediate when it fits.

```asm
sub a0, a0, a1
addi sp, sp, -16       # effectively subtract 16
```

**x86 connection:** x86 `sub` is a two-operand instruction and sets flags; RISC-V `sub` has three operands and does not.


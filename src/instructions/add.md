# `ADD` — add registers

```text
add rd, rs1, rs2
```

Computes `rd = rs1 + rs2`. Available in RV32I and RV64I. Overflow wraps modulo XLEN; it does not trap and no carry/overflow flags are produced.

```asm
add a0, a1, a2        # a0 = a1 + a2
```

**x86 connection:** closest to `lea dst, [src1 + src2]` when you need flag-neutral addition. Unlike two-operand x86 `add`, neither source must be overwritten.

Related: [`ADDI`](addi.md), [`SUB`](sub.md).


# `SLL` / `SLLI` — shift left logical

```text
sll  rd, rs1, rs2
slli rd, rs1, shamt
```

Shift left and fill low bits with zero. Shift amounts are masked to the register width.

**x86 connection:** corresponds to `shl`/`sal`, but does not produce carry or overflow flags.


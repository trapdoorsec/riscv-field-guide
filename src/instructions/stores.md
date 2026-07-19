# `SB`, `SH`, `SW`, `SD` — stores

```text
sb rs2, offset(rs1)
sh rs2, offset(rs1)
sw rs2, offset(rs1)
sd rs2, offset(rs1)    # RV64 only
```

Stores write the low 8, 16, 32, or 64 bits of `rs2`. They do not modify either register.

```asm
sd ra, 24(sp)
sw a0, 0(a1)
```

**x86 connection:** closest to `mov [base + displacement], src`, but base-plus-index addressing must be calculated separately.


# `LB`, `LH`, `LW`, `LD` — loads

```text
lb rd, offset(rs1)     # 8-bit, sign-extended
lh rd, offset(rs1)     # 16-bit, sign-extended
lw rd, offset(rs1)     # 32-bit, sign-extended
ld rd, offset(rs1)     # 64-bit, RV64 only
```

Unsigned variants `lbu`, `lhu`, and RV64 `lwu` zero-extend instead.

```asm
ld   t0, 16(sp)
lbu  a0, 0(a1)
```

**x86 connection:** combines an x86 memory read with `movsx` or `movzx`; unlike x86 ALU instructions, `add`, `and`, etc. cannot directly consume a memory operand.


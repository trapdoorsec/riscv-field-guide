# `AND` / `ANDI`

```text
and  rd, rs1, rs2
andi rd, rs1, imm12
```

Compute a bitwise AND. `ANDI` sign-extends its 12-bit immediate before applying it.

```asm
andi a0, a0, 0xff      # retain the low byte
and  a0, a0, a1        # mask using a register
```

**x86 connection:** equivalent bit operation to `and`, without flags and with a separate destination.


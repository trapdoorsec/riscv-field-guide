# `ADDI` — add immediate

```text
addi rd, rs1, imm12
```

Adds a sign-extended 12-bit immediate: `rd = rs1 + sign_extend(imm12)`. The range is −2048 through 2047. Available in RV32I and RV64I.

```asm
addi sp, sp, -32       # allocate 32 bytes of stack space
addi a0, a0, 1         # increment a0
```

Common pseudoinstructions: `mv rd, rs` uses an immediate of zero; `nop` is `addi x0, x0, 0`.

**x86 connection:** resembles `add reg, imm`, but produces no flags and keeps separate source/destination operands.


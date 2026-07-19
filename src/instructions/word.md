# `*W` — RV64 word operations

```text
addw  rd, rs1, rs2       # rd = sign_extend(rs1[31:0] + rs2[31:0])
addiw rd, rs1, imm12     # rd = sign_extend(rs1[31:0] + imm12)
subw  rd, rs1, rs2       # rd = sign_extend(rs1[31:0] - rs2[31:0])
sllw  rd, rs1, rs2       # rd = sign_extend(rs1[31:0] << rs2[4:0])
slliw rd, rs1, shamt5    # rd = sign_extend(rs1[31:0] << shamt5)
srlw  rd, rs1, rs2       # rd = sign_extend(rs1[31:0] >> rs2[4:0])   (zero-fill)
srliw rd, rs1, shamt5    # rd = sign_extend(rs1[31:0] >> shamt5)     (zero-fill)
sraw  rd, rs1, rs2       # rd = sign_extend(rs1[31:0] >>> rs2[4:0])  (arithmetic)
sraiw rd, rs1, shamt5    # rd = sign_extend(rs1[31:0] >>> shamt5)    (arithmetic)
```

RV64I only. These instructions treat their source operands as 32-bit values and write a **sign-extended** 64-bit result to `rd` — bit 31 of the result is copied into bits 63–32.

Shifts use only the low **5** bits of the shift amount (word-size shift), not 6 as in the 64-bit `SLL`/`SRL`/`SRA`.

## When to use them

**Use `*W` when source values are 32-bit and the result needs to be 32-bit.** The sign-extension is free on most implementations; some even eliminate the operation entirely when the consumer also reads a word-width result.

| You write … | Instead of … | Why |
|---|---|---|
| `addiw rd, rs, 0` | `slli` + `srai`, or `sext.w` pseudo | sign-extend bit 31 to fill bits 63–32 (the `+ 0` is a no-op) |
| `addw rd, rs1, rs2` | `add` + `slli` + `srai` | single instruction, truncates then sign-extends inline |
| `slliw rd, rs, 0` | `slli` + `srai`, or `sext.w` pseudo | shift by zero leaves the low word unchanged, then sign-extends it |

```asm
# 32-bit addition with overflow ignored (common in Java/.NET)
addw a0, a1, a2

# Sign-extend a 32-bit value to 64 bits
addiw a0, a1, 0

# 32-bit left shift
slliw a0, a1, 8

# 32-bit arithmetic right shift
sraiw a0, a1, 3

# Subtract using word width
subw  a0, a1, a2
subw  a0, a0, a3         # chained 32-bit subtract
```

## Not available

There is no `sltiw`, `sltuw`, or `sltiuw` — comparison results are naturally
0/1 and need no truncation. There is also no `andw`, `orw`, or `xorw`. A
full-width bitwise operation preserves the RV64 convention that 32-bit values
are held sign-extended when both inputs already have that canonical form; if
they do not, explicitly sign-extend the result when required.

## x86 connection

Closest to **32-bit operand-size** on x86-64 — e.g. `add eax, ebx` is 32-bit addition. The critical difference: x86 **zero**-extends the 32-bit result into RAX for most instructions, while RISC-V `*W` **sign**-extends. There is no x86 instruction that sign-extends a 32-bit arithmetic result into 64 bits as a side effect — `movsxd` (x86-64) sign-extends a move but cannot combine with an arithmetic operation.

Related: [`ADD` / `ADDI`](addi.md), [`SUB`](sub.md), [`SLL` / `SLLI`](sll.md), [`SRL`, `SRA`](right-shifts.md).

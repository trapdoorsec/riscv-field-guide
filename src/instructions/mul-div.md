# `MUL`, `DIV`, `REM` — multiplication and division (M extension)

```text
mul    rd, rs1, rs2       # rd = low XLEN bits of rs1 × rs2
mulh   rd, rs1, rs2       # rd = high XLEN bits of rs1 × rs2, signed × signed
mulhu  rd, rs1, rs2       # rd = high XLEN bits of rs1 × rs2, unsigned × unsigned
mulhsu rd, rs1, rs2       # rd = high XLEN bits of rs1 × rs2, signed × unsigned

div    rd, rs1, rs2       # rd = rs1 ÷ rs2, signed (truncate toward zero)
divu   rd, rs1, rs2       # rd = rs1 ÷ rs2, unsigned
rem    rd, rs1, rs2       # rd = rs1 mod rs2, signed (remainder same sign as rs1)
remu   rd, rs1, rs2       # rd = rs1 mod rs2, unsigned
```

Available in RV32M and RV64M. The M extension is typically included alongside the base ISA; most real cores implement it.

## Multiplication — high half

A full XLEN × XLEN product is 2·XLEN bits wide. RISC-V splits the result across two destination registers:

| Instruction | `rd` gets | Use |
|---|---|---|
| `mul` | product[XLEN-1 : 0] | standard multiply, low half |
| `mulh` | product[2·XLEN-1 : XLEN] | signed × signed high half |
| `mulhu` | product[2·XLEN-1 : XLEN] | unsigned × unsigned high half |
| `mulhsu` | product[2·XLEN-1 : XLEN] | **signed × unsigned** high half |

When the low half alone is sufficient (e.g., boolean multiplication, pointer arithmetic, or any result that fits in XLEN bits), `mul` alone is correct regardless of signedness — the low bits of a product are the same for signed and unsigned operands.

### RV32 (32-bit) example

```
rs1 = 0x8000_0001    (-2_147_483_647  signed / 2_147_483_649  unsigned)
rs2 = 0x0000_0002    (           2)

                   mul           mulh       mulhu       mulhsu
                  product[31:0]  product[63:32]
signed   × signed   0x0000_0002  0xFFFF_FFFF  —           —
unsigned × unsigned 0x0000_0002     —        0x0000_0001  —
signed   × unsigned 0x0000_0002     —           —        0xFFFF_FFFF
```

`mul` always writes the same 32-bit low-half result. Only the high-half instructions differ by interpretation.

### MULHSU — signed × unsigned high half

`mulhsu` treats `rs1` as signed and `rs2` as unsigned. This is the instruction you reach for when you have a signed value that you want to multiply by a **positive fraction** stored as an unsigned fixed-point number.

```
     rs1 (signed,    XLEN bits)  ×  rs2 (unsigned, XLEN bits)
   ╭────────────────────────╮       ╭────────────────────────╮
   │  s  │  magnitude      │       │  magnitude              │
   ╰────┬──────────────────╯       ╰────────────────────────╯
        │                                  │
        │         signed × unsigned         │
        │    ───────────────────────        │
        │    treat rs1 as signed            │
        │    zero-extend rs2 to 2·XLEN      │
        │    multiply, sign-extend rs1      │
        │    result is signed, 2·XLEN bits  │
        │                                  │
        ╰──────────────┬───────────────────╯
                       │
            ┌──────────┴──────────┐
            │                     │
      mul ──┤product[XLEN-1:0]   │  same low half as mul/mulhu
            │                     │
 mulhsu ───┤product[2·XLEN-1:XLEN]│  high half (signed interpretation)
            └─────────────────────┘
```

Without `mulhsu`, software must derive the mixed-sign high half from other
multiply and correction operations. `mulhsu` expresses it directly in one
instruction.

```asm
# Multiply a signed 64-bit value (a0) by a 64-bit unsigned fraction (a1)
# stored as a Q64 fixed-point number (i.e., the unit bit is at 2^−64).
# The product is signed with 64 fractional bits.
mulhsu t0, a0, a1          # t0 = high half
mul    t1, a0, a1          # t1 = low half; sources remain unchanged
```

## Division — edge cases

### Division by zero

| Instruction | `rd` value |
|---|---|
| `div rs1, x0` | −1 (all bits set) |
| `divu rs1, x0` | (2^XLEN) − 1 (max unsigned value, all bits set) |
| `rem rs1, x0` | `rs1` (dividend) |
| `remu rs1, x0` | `rs1` (dividend) |

No exception is raised. Software must check for zero divisor beforehand if it wants to trap.

### Signed overflow: `DIV` with min / −1

When `rs1 = INT_MIN` (signed minimum, `0x8000_0000` in RV32 or `0x8000_0000_0000_0000` in RV64) and `rs2 = −1`, the mathematical quotient is `−(INT_MIN) = INT_MAX + 1`, which overflows the signed range. RISC-V defines this to produce `rs1` (the dividend) rather than raising an exception.

| Instruction | `rd` value |
|---|---|
| `div  rs1, -1` | `rs1` (the dividend — overflow) |
| `rem  rs1, -1` | 0 |

```asm
# Safe signed division that handles both edge cases
li   t0, -1
beq  a1, x0, handle_zero    # skip if divisor == 0
bne  a1, t0, 1f             # skip if divisor != -1
# divisor is -1: check for overflow
li   t0, 1
slli t0, t0, (XLEN - 1)     # INT_MIN
bne  a0, t0, 1f             # if dividend != INT_MIN, safe
j    overflow_path

1:
div  a0, a0, a1              # safe division
```

## Remainder sign

The remainder always has the same sign as the **dividend** (`rs1`):

```text
(rs1 ÷ rs2) × rs2 + (rs1 mod rs2) = rs1    # identity
sign(rs1 mod rs2) = sign(rs1)              # convention
```

```asm
li   a0, -7
li   a1, 3
div  t0, a0, a1          # t0 = -2  (truncate toward zero)
rem  t1, a0, a1          # t1 = -1  (same sign as dividend)
                         # check: (-2 × 3) + (-1) = -7 ✓
```

## RV64 word operations

```text
mulw   rd, rs1, rs2       # rd = sign_extend(product[31:0] of rs1[31:0] × rs2[31:0])
divw   rd, rs1, rs2       # rd = sign_extend(rs1[31:0] ÷ rs2[31:0]), signed
divuw  rd, rs1, rs2       # rd = sign_extend(rs1[31:0] ÷ rs2[31:0]), unsigned
remw   rd, rs1, rs2       # rd = sign_extend(rs1[31:0] mod rs2[31:0]), signed
remuw  rd, rs1, rs2       # rd = sign_extend(rs1[31:0] mod rs2[31:0]), unsigned
```

The `*W` variants treat their sources as 32-bit values and write a
**sign-extended** 64-bit result to `rd`. They exist only in RV64M. There are no
`mulhw`, `mulhuw`, or `mulhsuw`: when the operands have first been correctly
sign- or zero-extended to 64 bits, ordinary RV64 `mul` produces the complete
32-by-32 product. If their upper halves are unknown, extend them first or use
the shift-and-`mulh` technique described by the ISA specification.

Edge cases for word division follow the same rules as the full-width instructions but operate on 32-bit values:

```asm
# 32-bit signed division, result sign-extended to 64 bits
divw  a0, a1, a2          # compute a1[31:0] ÷ a2[31:0] → a0 = sign_extend(32-bit result)

# 32-bit division by zero → 0xFFFFFFFF → sign-extended to 0xFFFFFFFFFFFFFFFF
divw  a0, a1, x0          # a0 = −1

# 32-bit signed overflow: INT32_MIN / −1 → INT32_MIN → sign-extended
li    a1, 0x80000000      # INT32_MIN in a low 32 bits
li    a2, -1
divw  a0, a1, a2          # a0 = sign_extend(0x80000000) = 0xFFFFFFFF80000000
```

## x86 connection

| RISC-V | x86 | Notes |
|---|---|---|
| `mul` | two-/three-operand `imul` | both can write the low half to a general register; low-half signedness is irrelevant |
| `mulh` / `mulhu` | one-operand `imul` / `mul` high half (`rdx`) | x86 uses the fixed `rdx:rax` pair; RISC-V writes the selected half to any `rd` |
| `mulhsu` | no direct single instruction | x86 has no signed-by-unsigned high-half form |
| `div` / `divu` | `idiv` / `div` | x86 uses a fixed dividend width (e.g., `rdx:rax`); RISC-V divides a single register by another |
| `rem` / `remu` | `idiv` / `div` remainder (`rdx`) | x86 returns remainder in `rdx` as a side effect of division; RISC-V has separate `rem` |
| `mulw` | `imul eax, ebx` | Both compute a 32-bit product; x86 zero-extends, RISC-V sign-extends |
| `divw` | `idiv ecx` with dividend in `edx:eax` | x86 uses a 64-bit dividend and writes quotient/remainder to `eax`/`edx`; RISC-V takes two low-32-bit sources and sign-extends its result |

The main structural difference: x86 computes quotient **and** remainder
together; RISC-V uses separate `div` / `rem` instructions. When both are
needed, emitting `div` followed by `rem` with the same sources allows a
supporting implementation to fuse them into one divide operation. The quotient
destination must not overwrite either source before `rem` reads it.

Related: [`*W` — RV64 word operations](word.md), [`SUB`](sub.md).

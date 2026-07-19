# Signedness and width guide

RISC-V does not consistently encode signedness in mnemonics. Some operations have separate signed and unsigned forms; others use the same instruction regardless of interpretation. This page is a quick-reference for which is which.

## Quick-reference table

| Operation | Signed form | Unsigned form | Notes |
|---|---|---|---|
| **byte load** | `LB` | `LBU` | `LB` sign-extends to XLEN; `LBU` zero-extends |
| **halfword load** | `LH` | `LHU` | same pattern as byte loads |
| **word load** | `LW` | `LWU` | both load 32 bits; `LW` sign-extends to XLEN, `LWU` zero-extends; `LWU` is RV64-only |
| **less-than branch** | `BLT` | `BLTU` | same register encoding, different comparison |
| **less-than set** | `SLT` / `SLTI` | `SLTU` / `SLTIU` | produces a 0/1 boolean |
| **comparison branches** | `BGE` | `BGEU` | greater-or-equal counterpart |
| **division** | `DIV` | `DIVU` | quotient; remainder follows (`REM` / `REMU`) |
| **multiply high** | `MULH` | `MULHU` | high half of XLEN × XLEN product |

## Operations that are always the same

Addition, subtraction, bitwise logic, left shift, and low-half multiplication
produce the same bit pattern regardless of signed or unsigned interpretation.
Right shift is the exception: choose logical `SRL` for zero-fill or arithmetic
`SRA` for sign propagation.

| Instruction | Why no separate form |
|---|---|
| `ADD` / `ADDI` | Two's-complement addition is bitwise identical for signed and unsigned |
| `SUB` | Same as addition — `a − b` = `a + (~b + 1)` works the same way |
| `AND` / `OR` / `XOR` | Bitwise operations have no signedness |
| `SLL` | Left shift has the same bit result for signed and unsigned values |
| `SRL` / `SRA` | Right shift requires an explicit choice: zero-fill or sign propagation |
| `MUL` (low half) | Low XLEN bits of a product are identical for signed and unsigned operands |

## Width extension

Load instructions extend the loaded value to fill the destination register. The extension direction (sign or zero) is the key difference between the signed and unsigned forms.

```
LB   rd, off(rs1)     # load byte,     sign-extend to XLEN
LBU  rd, off(rs1)     # load byte,     zero-extend to XLEN

LH   rd, off(rs1)     # load halfword, sign-extend to XLEN
LHU  rd, off(rs1)     # load halfword, zero-extend to XLEN

LW   rd, off(rs1)     # load word,     sign-extend to XLEN
LWU  rd, off(rs1)     # load word,     zero-extend to XLEN (RV64 only)
```

`LW` is available on both RV32 and RV64. `LWU` is RV64-only (GNU as rejects it for RV32 targets). On RV32 both forms would be identical — there is no extension to perform when loading 32 bits into a 32-bit register — but the assembler does not accept `LWU` as a mnemonic.

## The `SLTIU` gotcha

`SLTIU` performs an **unsigned comparison** but still **sign-extends** its 12-bit immediate before comparing. This means a negative immediate represents a large unsigned value:

```asm
sltiu rd, rs, 0         # rd = (rs < 0) — always 0 (unsigned)
sltiu rd, rs, -1        # rd = (rs < 0xFFFF…FF) — always 1 unless rs is max value
sltiu rd, rs, 1         # rd = (rs < 1) — equivalent to seqz (rs == 0)
```

The immediate is sign-extended because `SLTIU` reuses the same immediate encoding as every other I-type instruction — the sign-extension is a property of the encoding, not the comparison logic.

## x86 connection

x86 expresses signedness through different mnemonics for **almost every operation**: `jl` vs `jb`, `setl` vs `setb`, `idiv` vs `div`, `imul` vs `mul`, `movsx` vs `movzx`. RISC-V collapses many of these pairs into a single instruction (addition, subtraction, low-half multiply) because the bit pattern is the same either way.

Where RISC-V does use separate forms (loads, branches, set-less-than, division), the U suffix consistently means "unsigned," which is simpler than x86's historical naming (`jb` = jump below, `jl` = jump less, `setb` = set below, `setl` = set less, etc.).

Related: [Loads](instructions/loads.md), [Stores](instructions/stores.md), [`BLT` / `BGE` / `BLTU` / `BGEU`](instructions/ordered-branches.md), [`SLT` / `SLTI` / `SLTU` / `SLTIU`](instructions/slt.md), [`*W` — RV64 word operations](instructions/word.md).

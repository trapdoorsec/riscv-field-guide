# Pseudoinstructions

Pseudoinstructions are assembler conveniences, not additional ISA operations. Expansion can depend on operands, code model and relocations.

| Pseudo | Typical base form | Meaning |
|---|---|---|
| `mv rd, rs` | `addi rd, rs, 0` | copy register |
| `li rd, imm` | one or more instructions | load constant |
| `la rd, symbol` | relocation-aware sequence | load address |
| `nop` | `addi x0, x0, 0` | no operation |
| `not rd, rs` | `xori rd, rs, -1` | bitwise complement |
| `neg rd, rs` | `sub rd, x0, rs` | two's-complement negate |
| `j label` | `jal x0, label` | unconditional jump |
| `jr rs` | `jalr x0, 0(rs)` | indirect jump |
| `ret` | `jalr x0, 0(ra)` | return |
| `beqz rs, label` | `beq rs, x0, label` | branch if zero |
| `bnez rs, label` | `bne rs, x0, label` | branch if nonzero |

Use `objdump -dr` when you need to know the actual expansion, especially for symbols and large constants.


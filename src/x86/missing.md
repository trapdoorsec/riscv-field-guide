# Instructions x86 has and RISC-V doesn't

Several x86 staples have no direct single-instruction equivalent in the base RISC-V ISA. The table below shows what you might instinctively reach for and what you should write instead.

## Arithmetic

| You want … | In x86 | RISC-V replacement |
|---|---|---|
| subtract immediate | `sub r, imm` | `addi rd, rs, -imm`  (no `subi` exists; negate the immediate) |

`ADDI` sign-extends its 12-bit immediate, so a single `addi` covers any small `subi`. For subtract-immediate with an out-of-range constant, load the immediate then use `SUB`.

```asm
# x86:  sub eax, 42
addi a0, a0, -42

# x86:  sub eax, 100000        (fits in 12-bit signed?  -100000 = 0xFFFE7960, no)
li   t0, 100000
sub  a0, a0, t0
```

## Moves

| You want … | In x86 | RISC-V replacement |
|---|---|---|
| register-to-register copy | `mov r1, r2` | `mv rd, rs`  (pseudo: `addi rd, rs, 0`) |
| immediate-to-register | `mov r, imm32` | `li rd, imm`  (pseudo, may expand to `addi` + `lui` + shifts) |
| memory-to-register | `mov r, [addr]` | load instruction (`lb`/`lh`/`lw`/`ld`) with address in a register |
| register-to-memory | `mov [addr], r` | store instruction (`sb`/`sh`/`sw`/`sd`) with address in a register |

x86's `mov` is overloaded across widths, addressing modes, and source types. RISC-V separates each concern into distinct instructions. The only "move" in the base ISA is `ADDI` with a zero immediate — everything else is a pseudoinstruction or an explicit load/store.

```asm
# x86: mov eax, ebx
mv a0, a1                    # actually addi a0, a1, 0

# x86: mov eax, 0x1234
li  a0, 0x1234

# x86: mov eax, [ebx]
lw  a0, 0(a1)

# x86: mov [ebx], eax
sw  a0, 0(a1)
```

## Logical

| You want … | In x86 | RISC-V replacement |
|---|---|---|
| bitwise NOT | `not r` | `not rd, rs`  (pseudo: `xori rd, rs, -1`) |
| two's-complement negate | `neg r` | `neg rd, rs`  (pseudo: `sub rd, x0, rs`) |

Neither `NOT` nor `NEG` are real RISC-V instructions. The assembler accepts them as pseudoinstructions that expand to a single `XORI` or `SUB` with `x0`.

```asm
not a0, a1                   # actually xori a0, a1, -1
neg a0, a1                   # actually sub  a0, x0, a1
```

## Branches

| You want … | In x86 | RISC-V replacement |
|---|---|---|
| branch if zero | `jz label` | `beqz rs, label`  (pseudo: `beq rs, x0, label`) |
| branch if not zero | `jnz label` | `bnez rs, label`  (pseudo: `bne rs, x0, label`) |

RISC-V branches always take two register operands — there is no single-operand branch in the base ISA. The common `beqz`/`bnez` mnemonics are pseudoinstructions supplied by the assembler.

```asm
beqz a0, target               # actually beq a0, x0, target
bnez a0, target               # actually bne a0, x0, target
```

## Stack

| You want … | In x86 | RISC-V replacement |
|---|---|---|
| push register | `push r` | `addi sp, sp, -8` / `sd rs, 0(sp)` |
| pop register | `pop r` | `ld rd, 0(sp)` / `addi sp, sp, 8` |

RISC-V has no stack-oriented instructions. The stack pointer (`sp` = `x2`) is a regular register with no hardware-backed push/pop semantics. Stack frames are managed explicitly.

```asm
# push a0
addi sp, sp, -8
sd   a0, 0(sp)

# pop a0
ld   a0, 0(sp)
addi sp, sp, 8
```

The standard calling convention designates `sp` as the stack pointer and requires it to remain 16-byte aligned at function-call boundaries, but no instruction enforces this — it is purely ABI convention.

## Summary

| x86 mnemonic | Exists in RISC-V? | What to use |
|---|---|---|
| `sub` with immediate | No real `subi` | `addi` with negated immediate |
| `mov` | No single instruction | `mv`, `li`, loads, stores |
| `not` | No real instruction | `not` pseudo (`xori`) |
| `neg` | No real instruction | `neg` pseudo (`sub rd, x0, rs`) |
| `jz` / `jnz` | No single-operand branch | `beqz` / `bnez` pseudo |
| `push` / `pop` | No | explicit `sp` adjustment + load/store |

Related: [What deliberately has no direct equivalent](no-equivalent.md), [Pseudoinstructions](../pseudoinstructions.md).
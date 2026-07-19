# `li` — load an integer constant

```text
li rd, constant
```

`li` constructs an integer constant in `rd`. It never loads from memory and it
does not refer to a symbol. Its expansion is determined by the constant, XLEN,
and the assembler's instruction-selection policy.

## Typical expansions

| Constant | Typical expansion | Always this expansion? | Temporary? |
|---|---|:---:|:---:|
| signed 12-bit value | `addi rd, x0, constant` | one base instruction, though it may compress | no |
| suitable 32-bit value | `lui rd, upper`; optional `addi`/`addiw rd, rd, lower` | no | no |
| general RV64 value | `lui`/`addi` plus one or more shifts and additions | no | no |

```asm
li t0, 42
li t1, 0x12345678
li t2, 0x123456789abcdef0    # RV64: usually several instructions
```

The assembler accounts for sign extension when splitting a value into upper
and lower pieces. Hand-splitting a constant with a simple shift and mask can be
wrong when the low 12-bit part is negative.

## What can change the expansion?

- The value itself and whether the target is RV32 or RV64.
- Enabled extensions, especially compressed instructions and extensions that
  offer another efficient constant-building operation.
- Assembler version and optimization policy.

No symbol relocation or code model is involved. `rd` is used throughout; `li`
does not consume a separate temporary register. Because the sequence is not
fixed, use `objdump -dr` when exact size matters.

Use [`la`](la.md) rather than `li` for a symbol address.

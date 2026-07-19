# Choose an instruction

Start with the result you need, then decide whether the operands are constants,
registers, memory values, or addresses. Pseudoinstructions such as `li`, `la`,
and `call` are usually the clearest choice; the assembler and linker can select
the required instruction sequence and relocations.

## Load an integer constant

- If the value fits a signed 12-bit immediate (-2048 through 2047), use
  `li rd, value`. It can expand to `addi rd, x0, value`.
- For any other integer constant, still use `li` unless the exact sequence
  matters. The assembler may emit `lui` plus one or more arithmetic or shift
  instructions.
- Use [`LUI`](instructions/lui.md) and
  [`ADDI`](instructions/addi.md) directly when writing relocation-aware code or
  deliberately controlling the sequence.

```asm
li t0, 37
li t1, 0x12345678
```

On RV64, constructing some 64-bit values takes more than two instructions.
Inspect the emitted code rather than assuming a particular `li` expansion.

## Compare two values

RISC-V has no condition-code register: choose an instruction according to how
the comparison result will be used.

| Needed result | Signed comparison | Unsigned comparison |
|---|---|---|
| branch if equal/not equal | `beq`, `bne` | `beq`, `bne` |
| branch if ordered | `blt`, `bge` | `bltu`, `bgeu` |
| write 0 or 1 | `slt`, `slti` | `sltu`, `sltiu` |

The assembler also accepts convenient forms such as `bgt`, `ble`, `seqz`,
`snez`, and `sgtz`, then rewrites them using base instructions. See
[`BEQ` / `BNE`](instructions/beq-bne.md),
[ordered branches](instructions/ordered-branches.md), and
[`SLT`](instructions/slt.md).

```asm
blt  a0, a1, smaller       # branch using a signed comparison
sltu t0, a0, a1            # t0 = (a0 < a1), treating both as unsigned
```

## Extend a value

If the value is being read from memory, choose a load with the desired
extension. `lb`, `lh`, and `lw` sign-extend; `lbu`, `lhu`, and RV64 `lwu`
zero-extend. `ld` reads a full 64-bit value on RV64. See
[loads](instructions/loads.md).

For a value already in a register:

- `andi rd, rs, 0xff` zero-extends a byte.
- Shift left and then arithmetic-shift right to sign-extend a byte or halfword.
- Shift left and then logical-shift right to zero-extend a halfword, or a word
  on RV64.
- On RV64, `addiw rd, rs, 0` sign-extends the low 32 bits; the `sext.w`
  pseudoinstruction expresses the same operation.
- If the relevant standard extension is available, use its `sext.*`, `zext.*`,
  or related operation instead of a multi-instruction base sequence.

## Multiply or divide by a power of two

Use a [left shift](instructions/sll.md) to multiply an integer by a power of
two. Use a logical right shift for unsigned division, or an arithmetic right
shift when the required signed rounding behavior permits it.

```asm
slli t0, a0, 3             # multiply by 8, modulo XLEN
srli t1, a1, 4             # unsigned divide by 16
```

An arithmetic right shift rounds a negative value toward negative infinity,
while signed integer division rounds toward zero. Extra adjustment is required
when that difference matters.

## Test or change a bit

- To test a low bit whose one-bit mask fits an `ANDI` immediate, use `andi` and
  then branch on zero or nonzero.
- For another bit, construct the mask with `li` and use `and`.
- With the B extension, bit extract, set, clear, and invert instructions can
  avoid a separate mask.

```asm
andi t0, a0, 0x20
bnez t0, bit_is_set
```

Do not assume every 12-bit-looking hexadecimal mask is accepted as a positive
`ANDI` immediate: instruction immediates are sign-extended. See
[`AND` / `ANDI`](instructions/and.md).

## Get an address

- Use `la rd, symbol` for the address of a symbol. Its expansion depends on the
  code model, position independence, symbol binding, and relocations.
- Use `lla rd, symbol` when you specifically need a local, PC-relative address
  and your assembler supports that pseudoinstruction.
- Use `auipc` directly when implementing a PC-relative sequence whose paired
  relocation and following instruction you control.
- Use `addi rd, base, offset` for a small byte offset from an address already in
  a register.

See [address construction](instructions/addresses.md) and
[`AUIPC`](instructions/auipc.md). Prefer a symbol pseudoinstruction over
hand-calculating an address: the linker must be able to adjust and sometimes
relax the sequence.

## Call, jump, or return

| Intent | Usual spelling | Underlying mechanism |
|---|---|---|
| call a symbol | `call symbol` | relocation-aware `jal` or `auipc`/`jalr` sequence |
| call through a register | `jalr ra, 0(rs)` | indirect jump and link |
| nearby direct call | `jal ra, label` | PC-relative jump and link |
| unconditional jump | `j label` | `jal x0, label` |
| indirect jump | `jr rs` | `jalr x0, 0(rs)` |
| return | `ret` | `jalr x0, 0(ra)` |

Use `call` for an ordinary function call so the assembler and linker can handle
range and relocation details. Use [`JAL` / `JALR`](instructions/jumps.md)
directly when the destination and link-register behavior are intentional.

## Check the result

Pseudoinstruction expansion can vary with the operands, target architecture,
code model, and linker relaxation. When instruction count or exact encoding
matters, disassemble the linked program (for example with `objdump -dr`) rather
than relying on a typical expansion.

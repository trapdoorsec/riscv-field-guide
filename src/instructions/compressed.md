# Compressed integer forms (C extension)

The C extension adds 16-bit encodings for common operations. These are not
smaller registers or different arithmetic semantics: after decoding, they have
the same architectural effect as their 32-bit counterparts. Mixing 16- and
32-bit instructions improves code density.

Assemblers normally choose compressed encodings automatically when the target
architecture includes C and the operands satisfy an encoding's restrictions.
Explicit `c.*` mnemonics are useful when the exact encoding matters.

## Zero-producing forms

```text
c.li  rd, 0          # rd ≠ x0; load signed six-bit immediate zero
c.sub rd', rs2'      # rd' = rd' - rs2'
c.xor rd', rs2'      # rd' = rd' XOR rs2'
```

`c.li rd, 0` directly provides a 16-bit way to zero any integer register other
than `x0`. `c.sub rd', rd'` and `c.xor rd', rd'` zero a register by combining it
with itself. The primes mean the compact register set `x8`–`x15`.

```asm
c.li  t0, 0
c.sub a0, a0
c.xor a1, a1
```

The base spellings may assemble to the same encodings:

```asm
li  t0, 0            # may become c.li t0, 0
sub a0, a0, a0       # may become c.sub a0, a0
xor a1, a1, a1       # may become c.xor a1, a1
```

`c.mv rd, x0` is not another zeroing form: the encoding requires a nonzero
source register, and the all-zero source field is reserved.

## Availability and inspection

Enable C in the target ISA, for example with `-march=rv64imc`. Operand and
register restrictions differ between compressed instructions, so do not assume
every base instruction can shrink. Use `objdump -dr -M no-aliases` when exact
instruction width matters.

Related: [Pseudoinstructions](../pseudoinstructions.md),
[`ADDI`](addi.md), [`SUB`](sub.md), [`XOR`](xor.md).

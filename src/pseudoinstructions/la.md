# `la`, `lla`, and `lga` — load a symbol address

These macros materialize an address and attach the relocations needed for the
linker. Their canonical two-instruction forms may later be relaxed.

## `lla` — local address

```text
lla rd, symbol
```

`lla` requests a PC-relative address directly, conventionally:

```asm
.Lanchor:
    auipc rd, %pcrel_hi(symbol)
    addi  rd, rd, %pcrel_lo(.Lanchor)
```

It is normally two instructions, uses no register besides `rd`, and is not
selected by the PIC setting. The paired relocations are essential: the low
relocation refers to the `auipc` anchor, not independently to `symbol`.

## `lga` — global address

```text
lga rd, symbol
```

`lga` obtains a potentially preemptible global symbol through the global offset
table (GOT):

```asm
.Lanchor:
    auipc rd, %got_pcrel_hi(symbol)
    ld    rd, %pcrel_lo(.Lanchor)(rd)    # RV64
```

RV32 uses `lw` instead of `ld`. The destination doubles as the GOT-address
temporary, so no extra register is consumed. The expansion depends on the ABI,
XLEN, relocations, symbol binding, and linker relaxation.

## `la` — load address

```text
la rd, symbol
```

`la` chooses between the two policies:

- With `.option nopic` (the usual default), it behaves like `lla`.
- With `.option pic`, it behaves like `lga`.

That makes `la` convenient but deliberately not a fixed instruction sequence.
Use `lla` or `lga` when the distinction is important to the reader.

## Relocation and relaxation

All three forms are relocation-dependent and normally begin as two
instructions. The linker can sometimes relax the sequence when symbol binding
and distance permit. Disassemble the linked output, not only the `.o` file, to
measure the final sequence.

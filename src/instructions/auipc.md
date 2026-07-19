# `AUIPC` — add upper immediate to PC

```text
auipc rd, imm20
```

Adds the upper immediate (`imm20 << 12`) to the address of the `AUIPC` instruction. It is the foundation for PC-relative address construction, calls, and position-independent code.

```asm
auipc t0, 0            # t0 receives the current PC
```

Relocation-aware `la` or `call` syntax is usually preferable to hand-writing the pair.

**x86 connection:** conceptually related to RIP-relative address formation, though RISC-V materialises the base in a general register.


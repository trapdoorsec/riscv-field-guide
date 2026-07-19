# RISC-V for x86 developers

The safest translation unit is an **operation**, not a mnemonic. Some operations map one-to-one; others become short sequences or disappear because RISC-V exposes different architectural state.

Three differences explain most surprises:

1. RISC-V integer instructions normally use separate destination and source operands.
2. Arithmetic operates on registers; loads and stores handle memory.
3. There is no general flags register. Branches compare values directly.

Start with the [instruction cross-reference](cross-reference.md), then read [conditionals and flags](flags.md).


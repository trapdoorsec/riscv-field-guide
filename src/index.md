# RISC-V Field Guide

**Search by mnemonic, intent, x86 name, or phrase.** Try `add immediate`, `cmp`, `load 64-bit`, `call`, `zero extend`, or `RIP-relative`.

This book is designed for the question you actually have while coding: *which instruction expresses this operation, what are its operands, and what traps should I avoid?*

Each instruction page gives you:

- a one-line operation;
- assembler syntax and a small example;
- RV32/RV64 and extension availability;
- signedness, width and immediate-range warnings;
- related pseudoinstructions;
- the closest x86 concept, where one exists.

> **Normative versus useful:** this is a field guide, not the architectural specification. When exact trap, ordering or reserved-encoding behaviour matters, follow the linked official specification.

## Quick starting points

| You want to… | Start with |
|---|---|
| move or load a constant | [`mv` and `li`](pseudoinstructions.md) |
| read or write memory | [Loads](instructions/loads.md) and [stores](instructions/stores.md) |
| compare and branch | [Conditional branches](instructions/control-flow.md) |
| call or return | [`JAL` / `JALR`](instructions/jumps.md) |
| construct an address | [`LUI`](instructions/lui.md), [`AUIPC`](instructions/auipc.md), `la` |
| translate familiar x86 | [x86 cross-reference](x86/cross-reference.md) |


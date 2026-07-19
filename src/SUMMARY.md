# Summary

- [RISC-V Field Guide](index.md)
- [How to read an instruction page](using-this-book.md)
- [Registers and ABI names](registers.md)

# Base integer instructions

- [Arithmetic](instructions/arithmetic.md)
  - [`ADD` — add registers](instructions/add.md)
  - [`ADDI` — add immediate](instructions/addi.md)
  - [`SUB` — subtract](instructions/sub.md)
  - [`SLT`, `SLTI`, `SLTU`, `SLTIU` — set less than](instructions/slt.md)
- [Bitwise and shifts](instructions/bitwise.md)
  - [`AND` / `ANDI`](instructions/and.md)
  - [`OR` / `ORI`](instructions/or.md)
  - [`XOR` / `XORI`](instructions/xor.md)
  - [`SLL` / `SLLI`](instructions/sll.md)
  - [`SRL`, `SRA` and immediate forms](instructions/right-shifts.md)
- [Memory](instructions/memory.md)
  - [`LB`, `LH`, `LW`, `LD` — loads](instructions/loads.md)
  - [`SB`, `SH`, `SW`, `SD` — stores](instructions/stores.md)
- [Control flow](instructions/control-flow.md)
  - [`BEQ` / `BNE`](instructions/beq-bne.md)
  - [`BLT`, `BGE`, `BLTU`, `BGEU`](instructions/ordered-branches.md)
  - [`JAL` / `JALR`](instructions/jumps.md)
- [Address construction](instructions/addresses.md)
  - [`LUI`](instructions/lui.md)
  - [`AUIPC`](instructions/auipc.md)
- [Environment](instructions/environment.md)
  - [`ECALL` / `EBREAK`](instructions/ecall-ebreak.md)

# Assembler conveniences

- [Pseudoinstructions](pseudoinstructions.md)

# For x86 developers

- [Start here](x86/index.md)
- [Instruction cross-reference](x86/cross-reference.md)
- [Conditionals and flags](x86/flags.md)
- [Calls, returns and the stack](x86/calls.md)
- [Addressing and memory](x86/addressing.md)
- [What deliberately has no equivalent](x86/no-equivalent.md)

# Reference

- [Sources and further reading](sources.md)
- [Instruction-page template](instructions/_template.md)


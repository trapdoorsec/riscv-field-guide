# How to read an instruction page

RISC-V conventionally writes the destination first:

```text
instruction destination, source1, source2
add         rd,          rs1,     rs2
```

`rd` is the destination register; `rs1` and `rs2` are source registers. An `imm` operand is encoded directly in the instruction. Unless a page says otherwise, the destination may be the same register as a source.

## Availability labels

- **RV32I / RV64I**: base integer ISA for 32- or 64-bit registers.
- **RV64-only**: requires 64-bit integer registers.
- **M, A, F, D, C, B, V…**: optional standard extensions.
- **Pseudo**: assembler syntax expanded into one or more real instructions.

## A word on pseudoinstructions

The assembler instruction `mv a0, a1` is convenient syntax, not a distinct machine instruction. It normally becomes `addi a0, a1, 0`. Search results include pseudoinstructions because programmers encounter both forms.


# `BLT`, `BGE`, `BLTU`, `BGEU`

```text
blt  rs1, rs2, label   # signed <
bge  rs1, rs2, label   # signed >=
bltu rs1, rs2, label   # unsigned <
bgeu rs1, rs2, label   # unsigned >=
```

Greater-than and less-or-equal forms are assembler aliases that reverse operands.

**x86 connection:** roughly replaces `cmp` plus `jl`/`jge` or `jb`/`jae`. Signedness is explicit in the branch mnemonic, not inferred from shared flags.


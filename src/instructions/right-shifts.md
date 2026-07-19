# `SRL`, `SRA` and immediate forms

```text
srl  rd, rs1, rs2      # logical: insert zeroes
sra  rd, rs1, rs2      # arithmetic: replicate sign bit
srli rd, rs1, shamt
srai rd, rs1, shamt
```

Use logical right shift for unsigned values and arithmetic right shift when you intend signed sign propagation.

**x86 connection:** `SRL` corresponds to `shr`; `SRA` corresponds to `sar`. RISC-V shifts do not expose the shifted-out bit through a carry flag.


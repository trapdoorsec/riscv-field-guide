# `BEQ` / `BNE`

```text
beq rs1, rs2, label
bne rs1, rs2, label
```

Branch when registers are equal or unequal. `beqz rs, label` and `bnez rs, label` are pseudoinstructions comparing with `x0`.

**x86 connection:** these usually replace `cmp lhs, rhs` followed by `je`/`jne`; RISC-V performs the comparison inside the branch.


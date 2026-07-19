# `XOR` / `XORI`

```text
xor  rd, rs1, rs2
xori rd, rs1, imm12
```

Compute bitwise exclusive OR. The immediate is sign-extended. `not rd, rs` is the pseudoinstruction `xori rd, rs, -1`.

**x86 connection:** equivalent bit operation to `xor`, but `xor rd, rd, rd` is unnecessary for producing zero—you can use `x0` directly or `li rd, 0`.


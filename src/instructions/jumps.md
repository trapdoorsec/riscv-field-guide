# `JAL` / `JALR`

```text
jal  rd, label
jalr rd, offset(rs1)
```

Both write the address of the following instruction to `rd` and jump. `call label` conventionally writes `ra`; `j label` discards the link in `x0`; `ret` is a `jalr` through `ra` with its link discarded.

**x86 connection:** `call`, `jmp`, and `ret` are conventions over these two instructions. Unlike x86 `call`, `JAL` does not push a return address to memory.


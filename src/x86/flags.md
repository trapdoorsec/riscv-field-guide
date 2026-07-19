# Conditionals and flags

x86 often separates comparison from use:

```asm
cmp rax, rbx
jl  smaller
```

RISC-V puts the comparison into the branch:

```asm
blt a0, a1, smaller
```

This means there is no stale-flags hazard, but it also means carry, borrow and overflow must be represented explicitly when needed. For example, unsigned addition carry can be detected by comparing the sum with an operand:

```asm
add  t0, a0, a1
sltu t1, t0, a0        # t1 = carry-out
```

See [`SLT` / `SLTI` / `SLTU` / `SLTIU`](../instructions/slt.md).

Do not translate `cmp` in isolation. Translate the compare-plus-consumer operation.

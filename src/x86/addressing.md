# Addressing and memory

x86 can fold base, index, scale and displacement into many operations:

```asm
mov rax, [rbx + rcx*8 + 16]
```

RISC-V memory instructions accept a base register and signed 12-bit byte offset. Calculate the indexed address first:

```asm
slli t0, a1, 3
add  t0, a0, t0
ld   t1, 16(t0)
```

This is a normal expression of the load/store design, not necessarily three serialized hardware operations; implementations may overlap or fuse work internally.


# Calls, returns and the stack

x86 `call` implicitly pushes a return address. RISC-V `jal ra, target` writes it to `ra`. A non-leaf function saves `ra` itself if it will make another call.

```asm
addi sp, sp, -16
sd   ra, 8(sp)

call child

ld   ra, 8(sp)
addi sp, sp, 16
ret
```

There are no base `push` and `pop` instructions. Stack movement and memory access remain visible and independently schedulable.


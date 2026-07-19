# `ECALL` / `EBREAK`

`ecall` requests service from the execution environment. Its ABI-defined meaning depends on whether you are in Linux userspace, an SBI-aware supervisor, firmware, or another environment.

`ebreak` requests a breakpoint exception, commonly for a debugger.

**x86 connection:** `ecall` resembles `syscall` only when the surrounding ABI assigns it that role. `ebreak` is closest to `int3`.


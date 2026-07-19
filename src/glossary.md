# Glossary of acronyms and terms

This glossary expands abbreviations used throughout the guide. Instruction
mnemonics such as `ADDI` and `JALR` are documented on their instruction pages
rather than repeated here.

| Term | Meaning |
|---|---|
| **ABI** | **Application Binary Interface.** Conventions that let separately built code interoperate, including register use, argument passing, stack layout, and object-file details. See [registers and ABI names](registers.md). |
| **ALU** | **Arithmetic Logic Unit.** The part of a processor that performs integer arithmetic, comparisons, shifts, and bitwise operations. |
| **CSR** | **Control and Status Register.** A register in RISC-V's separate 12-bit CSR address space, accessed with Zicsr instructions. See [CSR access](instructions/csr.md). |
| **EEI** | **Execution Environment Interface.** The contract between software and the environment that runs it, defining matters such as traps, memory behavior, and the meaning of environment calls. |
| **ELF** | **Executable and Linkable Format.** The common object-file, executable, and shared-library format used by RISC-V Unix-like toolchains. |
| **GOT** | **Global Offset Table.** A linker-managed table used to obtain addresses of global symbols, especially in position-independent code. See [`la`, `lla`, and `lga`](pseudoinstructions/la.md). |
| **GPR** | **General-Purpose Register.** One of the integer registers `x0`–`x31` in the standard base ISA. |
| **IPI** | **Interprocessor Interrupt.** A notification sent from one hart to another, commonly used by operating systems for cross-hart coordination. |
| **ISA** | **Instruction Set Architecture.** The programmer-visible contract implemented by a processor: instructions, registers, exceptions, memory rules, and related architectural behavior. |
| **MIE** | **Machine Interrupt Enable.** Depending on context, the global M-mode interrupt-enable bit in `mstatus`, or the `mie` CSR that enables individual machine interrupt sources. |
| **MTIE** | **Machine Timer Interrupt Enable.** The bit in the `mie` CSR that enables machine-timer interrupts. |
| **PC** | **Program Counter.** The address associated with the instruction currently being executed. RISC-V has no ordinary instruction that directly reads a dedicated PC register; PC-relative operations such as `AUIPC` use it implicitly. See [`AUIPC`](instructions/auipc.md). |
| **PIC** | **Position-Independent Code.** Code that can execute correctly after being loaded at different addresses, normally using PC-relative addressing and linker-managed tables. |
| **PLT** | **Procedure Linkage Table.** Linker-generated machinery used by some ELF environments to resolve calls to externally defined functions. |
| **psABI** | **Processor-Specific Application Binary Interface.** The architecture-specific portion of an ABI, including RISC-V calling conventions, ELF relocations, and object-file rules. |
| **RISC** | **Reduced Instruction Set Computer.** A processor design tradition favoring regular instruction encodings and explicit load/store operations. |
| **RV32 / RV64** | RISC-V ISA families with 32- or 64-bit integer registers respectively. A suffix names included ISA components: for example, RV64I is the 64-bit base integer ISA and RV64IMC additionally includes M and C. |
| **RVWMO** | **RISC-V Weak Memory Ordering.** The standard relaxed memory-consistency model used by RISC-V. See [`FENCE`](instructions/fence.md). |
| **SBI** | **Supervisor Binary Interface.** The interface commonly used by a RISC-V supervisor operating system to request services from machine-mode firmware. |
| **TLS** | **Thread-Local Storage.** Per-thread data addressed using ABI- and linker-defined mechanisms; the `tp` register conventionally participates in locating it. |
| **XLEN** | **Integer register width.** The number of bits in an integer register for the current ISA: normally 32 in RV32 or 64 in RV64. |

## Common non-acronym terms

| Term | Meaning |
|---|---|
| **hart** | A **hardware thread**: one independently executing RISC-V instruction stream with its own architectural state. |
| **immediate** | A constant encoded as part of an instruction rather than read from a register or memory. |
| **pseudoinstruction** | Assembler syntax that expands into one or more real instructions. See [pseudoinstructions](pseudoinstructions.md). |
| **relocation** | Metadata asking the assembler or linker to fill in or adjust a value once a symbol's final address is known. |

# x86 instruction cross-reference

This table maps programmer intent. “Sequence” means there is no single direct equivalent.

| x86 concept | RISC-V | Mapping | Important difference |
|---|---|---:|---|
| `mov reg, reg` | `mv` pseudo | direct | expands to an integer instruction |
| `mov reg, imm` | `li` pseudo | direct intent | may expand to several instructions |
| `mov reg, [mem]` | `lb/lh/lw/ld`, unsigned variants | direct | extension behaviour is explicit |
| `mov [mem], reg` | `sb/sh/sw/sd` | direct | no general memory-to-memory move |
| `movzx` / `movsx` load | unsigned/signed load variant | direct | selected by load mnemonic |
| `add` | `add` / `addi` | direct | three operands; no flags |
| `sub` | `sub`; `addi` with negative immediate | direct/near | no `subi` in the base ISA |
| `inc` / `dec` | `addi rd, rs, 1/-1` | direct intent | no dedicated opcode; no flags |
| `and` / `or` / `xor` | same names, or `andi/ori/xori` | direct | immediate forms are separate |
| `not` / `neg` | same-name pseudos | direct intent | aliases over base instructions |
| `shl` / `sal` | `sll` / `slli` | direct | no carry flag |
| `shr` | `srl` / `srli` | direct | logical right shift |
| `sar` | `sra` / `srai` | direct | arithmetic right shift |
| `lea dst, [a+b]` | `add dst, a, b` | often direct | complex scale/index forms need a sequence |
| `lea dst, [rip+disp]` | `auipc` pair / `la` | near | relocation-aware sequence |
| `cmp a, b; je/jne` | `beq` / `bne` | fused intent | no stored flags |
| `cmp; jl/jge` | `blt` / `bge` | fused intent | signedness in mnemonic |
| `cmp; jb/jae` | `bltu` / `bgeu` | fused intent | unsigned comparison |
| `setl` / `setb` / `setcc` | `slt` / `sltu` and immediate forms | direct | writes a full register, not a byte; no flags needed |
| `test r, r; jz` | `beqz r, label` pseudo | fused intent | compares directly with `x0` |
| `jmp label` | `j label` pseudo | direct intent | expands to `jal x0` |
| `jmp reg` | `jr reg` pseudo | direct intent | expands to `jalr x0` |
| `call` | `call` pseudo / `jal ra` | direct intent | return address goes in `ra`, not on stack |
| `ret` | `ret` pseudo | direct intent | jumps through `ra` |
| `push` / `pop` | adjust `sp` plus stores/loads | sequence | deliberately not single instructions |
| `syscall` | `ecall` | environment-dependent | ABI supplies syscall convention |
| `int3` | `ebreak` | near | architectural exception model differs |
| `nop` | `nop` pseudo | direct intent | canonical encoding is `addi x0,x0,0` |
| `cmovcc` | branch sequence or `Zicond` operations | sequence/extension | base ISA has no flags or conditional move |
| `rep movsb` | loop or vector/library implementation | sequence | no base string engine |


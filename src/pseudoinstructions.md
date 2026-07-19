# Pseudoinstructions

Pseudoinstructions are assembler syntax, not additional ISA operations. Some
are fixed aliases for one real instruction. Others are assembler macros whose
length depends on the operands, target architecture, position-independent-code
setting, relocations, or linker relaxation.

In the tables below, **one instruction** describes the canonical expansion
before optional compressed-instruction selection or linker relaxation.
**Temporary** means a register in addition to the pseudo's explicit result or
source registers.

## Register and arithmetic conveniences

| Pseudo | Canonical expansion | One instruction? | Relocation or code-model dependent? | Temporary? |
|---|---|:---:|:---:|:---:|
| `mv rd, rs` | `addi rd, rs, 0` | yes | no | no |
| `nop` | `addi x0, x0, 0` | yes | no | no |
| `not rd, rs` | `xori rd, rs, -1` | yes | no | no |
| `neg rd, rs` | `sub rd, x0, rs` | yes | no | no |
| `negw rd, rs` (RV64) | `subw rd, x0, rs` | yes | no | no |
| `sext.w rd, rs` (RV64) | `addiw rd, rs, 0` | yes | no | no |
| [`li rd, imm`](pseudoinstructions/li.md) | operand-dependent constant construction | not always | operand and XLEN; no symbol relocation | no |

## Comparisons that write 0 or 1

| Pseudo | Canonical expansion | One instruction? | Relocation or code-model dependent? | Temporary? |
|---|---|:---:|:---:|:---:|
| `seqz rd, rs` | `sltiu rd, rs, 1` | yes | no | no |
| `snez rd, rs` | `sltu rd, x0, rs` | yes | no | no |
| `sltz rd, rs` | `slt rd, rs, x0` | yes | no | no |
| `sgtz rd, rs` | `slt rd, x0, rs` | yes | no | no |

These names make the intended relation to zero explicit. For two arbitrary
registers, use `slt` or `sltu` and swap operands or invert the Boolean when the
opposite relation is needed.

## Branch conveniences

| Pseudo | Canonical expansion | One instruction? | Relocation or code-model dependent? | Temporary? |
|---|---|:---:|:---:|:---:|
| `beqz rs, label` | `beq rs, x0, label` | yes | no [^label-reloc] | no |
| `bnez rs, label` | `bne rs, x0, label` | yes | no [^label-reloc] | no |
| `bltz rs, label` | `blt rs, x0, label` | yes | no [^label-reloc] | no |
| `bgez rs, label` | `bge rs, x0, label` | yes | no [^label-reloc] | no |
| `bgtz rs, label` | `blt x0, rs, label` | yes | no [^label-reloc] | no |
| `blez rs, label` | `bge x0, rs, label` | yes | no [^label-reloc] | no |
| `bgt rs, rt, label` | `blt rt, rs, label` | yes | no [^label-reloc] | no |
| `ble rs, rt, label` | `bge rt, rs, label` | yes | no [^label-reloc] | no |
| `bgtu rs, rt, label` | `bltu rt, rs, label` | yes | no [^label-reloc] | no |
| `bleu rs, rt, label` | `bgeu rt, rs, label` | yes | no [^label-reloc] | no |

The reversed forms work by swapping the two source operands; they do not need a
separate comparison instruction.

[^label-reloc]: The label is still resolved by an assembler or linker
    relocation. That changes the encoded displacement, not the canonical
    pseudoinstruction expansion. An out-of-range conditional branch generally
    requires the programmer or another tool to provide a longer sequence.

## Calls, jumps, and returns

| Pseudo | Canonical expansion | One instruction? | Relocation or code-model dependent? | Temporary? |
|---|---|:---:|:---:|:---:|
| `j label` | `jal x0, label` | yes | relocation resolves target | no |
| `jr rs` | `jalr x0, 0(rs)` | yes | no | no |
| `ret` | `jalr x0, 0(ra)` | yes | no | no |
| [`call symbol`](pseudoinstructions/call.md) | `auipc ra, ...`; `jalr ra, ...` | not always | yes; linker may relax it | no extra register |
| [`tail symbol`](pseudoinstructions/tail.md) | `auipc t1, ...`; `jalr x0, ...` | not always | yes; linker may relax it | yes, `t1` (`x6`) |

`call rd, symbol` is also accepted by GNU-compatible assemblers when a link
register other than `ra` is intentional. A plain `call symbol` uses `ra`.

## CSR conveniences

These require the Zicsr extension. Each is one instruction, has no symbol
relocation or code-model choice, and uses no temporary register.

| Pseudo | Canonical expansion | Effect |
|---|---|---|
| `csrr rd, csr` | `csrrs rd, csr, x0` | read CSR without changing it |
| `csrw csr, rs` | `csrrw x0, csr, rs` | write CSR; discard old value |
| `csrs csr, rs` | `csrrs x0, csr, rs` | set selected bits |
| `csrc csr, rs` | `csrrc x0, csr, rs` | clear selected bits |
| `csrwi csr, uimm5` | `csrrwi x0, csr, uimm5` | write a 5-bit immediate |
| `csrsi csr, uimm5` | `csrrsi x0, csr, uimm5` | set bits from an immediate |
| `csrci csr, uimm5` | `csrrci x0, csr, uimm5` | clear bits from an immediate |

See [CSR access](instructions/csr.md) for the side-effect rules that distinguish
`csrrw` from `csrrs`/`csrrc` when a source or destination is `x0`.

## Addresses and symbols

| Pseudo | Canonical expansion | One instruction? | Relocation or code-model dependent? | Temporary? |
|---|---|:---:|:---:|:---:|
| [`lla rd, symbol`](pseudoinstructions/la.md#lla-local-address) | PC-relative `auipc` + `addi` | no | relocations; PIC setting does not change it | no extra register |
| [`lga rd, symbol`](pseudoinstructions/la.md#lga-global-address) | GOT-relative `auipc` + `lw`/`ld` | no | relocations, ABI, and XLEN | no extra register |
| [`la rd, symbol`](pseudoinstructions/la.md#la-load-address) | `lla` in non-PIC code; `lga` in PIC code | no | yes; `.option pic` selects the form | no extra register |

Here the destination register doubles as the working address register, so it is
modified by the first instruction but no additional temporary is consumed.

## Symbol loads and stores

GNU-compatible assemblers accept address-forming macros that combine a symbol
reference with a load or store. They are convenient, but they are not ordinary
base load/store syntax and are not guaranteed by every assembler.

| Assembler form | Canonical expansion | One instruction? | Relocation or code-model dependent? | Temporary? |
|---|---|:---:|:---:|:---:|
| `lb/lbu/lh/lhu/lw/lwu/ld rd, symbol` | `auipc rd, %pcrel_hi(symbol)`; matching load into `rd` | no | PC-relative relocations; width/XLEN constraints | no extra register |
| `sb/sh/sw/sd rs, symbol, tmp` | `auipc tmp, %pcrel_hi(symbol)`; matching store via `tmp` | no | PC-relative relocations; width/XLEN constraints | yes, explicit `tmp` |
| `flw/fld fd, symbol, tmp` | `auipc tmp, %pcrel_hi(symbol)`; FP load via `tmp` | no | PC-relative relocations and enabled FP extension | yes, explicit `tmp` |
| `fsw/fsd fs, symbol, tmp` | `auipc tmp, %pcrel_hi(symbol)`; FP store via `tmp` | no | PC-relative relocations and enabled FP extension | yes, explicit `tmp` |

The second instruction carries the matching `%pcrel_lo` relocation. Integer
loads can reuse `rd` for address construction because the load overwrites it.
Stores and floating-point loads cannot, so their syntax names a temporary
integer register. These forms address the symbol directly; use `la`/`lga` plus
an explicit load when GOT-based interposition semantics must be clear.

## Inspect the emitted code

Canonical expansions explain the meaning, not necessarily the final bytes.
The C extension can provide a compressed encoding for some aliases, and linker
relaxation can shorten relocation-marked sequences. Use `objdump -dr` on object
files to see relocations and on the linked executable to see the final code.

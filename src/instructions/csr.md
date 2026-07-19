# `CSRRW`, `CSRRS`, `CSRRC` — CSR access

```text
csrrw  rd, csr, rs1       # write csr ← rs1,  old value → rd
csrrs  rd, csr, rs1       # set   bits in csr from rs1
csrrc  rd, csr, rs1       # clear bits in csr from rs1
csrrwi rd, csr, uimm5     # write csr ← uimm5
csrrsi rd, csr, uimm5     # set   bits in csr from uimm5
csrrci rd, csr, uimm5     # clear bits in csr from uimm5
```

Read and write control and status registers (Zicsr extension). The 12-bit CSR address encodes both the register number and the privilege level required to access it.

Reading a CSR produces the old value in `rd`. Writing to a CSR (via `rs1` or `uimm5`) can have immediate side effects defined by the specific CSR — updating timer compare values, enabling interrupts, switching address spaces, etc.

| Form | Effect | Use case |
|---|---|---|
| `csrrw` | atomic read-write | switching a CSR to a known value |
| `csrrs` | atomic read-set (OR) | enabling individual flags |
| `csrrc` | atomic read-clear (AND~) | disabling individual flags |
| `csrrw rd, csr, x0` | read + write zero | reads csr **and** writes zero to it — may trigger side effects |
| `csrrs rd, csr, x0` | read-only | read csr, no bits set (write suppressed because `rs1 = x0`) |
| `csrrc rd, csr, x0` | read-only | read csr, no bits cleared (write suppressed because `rs1 = x0`) |
| `csrrwi` | immediate read-write | always writes the zero-extended `uimm5` value |
| `csrrsi` / `csrrci` | immediate read-set/read-clear | a zero `uimm5` suppresses the write |

```asm
# Read cycle counter when the execution environment permits access
csrr a0, cycle

# Enable machine-timer interrupts in mie, then globally enable M-mode interrupts
li   t0, 1 << 7           # MTIE bit in mie
csrrs x0, mie, t0
li   t0, 1 << 3           # MIE bit (machine interrupt enable)
csrrs x0, mstatus, t0

# Disable machine-mode interrupts
li   t0, 1 << 3
csrrc x0, mstatus, t0

# Write satp (supervisor address translation) with a page-table root
li   t0, (SATP_MODE_SV39 << SATP_MODE_OFFSET) | phys_pa4k
csrrw x0, satp, t0
```

## Common pseudoinstructions

| Pseudo | Expansion | Effect |
|---|---|---|
| `csrr rd, csr` | `csrrs rd, csr, x0` | read CSR |
| `csrw csr, rs1` | `csrrw x0, csr, rs1` | write CSR (discard old value) |
| `csrs csr, rs1` | `csrrs x0, csr, rs1` | set bits |
| `csrc csr, rs1` | `csrrc x0, csr, rs1` | clear bits |
| `csrwi csr, uimm5` | `csrrwi x0, csr, uimm5` | write immediate |
| `csrsi csr, uimm5` | `csrrsi x0, csr, uimm5` | set bits immediate |
| `csrci csr, uimm5` | `csrrci x0, csr, uimm5` | clear bits immediate |

## CSR address layout

The 12-bit CSR number encodes both writability and the minimum privilege level:

| Bits[11:10] | Writable? |
|---|---|
| `11` | read-only |
| `10` | read/write |
| `01` | read/write |
| `00` | read/write |

| Bits[9:8] | Minimum privilege |
|---|---|
| `00` | **U** — unprivileged |
| `01` | **S** — supervisor |
| `10` | **H** — hypervisor (if H extension present) |
| `11` | **M** — machine |

Attempting to read a CSR from an insufficient privilege level raises an illegal-instruction exception. Writes may also be read-only depending on the specific CSR.

Notable CSRs include `cycle`, `time`, `instret` (unprivileged counters), `mtvec`, `mstatus`, `mie`, `mtval` (machine), `stvec`, `satp`, `sepc` (supervisor).

## x86 connection

Closest to `MOV CRn` / `MOV DRn` or `RDMSR` / `WRMSR`, but with atomic read-modify-write built into the instruction (no separate `AND`/`OR` needed). CSRs replace the role of x86 model-specific registers (MSRs) and control registers, but with a unified 12-bit address space shared across all privilege levels.

Related: [`ECALL` / `EBREAK`](ecall-ebreak.md), [`FENCE`](fence.md).

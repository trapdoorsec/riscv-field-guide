# `FENCE` / `FENCE.I` — memory ordering

```text
fence [pred], [succ]      # ordering                (RV32I)
fence.i                   # instruction-fence sync  (Zifencei)
```

Orders memory accesses observed by other harts (hardware threads) or external devices. Without `FENCE`, a RISC-V hart may reorder memory operations with respect to other harts—even stores that appear sequentially in program order.

Ordinary single-threaded code usually does not need an explicit `FENCE`.
Concurrent code should normally use language or compiler atomic operations,
which select the required ISA ordering. Device drivers and low-level runtime or
kernel code use fences directly when ordering memory or I/O observations.

## Predecessor and successor sets

The optional `pred` and `succ` arguments each name a subset of `I`, `O`, `R`, `W`. `FENCE pred, succ` orders all accesses in `pred` **before** all accesses in `succ` from the perspective of the observing hart or device.

| Mnemonic | Meaning |
|---|---|
| `W` | Write (store) |
| `R` | Read (load) |
| `O` | Device output |
| `I` | Device input |

Note: `I` and `O` refer to **device** input and output (memory-mapped I/O), not instruction fetch. Instruction-fetch ordering requires `FENCE.I` (Zifencei).

| Common form | Ordering guarantee |
|---|---|
| `fence` | `fence iorw, iorw` — all memory and device-I/O accesses before all subsequent ones |
| `fence w, w` | store before store |
| `fence r, r` | load before load |
| `fence r, w` | load before store |
| `fence rw, rw` | load/store before load/store |

```asm
fence             # full ordering of memory and device-I/O accesses
fence w, w        # store-store ordering (weaker than full fence)
fence r, rw       # all loads before subsequent loads and stores
```

## `FENCE.I` (Zifencei)

`fence.i` ensures that prior stores to instruction-memory regions are observed
by subsequent instruction fetches on the **same hart**. It is required when a
program writes machine code and then executes it. It does not by itself make
another hart's instruction fetches coherent; the execution environment must
arrange for each affected hart to perform the required instruction-fetch
synchronization, commonly through an operating-system service or IPI.

`FENCE.I` belongs to the Zifencei extension on both RV32 and RV64.

```asm
# a0 points to instructions this hart has just written
fence.i                  # make those stores visible to later instruction fetches
jalr ra, 0(a0)           # execute the generated code
```

## x86 connection

x86 uses a stronger memory model than RVWMO, so direct instruction-for-
instruction fence translations are often misleading. At a high level:

| RISC-V | x86 |
|---|---|
| `fence rw, rw` | broadly comparable to `mfence`, with different architectural details |
| `fence.i` | `__builtin___clear_cache` (no direct instruction) |

Related: [`ECALL` / `EBREAK`](ecall-ebreak.md).

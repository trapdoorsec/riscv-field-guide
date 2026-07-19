# `call` — call a symbol

```text
call symbol
call rd, symbol       # GNU-compatible explicit link-register form
```

`call symbol` transfers control and writes the return address to `ra`. Its
canonical relocation-aware expansion can reach beyond `jal`'s direct range:

```asm
auipc ra, %pcrel_hi(symbol)
jalr  ra, %pcrel_lo(symbol)(ra)
```

The actual object uses a call relocation that keeps the pair together; the
relocation spelling above is explanatory rather than a recommendation to write
the pair by hand.

## Is it always one instruction?

No. The assembler normally emits an `auipc`/`jalr` pair. If the final target is
in range and symbol binding permits it, the linker may relax that pair to
`jal ra, symbol`, or to an applicable compressed form when the target ISA and
register constraints allow one.

Symbol binding, target distance, enabled extensions, and linker relaxation can
therefore change the final expansion. The `.option pic` setting does not select
a different canonical `call` form.

## Register use

The ordinary form uses `ra` both as the link register and as the intermediate
PC-relative address register. It does not consume an additional temporary. The
explicit `call rd, symbol` form uses `rd` in those roles instead.

Unlike an x86 `call`, no return address is pushed to memory. Saving `ra` and
building a stack frame are separate ABI responsibilities.

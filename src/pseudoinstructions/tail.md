# `tail` — tail-call a symbol

```text
tail symbol
```

`tail` transfers control without creating a new return address. The current
function's caller remains the eventual return destination. Its canonical
relocation-aware form is:

```asm
auipc t1, %pcrel_hi(symbol)
jalr  x0, %pcrel_lo(symbol)(t1)
```

GNU-compatible assemblers reserve `t1` (`x6`) as the scratch register for this
macro. The call relocation on the emitted pair carries the exact linker
semantics; the explicit modifiers above show the address calculation.

## Is it always one instruction?

No. It normally starts as two instructions. The linker may relax it to
`jal x0, symbol`, or to an applicable compressed jump, when the final target and
enabled ISA allow it. Symbol binding, distance, enabled extensions, and
relaxation can therefore change the final sequence; `.option pic` does not
select a different canonical `tail` form.

## ABI consequences

`tail` deliberately does not write `ra`, but it clobbers `t1`. Before using it,
the function must restore any stack frame and callee-saved registers just as it
would before returning. Arguments must already be arranged according to the
calling convention.

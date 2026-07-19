# Incantations

<div class="incantation-marker incantation-intro"></div>

This section is inspired by the puzzle-box spirit of xorpd's brilliant [*xchg rax,rax*](https://www.xorpd.net/pages/xchg_rax/snip_00.html).

This is not a translation or reproduction of that book. However, you will find a similar collection of RISC-V curiosities.

These examples are here to develop intuition about `x0`, sign extension,
instruction aliases, exceptional arithmetic results, relocations, compressed
encodings, and other corners of the ISA. Some are useful idioms. Others are
deliberately perverse ways to reach an ordinary result.

I like that xorpd's approach is to provide you the examples without explanation. This forces the curious to explore, and therefore learn, far better than documentation can teach.

> Unless an entry says otherwise, examples operate on integer registers and use
GNU-compatible assembler syntax. Instruction size refers to the final encoding,
not the number of source-code characters. Linker relaxation and the C extension
can make a familiar pseudoinstruction smaller than its canonical expansion.

[Explore the incantations](0x00.md).

<nav class="incantation-nav" aria-label="Incantation navigation">
  <span class="incantation-nav-disabled" aria-disabled="true">← Previous</span>
  <span class="incantation-nav-position">Introduction</span>
  <a href="0x00.html" rel="next">Next →</a>
</nav>

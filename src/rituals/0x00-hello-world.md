<div class="ritual-marker ritual-entry">
  <h1>Ritual I: Hello World</h1>

  <div class="ritual-brief">
    <p class="ritual-verse">Words wait in silence.<br>The kernel carries their voice.<br>Return without trace.</p>
    <p>Write an RV64 Linux program that prints <code>Hello, RISC-V!</code> followed by a newline, then exits successfully.</p>
    <p class="ritual-hint">Begin at <code>_start</code>. Use only Linux <code>write</code> and <code>exit</code> system calls—no C library.</p>
  </div>

  <details class="ritual-solution">
    <summary>Reveal solution</summary>
    <div class="ritual-solution-content">
      <pre><code class="language-asm">.section .rodata
message:
    .ascii "Hello, RISC-V!\n"
.equ message_len, . - message
.section .text
.globl _start
_start:
    li      a0, 1
    la      a1, message
    li      a2, message_len
    li      a7, 64
    ecall
    li      a0, 0
    li      a7, 93
    ecall</code></pre>
      <p><code>write</code> receives the file descriptor, address, and length in <code>a0</code>–<code>a2</code>. The syscall number goes in <code>a7</code>. The second <code>ecall</code> exits with status zero.</p>
    </div>
  </details>

  <nav class="ritual-nav" aria-label="Ritual navigation">
    <a href="index.html" rel="prev">← Previous</a>
    <span class="ritual-nav-position">0x00</span>
    <a href="0x01-sum-array.html" rel="next">Next →</a>
  </nav>
</div>

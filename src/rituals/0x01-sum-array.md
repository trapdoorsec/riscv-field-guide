<div class="ritual-marker ritual-entry">
  <h1>Ritual II: Sum an Array</h1>

  <div class="ritual-brief">
    <p class="ritual-verse">Eight bytes mark each step.<br>A dwindling count guides the path.<br>One register remains.</p>
    <p>Write an RV64 function named <code>sum</code>. It receives the address of an array of 64-bit integers in <code>a0</code> and its element count in <code>a1</code>. Return their wrapping sum in <code>a0</code>.</p>
    <p class="ritual-hint">An empty array must return zero. Use only caller-saved registers and do not modify memory.</p>
  </div>

  <details class="ritual-solution">
    <summary>Reveal solution</summary>
    <div class="ritual-solution-content">
      <pre><code class="language-asm">.globl sum
sum:
    mv      t0, a0
    mv      t1, a1
    li      a0, 0
.Lsum_loop:
    beqz    t1, .Lsum_done
    ld      t2, 0(t0)
    add     a0, a0, t2
    addi    t0, t0, 8
    addi    t1, t1, -1
    j       .Lsum_loop
.Lsum_done:
    ret</code></pre>
      <p><code>t0</code> walks through memory while <code>t1</code> counts down. Initializing <code>a0</code> before the loop handles an empty array and leaves the result in the return register.</p>
    </div>
  </details>

  <nav class="ritual-nav" aria-label="Ritual navigation">
    <a href="0x00-hello-world.html" rel="prev">← Previous</a>
    <span class="ritual-nav-position">0x01</span>
    <a href="0x02-change-case.html" rel="next">Next →</a>
  </nav>
</div>

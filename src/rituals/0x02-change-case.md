<div class="ritual-marker ritual-entry">
  <h1>Ritual III: Change the Case</h1>

  <div class="ritual-brief">
    <p class="ritual-verse">Read until nothing.<br>Only the small letters change.<br>The path stays the same.</p>
    <p>Write an RV64 function named <code>uppercase</code>. It receives a pointer to a null-terminated ASCII string in <code>a0</code> and converts each lowercase letter to uppercase in place.</p>
    <p class="ritual-hint">Leave every other byte unchanged. Return the original pointer in <code>a0</code>.</p>
  </div>

  <details class="ritual-solution">
    <summary>Reveal solution</summary>
    <div class="ritual-solution-content">
      <pre><code class="language-asm">.globl uppercase
uppercase:
    mv      t0, a0
.Lcase_loop:
    lbu     t1, 0(t0)
    beqz    t1, .Lcase_done
    li      t2, 97
    bltu    t1, t2, .Lcase_next
    li      t2, 123
    bgeu    t1, t2, .Lcase_next
    addi    t1, t1, -32
    sb      t1, 0(t0)
.Lcase_next:
    addi    t0, t0, 1
    j       .Lcase_loop
.Lcase_done:
    ret</code></pre>
      <p>The half-open range <code>[97, 123)</code> selects lowercase ASCII. Subtracting 32 produces the corresponding uppercase byte. Because only <code>t0</code> advances, <code>a0</code> still holds the original address.</p>
    </div>
  </details>

  <nav class="ritual-nav" aria-label="Ritual navigation">
    <a href="0x01-sum-array.html" rel="prev">← Previous</a>
    <span class="ritual-nav-position">0x02</span>
    <span class="ritual-nav-disabled" aria-disabled="true">Next →</span>
  </nav>
</div>

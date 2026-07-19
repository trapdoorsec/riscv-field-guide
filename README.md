# RISC-V Field Guide

A programmer-first, full-text-searchable RISC-V reference built with mdBook.

The initial edition concentrates on RV32I/RV64I instructions commonly encountered in systems code, plus an x86-to-RISC-V translation guide. Instruction text is original and intentionally concise; the official ISA manual remains authoritative.

## Build

Install [mdBook](https://rust-lang.github.io/mdBook/guide/installation.html), then run:

```sh
mdbook serve --open
```

The development server rebuilds the book as files change. A static build is produced with:

```sh
mdbook build
```

## Adding an instruction

1. Copy `src/instructions/_template.md`.
2. Name it after the lowercase mnemonic.
3. Add it to `src/SUMMARY.md` under the correct extension/category.
4. Include aliases and x86 terminology in the prose so mdBook's full-text search can find them.

## Scope and licensing

The site structure and usability goals are inspired by Project F's assembler guide and RVOpcode. This project does not copy their explanatory prose. Architectural facts and semantics are checked against the official RISC-V specifications.

Code and original prose in this starter are released under MIT; see `LICENSE`. External references retain their respective licences.


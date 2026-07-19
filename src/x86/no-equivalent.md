# What deliberately has no direct equivalent

Do not hunt indefinitely for single-instruction matches to these x86 features:

- implicit flags and condition-code consumers;
- general memory operands on arithmetic instructions;
- `push` and `pop`;
- `loop` and `jrcxz`-style specialised branches;
- `rep` string operations;
- multi-component effective addresses in a load/store;
- variable-length prefix-driven instruction variants;
- a hardware-maintained return address on the ordinary stack.

Some optional RISC-V extensions add higher-level operations, but the base translation is usually a short, explicit sequence.


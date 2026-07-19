# Registers and ABI names

Integer registers have architectural names `x0`–`x31` and conventional ABI names. `x0` always reads as zero; writes to it are discarded.

| Register | ABI | Conventional purpose | Preserved across calls? |
|---|---|---|---|
| `x0` | `zero` | hard-wired zero | n/a |
| `x1` | `ra` | return address | no |
| `x2` | `sp` | stack pointer | yes |
| `x3` | `gp` | global pointer | special |
| `x4` | `tp` | thread pointer | special |
| `x5`–`x7` | `t0`–`t2` | temporaries | no |
| `x8` | `s0` / `fp` | saved register / frame pointer | yes |
| `x9` | `s1` | saved register | yes |
| `x10`–`x17` | `a0`–`a7` | arguments / return values | no |
| `x18`–`x27` | `s2`–`s11` | saved registers | yes |
| `x28`–`x31` | `t3`–`t6` | temporaries | no |


# Getting started

This gets a small RISC-V assembly program running on your current computer. You
do not need RISC-V hardware.

## 1. Install the tools

Choose your operating system.

### Linux (Ubuntu or Debian)

Open a terminal:

```sh
sudo apt update
sudo apt install gcc-riscv64-linux-gnu qemu-user
```

### Windows

Open PowerShell as Administrator and [install WSL](https://learn.microsoft.com/windows/wsl/install):

```powershell
wsl --install
```

Restart Windows, open **Ubuntu**, then run:

```sh
sudo apt update
sudo apt install gcc-riscv64-linux-gnu qemu-user
```

### macOS

Install [Docker Desktop](https://docs.docker.com/desktop/setup/install/mac-install/).
Open Terminal in the directory where you want to work, then run:

```sh
docker run --rm -it -v "$PWD":/work -w /work ubuntu:24.04 bash
apt update
apt install -y gcc-riscv64-linux-gnu qemu-user
```

Keep this container terminal open for the remaining steps.

## 2. Write Hello World

Create a file named `hello.s`:

```asm
.section .rodata
message:
    .ascii "Hello, RISC-V!\n"
.equ message_len, . - message

.section .text
.globl _start
_start:
    li a0, 1
    la a1, message
    li a2, message_len
    li a7, 64
    ecall

    li a0, 0
    li a7, 93
    ecall
```

## 3. Build and run it

Run these commands in the directory containing `hello.s`:

```sh
riscv64-linux-gnu-gcc -nostdlib -static -o hello hello.s
qemu-riscv64 ./hello
```

You should see:

```text
Hello, RISC-V!
```

## 4. Change it

Edit the text inside `.ascii`, then build and run the program again.

Useful next pages:

- [Registers and ABI names](registers.md)
- [`li` — load an integer constant](pseudoinstructions/li.md)
- [`la` — load an address](pseudoinstructions/la.md)
- [`ECALL` — ask the environment for a service](instructions/ecall-ebreak.md)

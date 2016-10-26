# check-versions

I can never keep up to date with every single Node and npm update, so this binary checks your local Node and npm versions and notifies you if they're out of date so that you can update as soon as possible. Bonus points if it's called every time you open a Terminal window.


***


## Setup

1. Clone the repo.
  ```bash
  $ git clone git@github.com:nathanbuchar/check-versions.git
  ```
2. `cd` into the project.
  ```bash
  $ cd check-versions
  ```
3. Link the binary with Node.
  ```bash
  $ npm link .
  ```
4. Add `check-versions` to either your `.bashrc` or `.zshrc` files.
  * For `.bashrc`
    ```bash
    $ echo '\n# Checks Node and npm versions\ncheck-versions' >> ~/.bashrc
    ```
  * For `.zshrc`
    ```bash
    $ echo '\n# Checks Node and npm versions\ncheck-versions' >> ~/.zshrc
    ```

## License
ISC

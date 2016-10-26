# check-versions

![](/screenshots/screenshot.png)

I can never keep up to date with every single Node, npm, and Git update, so this binary checks your local installations and notifies you if any are out of date so that you can update as soon as possible. Bonus points if it's called every time you open a Terminal window.


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

***OR***

1. Globally install the pseudo-package via npm.

  ```bash
  $ npm --global install https://github.com/nathanbuchar/check-versions.git
  ```

## Usage

* You can run the `check-versions` binary at any time.

  ```bash
  $ check-versions
  ```

* You can add `check-versions` to either your `.bashrc` or `.zshrc` files so that it runs every time you open a new Terminal window.

  * For `.bashrc`

    ```bash
    $ echo '\n# Checks Node, npm, and Git versions\ncheck-versions' >> ~/.bashrc
    ```

  * For `.zshrc`

    ```bash
    $ echo '\n# Checks Node, npm, and Git versions\ncheck-versions' >> ~/.zshrc
    ```

## License
ISC

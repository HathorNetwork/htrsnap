# HathorSnap

*Note: MetaMask Flask is an experimental playground for developers and is not to be confused with the normal [MetaMask wallet app](https://metamask.io/).

##

### MetaMask Snaps Introduction
Snaps is a system that allows developers to safely build and expand the capabilities of MetaMask. It is a program that is run in an isolated environment with a limited set of capabilities, that can customize and modify MetaMask's wallet experience for end users. For example, a snap can add new APIs to MetaMask thus adding support for different blockchains or modify existing functionalities using internal APIs.

Additional information can be found [here](https://docs.metamask.io/guide/snaps.html).

##

### How to run HathorSnap on a wallet locally

Navigate to the `snap` folder under `packages`, launch our app locally by running:

```shell
yarn build && yarn test:snap
```

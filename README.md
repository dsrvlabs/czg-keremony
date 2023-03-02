# CZG-Keremony

Proto-danksharding requires a new cryptographic scheme: KZG Commitments.
This client was created to participate in KZG Ceremony for Proto-danksharding (aka [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844)) in Ethereum.

For more information about KZG Ceremony, please read [Announcing the KZG Ceremony](https://blog.ethereum.org/2023/01/16/announcing-kzg-ceremony) at Ethereum foundation blog.

## Which BLS library did the CZG-Keremony client use?

The BLS library used in the CZG-Keremony client is the [noble-curves](https://github.com/paulmillr/noble-curves) library.

## Why do we make a client with JavaScript?

JavaScript is a versatile language that can run on a wide range of platforms and devices. While there are clients available for other programming languages such as Go, Rust, Java, and C++, there are currently no clients written in pure JavaScript. As a result, a client has been developed in JavaScript for the diversity of the client availability. Having clients written in multiple programming languages can help decentralize the ceremony and make it more robust and secure.

## Dependencies

1. Install `Node.js v18+` and `npm`. 
2. Run `npm install`.

## How to use CZG-Keremony client?

This CZG-Keremony client provides an interactive prompt to participate in KZG ceremony.

To participate in ceremony, you must have at least one that satisfies the following:
- Ethereum - An Ethereum address is required to have sent at least 3 transactions before Jan. 13, 2023 (block number 16,394,155)
- GitHub - A GitHub account that has a commit dated before 1 August 2022 00:00 UTC.

### Step 1. Start interactive prompt

If you want to participate in the actual contribution, please start.

```
~$ ./index.js start
```

If you want to start with a different sequencer address, use the `-s` or `--sequncer` flag.

```
~$ ./index.js start --sequencer https://kzg-ceremony-sequencer-dev.fly.dev 
```

### Step 2. Select authentication method

Choose the authentication method you want, Ethereum or GitHub.

```
Authentication
? Which method do you prefer for authentication? (Use arrow keys)
❯ ethereum 
  github 
```

If you select either `ethereum` or `github`, you will receive a URL.

```
? Which method do you prefer for authentication? ethereum
https://oidc.signinwithethereum.org/authorize?xxxxxx
```

### Step 3. Input your session ID

After accessing the given URL, you need to go through the authentication process and get a session ID, which you then need to input. Once you have inputted your session ID, you can start contributing.

If there is another contributor, the client retries every 30 seconds. Wait until your turn comes.

```
? Input your session ID:  <session ID>
2023-03-02 20:46:00 [ info ] Try and Wait...
2023-03-02 20:46:01 [ info ] another contribution in progress - retry after 30 seconds
2023-03-02 20:46:32 [ info ] another contribution in progress - retry after 30 seconds
2023-03-02 20:47:02 [ info ] another contribution in progress - retry after 30 seconds
2023-03-02 20:47:33 [ info ] another contribution in progress - retry after 30 seconds
```

When it's your turn, run the ceremony 

```
2023-03-02 20:43:18 [ info ] Run Ceremony...
2023-03-02 20:43:18 [ info ] Decoding contributions....
2023-03-02 20:43:35 [ info ] Update Power of Tau...
2023-03-02 20:43:35 [ info ] Run contribute worker
2023-03-02 20:43:35 [ info ] Run contribute worker
2023-03-02 20:43:35 [ info ] Run contribute worker
2023-03-02 20:43:35 [ info ] Run contribute worker
2023-03-02 20:44:12 [ info ] Receive new contribution
2023-03-02 20:44:44 [ info ] Receive new contribution
2023-03-02 20:45:44 [ info ] Receive new contribution
2023-03-02 20:47:41 [ info ] Receive new contribution
2023-03-02 20:47:41 [ info ] Update Witnesses...
2023-03-02 20:47:41 [ info ] Encoding...
2023-03-02 20:47:42 [ info ] Send contributions
2023-03-02 20:47:50 [ info ] Successfully contributed!
2023-03-02 20:47:50 [ info ] {
  receipt: ...
  signature: ...
}
```

If the contribution is successful, you can obtain two files.
- `contributions.json`: Contribution actually submitted to the sequencer.
- `receipt.json`: Receipt received from sequencer for your contribution.

## Contact us
Please, contact [us](mailto:validator@dsrvlabs.com) if you have any improvements and need any further information about **CZG-Keremony**.

**DSRV** is a blockchain infrastructure company that provides powerful and easy-to-use solutions to enable developers and enterprises to become architects of the future. Visit [DSRV](https://dsrvlabs.com/), if you are interested in various products we build for the Web 3.0 developers.

[<img alt="Homepage" src="https://user-images.githubusercontent.com/63234878/210315637-2d30efdd-5b9e-463e-8731-571916a6e1e3.svg" width="50" height="50" />](https://www.dsrvlabs.com/)
[<img alt="Medium" src="https://user-images.githubusercontent.com/6308023/176984456-f82c5c67-ebf3-455c-8494-c64ebfd66c58.svg" width="50" height="50" />](https://medium.com/dsrv)
[<img alt="Github" src="https://user-images.githubusercontent.com/6308023/176984452-c73aa188-563a-4b93-8ad8-cd7974770275.svg" width="50" height="50" />](https://github.com/dsrvlabs)
[<img alt="Youtube" src="https://user-images.githubusercontent.com/6308023/176984454-52c20db5-6b8f-4c15-a621-dd4a0052e99f.svg" width="50" height="50" />](https://www.youtube.com/channel/UCWhv8Kd430cEMpEYBPtSPjA/featured)
[<img alt="Twitter" src="https://user-images.githubusercontent.com/6308023/176984455-d48b24a9-1eb4-4c38-b728-2f4a0ccff09b.svg" width="50" height="50" />](https://twitter.com/dsrvlabs)

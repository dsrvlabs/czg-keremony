# CZG-Keremony

Proto-danksharding requires a new cryptographic scheme: KZG Commitments.
This client was created to participate in KZG Ceremony for Proto-danksharding (aka [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844)) in Ethereum.

For more information about KGZ Ceremony, please read [Announcing the KZG Ceremony](https://blog.ethereum.org/2023/01/16/announcing-kzg-ceremony) at Ethereum foundation blog.

## Which BLS library did the CZG-Keremony client use?

The BLS library used in the CZG-Keremony client is the [noble-curves](https://github.com/paulmillr/noble-curves) library.


## Why do we make a client with JavaScript?

JavaScript is a versatile language that can run on a wide range of platforms and devices. While there are clients available for other programming languages such as Go, Rust, Java, and C++, there are currently no clients written in JavaScript. As a result, a client has been developed in JavaScript to add to the diversity of clients available. Having clients written in multiple programming languages can help decentralize the ceremony and make it more robust and secure.

## Dependencies

1. Install `Node.js v18+` and `npm`. 
2. Run `npm install`.

## How to use CZG-Keremony client?

There are two methods for using the CZG Keremony client to participate in the KZG Ceremony. One option involves contributing through the command line interface (CLI), while the other involves using an interactive prompt.

To participate in ceremony, you must have at least one that satisfies the following:
- Ethereum - An Ethereum address is required to have sent at least 3 transactions before Jan. 13, 2023 (block number 16,394,155)
- GitHub - A GitHub account that has a commit dated before 1 August 2022 00:00 UTC.

### 1. Command Line Interface (CLI)
#### Step 1. Get  seesion ID
Before start participating the ceremony, you should retrieve **session ID** from Ethereum or Github.

Try below, then you can get links to process authentication.

```
~$ ./index.js auth
```

#### Step 2. Start ceremony

Copy **session ID** and try below.

```
~$ ./index.js ceremony <session ID>

- Ethereum: <ethereum authentication address>
- Github: <github authentication address>
```

If you want to add entropy for Random, try below.

```
~$ ./index.js ceremony <session id> -e <entropy word>
~$ ./index.js ceremony <session id> --entropy <entropy word>
```

You can also use docker.

```
~$ docker run rootwarp/czg-keremony:latest index.js auth
~$ docker run rootwarp/czg-keremony:latest index.js <session id>
```



### 2. Interactive prompt

#### Step 1. Start interactive prompt

```
~$ ./index.js start
```

#### Step 2. Select authentication method

Choose the authentication method you want, Ethereum or GitHub.

```
Authentication
? Which method do you prefer for authentication? (Use arrow keys)
❯ ethereum 
  github 
```

### Step 3. Input your session ID

If you choose for the authentication method, you will receive a URL. Once you complete the authentication process, you should obtain a session ID and input it.

```
? Input your session ID:  <session ID>
Try and Wait...
Run Ceremony...
```

If you enter the session ID, you are ready for the contribution.

## Contact us
Please, contact [us](mailto:validator@dsrvlabs.com) if you have any improvements and need any further information about **CZG-Keremony**.

**DSRV** is a blockchain infrastructure company that provides powerful and easy-to-use solutions to enable developers and enterprises to become architects of the future. Visit [DSRV](https://www.dsrvlabs.com/), if you are interested in various products we build for the Web 3.0 developers.

[<img alt="Homepage" src="https://user-images.githubusercontent.com/63234878/210315637-2d30efdd-5b9e-463e-8731-571916a6e1e3.svg" width="50" height="50" />](https://www.dsrvlabs.com/)
[<img alt="Medium" src="https://user-images.githubusercontent.com/6308023/176984456-f82c5c67-ebf3-455c-8494-c64ebfd66c58.svg" width="50" height="50" />](https://medium.com/dsrv)
[<img alt="Github" src="https://user-images.githubusercontent.com/6308023/176984452-c73aa188-563a-4b93-8ad8-cd7974770275.svg" width="50" height="50" />](https://github.com/dsrvlabs)
[<img alt="Youtube" src="https://user-images.githubusercontent.com/6308023/176984454-52c20db5-6b8f-4c15-a621-dd4a0052e99f.svg" width="50" height="50" />](https://www.youtube.com/channel/UCWhv8Kd430cEMpEYBPtSPjA/featured)
[<img alt="Twitter" src="https://user-images.githubusercontent.com/6308023/176984455-d48b24a9-1eb4-4c38-b728-2f4a0ccff09b.svg" width="50" height="50" />](https://twitter.com/dsrvlabs)

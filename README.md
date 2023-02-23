# CZG-Keremony

Before start participating the ceremony, you should retrieve **session ID** from Ethereum or Github.

Try below, then you can get links to process authentication.
```
~$ ./index.js auth
```

Copy **session ID** and try below.

```
~$ ./index.js ceremony <session id>
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

To use more interactive way, try
```
~$ ./index.js start
```

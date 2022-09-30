# sugarshin-bolt

[![CircleCI](https://circleci.com/gh/sugarshin/sugarshin-bolt/tree/master.svg?style=svg&circle-token=2007d9ccb9f8beb24cd67aa44634c85cdef84f53)](https://circleci.com/gh/sugarshin/sugarshin-bolt/tree/master)

## Development

Port forwarding with [portmap.io](https://portmap.io)

```shell
❯ ssh -i ~/.ssh/<private key file> <portmap usename>.<configuration name>@<portmap username>-<port number>.portmap.io -N -R <port number>:localhost:<localhost portnumber>
❯ npm run dev
```

## Deploy

Merge to master branch will trigger Automatic deploys to [render](https://render.com/).

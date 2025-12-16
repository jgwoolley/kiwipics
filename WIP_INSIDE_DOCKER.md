```
docker run -it --rm ubuntu /bin/bash
apt update --yes
DEBIAN_FRONTEND=noninteractive apt-get install --yes git-all curl unzip

curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install
rm -rf ./aws awscliv2.zip
```
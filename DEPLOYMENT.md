### Production Deployment

#### From Scratch:
Create new Ubuntu droplet

log in as root:
```
$ ssh root@your_server_ip
```

Add user:
```
# adduser homegrid
```

Give new user sudo privledges:
```
# usermod -aG sudo homegrid
```


Enable firewall but allow ssh connections
```
# ufw allow OpenSSH
# ufw enable
```

Enable ssh access for new admin user
```
# cp -r ~/.ssh /home/homegrid
# chown -R homegrid:homegrid /home/homegrid/.ssh
```

disconnect and reconnect as new user:
```
$ ssh homegrid@your_server_ip
```




install docker dependencies and add registry:
```
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
```

Check that the `docker-ce` candidate comes from the docker repository (`focal`)
```
apt-cache policy docker-ce
```

Install docker
```
sudo apt install docker-ce
```

Add user to the docker group 
```
sudo usermod -aG docker ${USER}
```

reload 
```
su - ${USER}
```



Look up latest release of docker-compose from :
https://github.com/docker/compose/releases

install docker compose at VERSION
```
sudo curl -L "https://github.com/docker/compose/releases/download/VERSION/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

update permissions
```
sudo chmod +x /usr/local/bin/docker-compose
```

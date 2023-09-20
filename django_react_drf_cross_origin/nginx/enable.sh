ln -sf $(dirname -- "$(realpath -- $0;)";)/sback /etc/nginx/sites-enabled/sback
ln -sf $(dirname -- "$(realpath -- $0;)";)/sfront /etc/nginx/sites-enabled/sfront
sudo systemctl restart nginx.service
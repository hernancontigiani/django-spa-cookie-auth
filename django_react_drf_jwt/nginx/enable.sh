ln -sf $(dirname -- "$(realpath -- $0;)";)/sback /etc/nginx/sites-enabled/sback
ln -sf $(dirname -- "$(realpath -- $0;)";)/sfront /etc/nginx/sites-enabled/sfront
ln -sf $(dirname -- "$(realpath -- $0;)";)/sflask /etc/nginx/sites-enabled/sflask
sudo systemctl restart nginx.service

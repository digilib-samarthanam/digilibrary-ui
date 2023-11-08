cd /home/ec2-user/
rm -R -f build/
wget https://github.com/digilib-samarthanam/digilibrary-ui/archive/refs/heads/main.zip
unzip main.zip
mv digilibrary-ui-main/build/ /home/ec2-user/
chown -R root:root build
mv -f digilibrary-ui-main/nginx.conf /etc/nginx/
chown -R root:root /etc/nginx/nginx.conf
rm -R -f digilibrary-ui-main/
rm -f master.zip
service nginx restart

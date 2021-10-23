# App name
appName = "CMS"

# Encryption
# Try to keep the below keep long, but not too much long
# please reset the system before changing, 
# changing while system is working will logout all the users
key = b"8@95d2f4de57e436"

# DB
dbname = "cms"
dbusername = "root"
dbpassword = ""
dbhost = "localhost"

# Token
token_validity_days = 7

# Email
email_host = "smtp.gmail.com"
email_port = 587
email_username = "pratyushtiwary33@gmail.com"
email_password = "nvegvumcbvyxlvix"

# OTP
otp_validity_minutes = 30 

# Files
max_file_size = 0 #(in megabytes) set 0 for no restriction
allowed_file_types = ["jpeg","jpg","png","svg","gif","bmp","ico"]
save_path = "images"

# url - Cross origin
# URL - for mails
url = URL = "http://localhost:3000"
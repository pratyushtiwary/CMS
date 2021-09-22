from Crypto.Cipher import AES
from globals import key
from Crypto.Random import get_random_bytes
import hashlib
import base64 as b64

def encrypt(msg:str,salt:str=key):
	"""
		Encrypts the given message with a salt

		args :- 
			msg :- Message to encrypt,
			salt :- Salt to encrypt (default equals to globals.key)
	"""
	iv = get_random_bytes(16)
	cipher = AES.new(salt,AES.MODE_GCM,iv)
	msg = bytes(msg,"utf8")
	encrypted_msg = cipher.encrypt(msg)
	encrypted_msg = iv + encrypted_msg
	encrypted_msg = str(b64.b64encode(encrypted_msg),"utf-8")
	return encrypted_msg

def decrypt(msg:str,salt:str=key):
	"""
		Decrypts the given encrypted message with a salt
		
		*Message should be encrypted with the encrypt function

		If unable to decrypt will raise Exception

		args :- 
			msg :- Encrypted message to decrypt,
			salt :- Salt to decrypt (default equals to globals.key)
	"""
	try:
		msg = b64.b64decode(msg)
		iv = msg[:16]
		msg = msg[16:]
		cipher = AES.new(salt,AES.MODE_GCM,iv)
		decrypted_msg = str(cipher.decrypt(msg),"utf-8")
		return decrypted_msg
	except:
		raise Exception("Invalid Decryption")


def password_hash(plainpwd:str):
	"""
		Returns hashed string from plain string
	"""
	res = hashlib.sha256(plainpwd.encode())
	return res.hexdigest()

def password_verify(hashedpwd:str,plainpwd:str):
	"""
		Returns True is passwords matches
	"""
	hpwd = hashlib.sha256(plainpwd.encode())
	hpwd = hpwd.hexdigest()
	return hashedpwd==hpwd
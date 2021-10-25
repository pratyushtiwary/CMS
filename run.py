import sys
import runScripts.setup as setup

def main():
	try:
		command = sys.argv[1]
	except:
		print("Invalid Command!")
		exit(1)

	if command == "setup":
		setup.run()
	else:
		print("Invalid Command!")

if __name__ == '__main__':
	main()
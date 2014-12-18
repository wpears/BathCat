import subprocess

def PasswordPrompt(prompt="Enter your password: "):  
  cmd=r'python -c "from getpass import getpass; password=getpass(\"'+prompt+r'\"); print password"'
  p = subprocess.Popen(cmd, stdout=subprocess.PIPE)
  output, err = p.communicate()
  if (err==None):
    return output.strip()
  return ""
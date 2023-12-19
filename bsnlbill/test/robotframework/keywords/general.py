import keyboard
import time

def Open_file(file):
    time.sleep(3)
    keyboard.write(file)
    keyboard.press("enter")
    time.sleep(3)
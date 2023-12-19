import  os
def file_exists(file):
    return os.path.isfile(file)

def abs_path(path):
    return os.path.abspath(path)

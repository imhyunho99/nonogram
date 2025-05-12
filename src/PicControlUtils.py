from PIL import Image
import numpy as np
from matplotlib import pyplot as plt
from matplotlib import colors as col

def makeImnage(SIZE, IMAGE):
    pix = np.array(IMAGE)
    list_test = pix.tolist()
    pix_list = [[0 for j in range(SIZE)] for i in range(SIZE)]
    colormap = col.ListedColormap(["black", "white"])  # color param, Can use two or more color options


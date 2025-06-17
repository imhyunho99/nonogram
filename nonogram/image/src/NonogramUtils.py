"""
image transform procedure

1. Edge detection
2. To GrayScale
3. Gray Scale to bitmap

=> 0/1 map object

"""
import cv2
import numpy as np
from PIL import Image


class NonogramUtils:

    @staticmethod
    def edge_detect(pil_image: Image.Image) -> Image.Image:
        cv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, threshold1=50, threshold2=150)
        return Image.fromarray(edges)

    @staticmethod
    def to_grayscale(pil_image: Image.Image) -> Image.Image:
        cv_image = np.array(pil_image)
        if len(cv_image.shape) == 3 and cv_image.shape[2] == 3:
            gray = cv2.cvtColor(cv_image, cv2.COLOR_RGB2GRAY)
        elif len(cv_image.shape) == 2:
            gray = cv_image
        else:
            raise ValueError("Unsupported image format for grayscale conversion")
        return Image.fromarray(gray)

    @staticmethod
    def to_grid(pil_image: Image.Image, grid_size: int) -> list[list[int]]:
        cv_image = np.array(pil_image)
        # 1. resize to grid size
        resized = cv2.resize(cv_image, (grid_size, grid_size), interpolation=cv2.INTER_NEAREST)

        # 2. threshold to binary (0 or 1)
        _, binary = cv2.threshold(resized, 127, 1, cv2.THRESH_BINARY_INV)

        # 3. convert to list of lists
        grid = binary.tolist()
        return grid

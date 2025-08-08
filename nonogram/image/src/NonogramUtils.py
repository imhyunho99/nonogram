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
    def print_image_as_ascii(pil_image: Image.Image, new_width=60):
        """PIL 이미지를 ASCII 문자로 변환하여 터미널에 출력합니다."""
        # 1. 이미지를 작은 크기로 조정
        width, height = pil_image.size
        aspect_ratio = height / width
        new_height = int(aspect_ratio * new_width * 0.55) # 폰트 비율에 맞게 높이 조정
        resized_image = pil_image.resize((new_width, new_height))
        
        # 2. 흑백으로 변환
        grayscale_image = resized_image.convert("L")
        
        # 3. 픽셀을 ASCII 문자에 매핑
        pixels = grayscale_image.getdata()
        ascii_chars = "@%#*+=-:. " # 밝을수록 공백에 가까운 문자
        ascii_str = ""
        for pixel_value in pixels:
            ascii_str += ascii_chars[pixel_value * (len(ascii_chars) - 1) // 255]
        
        # 4. 줄바꿈하여 출력
        for i in range(0, len(ascii_str), new_width):
            print(ascii_str[i:i + new_width])

    @staticmethod
    def edge_detect(pil_image: Image.Image) -> Image.Image:
        cv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, threshold1=50, threshold2=150)
        print("\n--- 1. Edge Detect 결과 ---")
        NonogramUtils.print_image_as_ascii(Image.fromarray(edges))
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
        print("\n--- 2. Grayscale 결과 ---")
        NonogramUtils.print_image_as_ascii(Image.fromarray(gray))
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

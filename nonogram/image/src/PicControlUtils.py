from PIL import Image
import numpy as np
from matplotlib import pyplot as plt
from matplotlib import colors
from io import BytesIO


class NonogramUtils:
    @staticmethod
    def make_image(size, image: Image.Image) -> Image.Image:

        image = image.resize((size, size))
        gray = image.convert("L")
        bw = gray.point(lambda x: 1 if x > 128 else 0, '1')  # 흑 0 / 백 1
        array = np.array(bw, dtype=int)


        row_hints = [NonogramUtils._get_hint(row) for row in array]
        col_hints = [NonogramUtils._get_hint(col) for col in array.T]


        max_row_hint = max(len(h) for h in row_hints)
        max_col_hint = max(len(h) for h in col_hints)

        total_height = size + max_col_hint
        total_width = size + max_row_hint


        fig, ax = plt.subplots(figsize=(total_width / 2, total_height / 2))
        ax.set_xlim(0, total_width)
        ax.set_ylim(0, total_height)
        ax.set_xticks([])
        ax.set_yticks([])
        ax.invert_yaxis()

        cmap = colors.ListedColormap(['black', 'white'])
        ax.imshow(array, cmap=cmap, extent=[max_row_hint, total_width, max_col_hint, total_height])


        for i, hint in enumerate(row_hints):
            for j, num in enumerate(reversed(hint)):
                ax.text(j + max_row_hint - len(hint), i + max_col_hint + 0.5, str(num), ha='center', va='center', fontsize=6)

        for j, hint in enumerate(col_hints):
            for i, num in enumerate(reversed(hint)):
                ax.text(j + max_row_hint + 0.5, i + max_col_hint - len(hint), str(num), ha='center', va='center', fontsize=6)

        plt.axis('off')
        buf = BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0.1)
        plt.close(fig)
        buf.seek(0)

        result_img = Image.open(buf)
        return result_img

    @staticmethod
    def _get_hint(line):
        hint = []
        count = 0
        for val in line:
            if val == 0:
                count += 1
            elif count > 0:
                hint.append(count)
                count = 0
        if count > 0:
            hint.append(count)
        return hint or [0]

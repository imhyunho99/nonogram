from multiprocessing.managers import MakeProxyType
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from PIL import Image
import base64
from io import BytesIO

from .models import OriginImage, NonogramImage
from .serializers import OriginImageSerializer, NonogramImageSerializer
from .src.NonogramUtils import NonogramUtils


class OriginImageCreateView(generics.ListCreateAPIView):  #collect image data from user and change it GrayScale : Upload only
    queryset = OriginImage.objects.all()
    serializer_class = OriginImageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class NonogramImageCreateView(generics.CreateAPIView):
    serializer_class = NonogramImageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        origin_id = request.data.get('origin_id')
        size = int(request.data.get('size', 10))  # 기본 사이즈 10
        origin = OriginImage.objects.get(id=origin_id, user=request.user)

        """try:
          \  
        except OriginImage.DoesNotExist:
            return Response({"error": "HTTP_404_NOT_FOUND"}, status=status.HTTP_404_NOT_FOUND)"""

        image_data = base64.b64decode(origin.image_data)
        image = Image.open(BytesIO(image_data)).convert("RGB")

        # 1. Edge Detection → 2. Grayscale → 3. Resize to Grid
        edge_image = NonogramUtils.edge_detect(image)
        gray_image = NonogramUtils.to_grayscale(edge_image)
        processed_image = NonogramUtils.to_grid(gray_image, size)

        buffered = BytesIO()
        processed_image.save(buffered, format="PNG")
        encoded_image = base64.b64encode(buffered.getvalue()).decode('utf-8')
        final_data = f"data:image/png;base64,{encoded_image}"

        # NonogramImage
        nonogram = NonogramImage.objects.create(
            user=request.user,
            origin=origin,
            size=size,
            image_data=final_data
        )

        serializer = self.get_serializer(nonogram)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class OriginImageListView(generics.ListAPIView):  # (show maked nonogram image)
    serializer_class = OriginImageSerializer
    permission_classes = [permissions.IsAuthenticated]   

    def get_queryset(self):
        return OriginImage.objects.filter(user_id=self.request.user)


class NonogramImageListView(generics.ListAPIView):  # (show maked nonogram image)
    serializer_class = NonogramImageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return NonogramImage.objects.filter(user_id=self.request.user)



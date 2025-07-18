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
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = OriginImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NonogramImageCreateView(generics.CreateAPIView):
    serializer_class = NonogramImageSerializer
    permission_classes = [permissions.IsAuthenticated]


    def post(self, request, *args, **kwargs):
        origin_id = request.data.get('origin_id')
        size = request.data.get('size', 10)

        if not origin_id:
            return Response({"error": "origin_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            size = int(size)
        except ValueError:
            return Response({"error": "size must be an integer"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            origin = OriginImage.objects.get(id=origin_id, user=request.user)
        except OriginImage.DoesNotExist:
            return Response({"error": f"OriginImage with id={origin_id} not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            image_data = base64.b64decode(origin.image_data)
            image = Image.open(BytesIO(image_data)).convert("RGB")

            edge_image = NonogramUtils.edge_detect(image)
            gray_image = NonogramUtils.to_grayscale(edge_image)
            grid = NonogramUtils.to_grid(gray_image, size)

            import json
            grid_str = json.dumps(grid)

            nonogram = NonogramImage.objects.create(
                user=request.user,
                origin=origin,
                size=size,
                image_data=grid_str
            )

            serializer = self.get_serializer(nonogram)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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



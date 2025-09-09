from multiprocessing.managers import MakeProxyType
from PIL import Image
import base64
from io import BytesIO
import traceback
import json

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import RetrieveAPIView

from .models import OriginImage, NonogramImage
from .serializers import OriginImageSerializer, NonogramImageSerializer
from .src.NonogramUtils import NonogramUtils

class OriginImageCreateView(generics.ListCreateAPIView):  #collect image data from user and change it GrayScale : Upload only
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        serializer = OriginImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.error())
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NonogramImageCreateView(generics.CreateAPIView):
    serializer_class = NonogramImageSerializer
    permission_classes = [permissions.IsAuthenticated]


    def post(self, request, *args, **kwargs):
        origin_id = request.data.get('origin_id')
        size = int(request.data.get('size'))

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
            image = Image.open(origin.image.path).convert("RGB")
            print("image open success")
            edge_image = NonogramUtils.edge_detect(image)
            print("image : nonogramUtils.edge_detection")
            gray_image = NonogramUtils.to_grayscale(edge_image)
            print("image: NonogramUtils.to_grayscale")
            grid = NonogramUtils.to_grid(gray_image, size)
            print("image: to_grid")

            grid_str = json.dumps(grid)
            print("grid - json.dump")
            nonogram = NonogramImage.objects.create(
                user=request.user,
                origin=origin,
                size=size,
                image_data=grid_str
            )
            print("nonogram image create")
            serializer = self.get_serializer(nonogram)
            print("serializeing")
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            traceback.print_exc()
            print("Authentic User:", request.user)
            print(type(image))
            print("Nonogram Encoding Error:", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class OriginImageListView(generics.ListAPIView):  # (show maked nonogram image)
    serializer_class = OriginImageSerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):
        return OriginImage.objects.filter(user_id=self.request.user).order_by('uploaded_at')


class OriginImageDetailView(RetrieveAPIView):
    queryset = OriginImage.objects.all()
    serializer_class = OriginImageSerializer


"""class NonogramImageListView(generics.ListAPIView):  # (show maked nonogram image)
    serializer_class = NonogramImageSerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):
        return NonogramImage.objects.filter(user_id=self.request.user)
"""


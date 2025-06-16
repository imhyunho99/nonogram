from multiprocessing.managers import MakeProxyType

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import OriginImage, NonogramImage
from .serializers import OriginImageSerializer, NonogramImageSerializer
from .src.PicControlUtils import NonogramUtils
import base64
from PIL import Image
from io import BytesIO


class OriginImageListCreateView(generics.ListCreateAPIView):  #collect image data from user and change it GrayScale : Upload only
    queryset = OriginImage.objects.all()
    serializer_class = OriginImageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):

        return self.queryset.filter(user=self.request.user)


class NonogramImageCreateView(generics.CreateAPIView): #create nonogram image by size (can change grid size)
    serializer_class = NonogramImageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        origin_id = request.data.get('origin_id')
        size = int(request.data.get('size', 10))  # 기본 사이즈 10
        try:
            origin = OriginImage.objects.get(id=origin_id, user=request.user)
        except OriginImage.DoesNotExist:
            return Response({"error": "HTTP_404_NOT_FOUND"}, status=status.HTTP_404_NOT_FOUND)


        image_data = base64.b64decode(origin.image_data.split(',')[-1])
        image = Image.open(BytesIO(image_data)).convert("RGB")


        processed_image = NonogramUtils.make_image(size, image)


        buffered = BytesIO()
        processed_image.save(buffered, format="PNG")
        encoded_image = base64.b64encode(buffered.getvalue()).decode('utf-8')
        final_data = f"data:image/png;base64,{encoded_image}"


        nonogram = NonogramImage.objects.create(
            user=request.user,
            origin=origin,
            size=size,
            image_data=final_data
        )

        serializer = self.get_serializer(nonogram)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class NonogramImageListView(generics.ListAPIView):  # (show maked nonogram image)
    serializer_class = OriginImageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        print(OriginImage.objects.filter(user_id=self.request.user).query)
        return OriginImage.objects.filter(user_id=self.request.user)



from rest_framework import generics, filters, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Product, StockMovement
from .serializers import ProductSerializer, StockMovementSerializer

class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'current_stock']
    ordering = ['name']

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

class StockMovementListCreateView(generics.ListCreateAPIView):
    queryset = StockMovement.objects.all().order_by('-movement_date')
    serializer_class = StockMovementSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        movement = serializer.instance
        if movement.movement_type == 'OUT' and movement.product.current_stock < movement.product.min_stock:
            headers = self.get_success_headers(serializer.data)
            return Response(
                {
                    "data": serializer.data,
                    "warning": f"ALERTA: O produto {movement.product.name} está abaixo do estoque mínimo!" 
                },
                status=status.HTTP_201_CREATED,
                headers=headers
            )
            
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
from rest_framework import serializers
from .models import Produto, Estoque

class ProdutoSerializer(serializers.ModelSerializer):
    is_low_stock = serializers.SerializerMethodField()

    class Meta:
        model = Produto
        fields = '__all__'

    def get_is_low_stock(self, obj):
        return obj.current_stock < obj.min_stock

class EstoqueSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    user_name = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Estoque
        fields = '__all__'
from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class Produto(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    min_stock = models.IntegerField(default=0, help_text="Estoque mínimo para alertas")
    current_stock = models.IntegerField(default=0)
    material = models.CharField(max_length=50, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Estoque(models.Model):
    MOVEMENT_TYPES = [
        ('IN', 'Entrada'),
        ('OUT', 'Saída'),
    ]

    product = models.ForeignKey(Produto, on_delete=models.CASCADE, related_name='movements')
    movement_type = models.CharField(max_length=3, choices=MOVEMENT_TYPES)
    quantity = models.PositiveIntegerField()
    movement_date = models.DateTimeField()
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            if self.movement_type == 'IN':
                self.product.current_stock += self.quantity
            elif self.movement_type == 'OUT':
                if self.product.current_stock < self.quantity:
                    raise ValidationError("Estoque insuficiente para esta saída.")
                self.product.current_stock -= self.quantity
            
            self.product.save()
            
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.get_movement_type_display()} - {self.product.name} ({self.quantity})"